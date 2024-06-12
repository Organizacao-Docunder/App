import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifySecretAnswerDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  questionId: number;

  @IsNotEmpty()
  answer: string;
}
