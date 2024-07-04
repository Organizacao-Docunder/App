import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RecoverPasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(74, { message: 'Email must be at most 74 characters long.' })
  @IsEmail({ ignore_max_length: true })
  email: string;
}
