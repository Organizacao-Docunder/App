import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginRequestBody {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
