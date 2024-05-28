import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from 'src/utils/bcrypt-utils';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await hashPassword(createUserDto.password);

    const data = {
      ...createUserDto,
      password: hashedPassword,
    };
    const createdUser = await this.prisma.user.create({ data });
    const { password, createdAt, updatedAt, ...user } = createdUser;
    return user;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ) {
    const user = await this.findById(id);
    if (!user || user.id != currentUser.id) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('The email is already in use');
      }
    }

    let hashedPassword = user.password;
    if (updateUserDto.password) {
      hashedPassword = await hashPassword(updateUserDto.password);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: hashedPassword,
      },
    });
    const { password, createdAt, updatedAt, ...updatedUserData } = updatedUser;
    return updatedUserData;
  }

  async findByEmail(email: string) {
    if (!email) {
      throw new BadRequestException('E-mail is required.');
    }
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<UserFromJwt[]> {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async deleteUser(id: number, currentUser: User) {
    const user = await this.findById(id);
    if (!user || user.id != currentUser.id) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.delete({ where: { id } });
  }
}
