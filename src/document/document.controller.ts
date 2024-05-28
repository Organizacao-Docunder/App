import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { CheckJson } from 'src/auth/decorators/check-json.decorator';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto) {
    return await this.documentService.createUser(createDocumentDto);
  }

  @Get()
  async findAll() {
    return await this.documentService.findAll();
  }

  @Get(':id')
  async findDocumentById(@Param('id') id: string) {
    return await this.documentService.findDocumentById(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @CheckJson() data: any,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    const updatedDocument = await this.documentService.updateDocument(
      +id,
      updateDocumentDto,
    );
    return updatedDocument;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.documentService.deleteDocument(+id);
    return { message: ['Document deleted successfully'] };
  }
}
