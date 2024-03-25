import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @IsPublic()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      return { errors: ['The email is already in use.'] };
    }
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.findById(+id);
    if (!user) {
      return { errors: ['User not found.'] };
    }

    const existingUser = await this.userService.findByEmail(
      updateUserDto.email,
    );
    if (existingUser && existingUser.id !== +id) {
      return { errors: ['The email is already in use.'] };
    }

    const updatedUser = await this.userService.update(+id, updateUserDto);
    const { id: userId, name, email } = updatedUser;
    return { id: userId, name, email };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const user = await this.userService.findById(+id);
    if (!user) {
      return { errors: ['User not found.'] };
    }
    await this.userService.delete(+id);
    return {
      message: ['User deleted successfully'],
    };
  }
}
