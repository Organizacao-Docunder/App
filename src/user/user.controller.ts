import {
  Body,
  ConflictException,
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { CheckJson } from 'src/auth/decorators/check-json.decorator';
import { SecretQuestion } from './interfaces/SecretQuestion';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifySecretAnswerDto } from './dto/verify-secret-answer.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  async create(
    @CheckJson() data: any,
    @Body() createUserDto: CreateUserDto,
    @Body('secretAnswers') secretAnswers: SecretQuestion[],
  ) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('The email is already in use');
    }

    if (!secretAnswers || secretAnswers.length !== 3) {
      throw new BadRequestException('Three secret questions are required.');
    }

    return await this.userService.createUser(createUserDto, secretAnswers);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
    @CheckJson() data: any,
  ) {
    const updatedUser = await this.userService.updateUser(
      +id,
      updateUserDto,
      currentUser,
    );
    return updatedUser;
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() currentUser: User) {
    await this.userService.deleteUser(+id, currentUser);
    return { message: ['User deleted successfully'] };
  }

  @IsPublic()
  @Post('recover-password')
  async recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return this.userService.recoverPassword(recoverPasswordDto.email);
  }

  @IsPublic()
  @Post('verify-secret-answer')
  async verifySecretAnswer(
    @Body() verifySecretAnswerDto: VerifySecretAnswerDto,
  ) {
    return this.userService.verifySecretAnswer(verifySecretAnswerDto);
  }

  @IsPublic()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }
}
