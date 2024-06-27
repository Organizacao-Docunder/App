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
import { compareText, hashText } from 'src/utils/bcrypt-utils';
import { SecretQuestion } from './interfaces/SecretQuestion';
import { hashSecretQuestions } from 'src/utils/hashSecretQuestions';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifySecretAnswerDto } from './dto/verify-secret-answer.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    createUserDto: CreateUserDto,
    secretQuestions: SecretQuestion[],
  ) {
    const hashedPassword = await hashText(createUserDto.password);
    const hashedAnswer = await hashSecretQuestions(secretQuestions);

    const createdUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        secretAnswers: {
          create: hashedAnswer.map((answer) => ({
            questionId: answer.questionId,
            encryptedAnswer: answer.hashedAnswer,
          })),
        },
      },
    });

    const { password, createdAt, updatedAt, ...user } = createdUser;
    return user;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ) {
    if (!id || typeof id === 'string') {
      throw new BadRequestException('Invalid ID');
    }
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
      hashedPassword = await hashText(updateUserDto.password);
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
    if (!id || typeof id === 'string') {
      throw new BadRequestException('Invalid ID');
    }
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

  async recoverPassword(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const questions = await this.prisma.secretQuestion.findMany({
      where: {
        secretAnswer: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    return questions;
  }

  async verifySecretAnswer(verifySecretAnswerDto: VerifySecretAnswerDto) {
    const user = await this.findByEmail(verifySecretAnswerDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const answer = await this.prisma.secretAnswer.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId: Number(verifySecretAnswerDto.questionId),
        },
      },
    });

    if (
      !answer ||
      !(await compareText(
        verifySecretAnswerDto.answer.toLowerCase(),
        answer.encryptedAnswer,
      ))
    ) {
      throw new BadRequestException('Incorrect answer');
    }

    return { message: 'Answer verified. Proceed to reset password.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.findByEmail(resetPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await hashText(resetPasswordDto.newPassword);

    await this.prisma.user.update({
      where: { email: resetPasswordDto.email },
      data: { password: hashedPassword },
    });

    return { message: 'Password reset successfully' };
  }
}
