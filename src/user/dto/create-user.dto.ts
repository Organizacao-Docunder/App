import { User } from '../entities/user.entity';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SecretQuestion } from '../interfaces/SecretQuestion';

export class CreateUserDto extends User {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(74, { message: 'Email must be at most 74 characters long.' })
  @IsEmail({ ignore_max_length: true })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(74)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password Too Weak',
  })
  password: string;

  @MinLength(1)
  @MaxLength(74)
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-zA-Z\u00C0-\u017F])[\w\s\u00C0-\u017F]+$/, {
    message: 'The name should only contain letters and spaces.',
  })
  name: string;

  @IsArray()
  @IsNotEmpty()
  secretAnswers: SecretQuestion[];
}
