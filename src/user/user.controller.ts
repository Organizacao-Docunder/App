import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.findById(+id);
    if (!user) {
      return { errors: ['Usuário não encontrado.'] };
    }

    const existingUser = await this.userService.findByEmail(
      updateUserDto.email,
    );
    if (existingUser && existingUser.id !== +id) {
      return { errors: ['O email já está em uso.'] };
    }

    const updatedUser = await this.userService.update(+id, updateUserDto);
    const { id: userId, name, email } = updatedUser;
    return { id: userId, name, email };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const user = await this.userService.findById(+id);
    if (!user) {
      return { errors: ['Usuário não encontrado.'] };
    }
    await this.userService.delete(+id);
    return 'Usuário deletado com sucesso! Faça login ou crie sua conta novamente.';
  }
}
