import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifySecretAnswerDto } from './dto/verify-secret-answer.dto';
import { User } from './entities/user.entity';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { SecretQuestion } from './interfaces/SecretQuestion';
import { compareText, hashText } from 'src/utils/bcrypt-utils';
import { hashSecretQuestions } from 'src/utils/hashSecretQuestions';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    createUserDto: CreateUserDto,
    secretAnswers: SecretQuestion[],
  ) {
    await this.checkForExistingUser(createUserDto.email);
    this.validateSecretAnswers(secretAnswers);

    const hashedPassword = await hashText(createUserDto.password);
    const hashedAnswer = await hashSecretQuestions(secretAnswers);

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
    this.validateUserId(id);
    await this.checkUserExists(id, currentUser);

    if (updateUserDto.email !== currentUser.email) {
      await this.checkForExistingUser(updateUserDto.email);
    }

    let hashedPassword = currentUser.password;
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

    const {
      password: _,
      createdAt,
      updatedAt,
      ...updatedUserData
    } = updatedUser;
    return updatedUserData;
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
    this.validateUserId(id);
    await this.checkUserExists(id, currentUser);

    await this.prisma.user.delete({
      where: { id },
    });
  }

  async recoverPassword(email: string) {
    const user = await this.findByEmail(email);
    this.checkUserExists(user.id); // Assuming checkUserExists validates user existence

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
    this.checkUserExists(user.id); // Assuming checkUserExists validates user existence

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
    this.checkUserExists(user.id); // Assuming checkUserExists validates user existence

    const hashedPassword = await hashText(resetPasswordDto.newPassword);

    await this.prisma.user.update({
      where: { email: resetPasswordDto.email },
      data: { password: hashedPassword },
    });

    return { message: 'Password reset successfully' };
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
    this.validateUserId(id);
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
  // Regras de verificação
  private async checkForExistingUser(email: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('The email is already in use');
    }
  }

  private validateSecretAnswers(secretAnswers: SecretQuestion[]) {
    if (!secretAnswers || secretAnswers.length !== 3) {
      throw new BadRequestException('Three secret questions are required.');
    }

    const questionIds = new Set(
      secretAnswers.map((answer) => answer.questionId),
    );
    if (questionIds.size !== secretAnswers.length) {
      throw new BadRequestException('Secret question IDs must be unique.');
    }
  }

  private async checkUserExists(id: number, currentUser?: User) {
    const user = await this.findById(id);
    if (!user || (currentUser && user.id !== currentUser.id)) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private validateUserId(id: number) {
    if (!id || typeof id !== 'number') {
      throw new BadRequestException('Invalid user ID');
    }
  }
}
