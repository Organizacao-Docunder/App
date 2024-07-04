import {
  IsInt,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { SecretQuestion } from '../interfaces/SecretQuestion';

export class CreateSecretQuestionsDto implements SecretQuestion {
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
