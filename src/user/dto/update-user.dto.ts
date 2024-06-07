import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { SecretQuestion } from '../types/SecretQuestion';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  secretAnswers?: SecretQuestion[];
}
