import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  creatorId: string;

  // @IsNotEmpty()
  @IsString()
  content: string;
}


