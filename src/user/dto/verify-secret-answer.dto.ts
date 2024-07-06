import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class VerifySecretAnswerDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1, { message: 'Question ID must be greater than or equal to 1.' })
  @Max(9, { message: 'Question ID must be less than or equal to 9.' })
  questionId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(74)
  answer: string;
}
