import { User } from '../entities/user.entity';
import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto extends User {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(74, { message: 'Email must be at most 74 characters long.' })
  email: string;

  @IsString()
  @IsNotEmpty()
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
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'The name should only contain letters and spaces.',
  })
  name: string;
}
