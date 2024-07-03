import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
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
import { Response } from 'express';

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
    return await this.userService.createUser(createUserDto, secretAnswers);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
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
  async recoverPassword(
    @Body() recoverPasswordDto: RecoverPasswordDto,
    @CheckJson() data: any,
  ) {
    return this.userService.recoverPassword(recoverPasswordDto.email);
  }

  @IsPublic()
  @Post('verify-secret-answer')
  async verifySecretAnswer(
    @Body() verifySecretAnswerDto: VerifySecretAnswerDto,
    @CheckJson() data: any,
    @Res() response: Response,
  ) {
    return this.userService.verifySecretAnswer(verifySecretAnswerDto, response);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @CheckJson() data: any,
    @CurrentUser() currentUser: User,
  ) {
    console.log(currentUser);
    return this.userService.resetPassword(resetPasswordDto, currentUser);
  }
}
