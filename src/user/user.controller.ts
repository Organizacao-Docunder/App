import {
  Body,
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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  async create(@CheckJson() data: any, @Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      return { errors: ['The email is already in use.'] };
    }
    return await this.userService.createUser(createUserDto);
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
}
