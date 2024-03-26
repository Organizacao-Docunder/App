import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService
  ) { }

  @Post()
  async create(
    @Headers('Authorization') token: string | undefined,
    @Body() createDocumentDto: CreateDocumentDto
  ){
    // console.log(createDocumentDto)
    if (!token) {
      throw new HttpException("ERROR: log in to create a document.", HttpStatus.UNAUTHORIZED)
    }
    return await this.documentService.create(createDocumentDto);
  }

  @Get()
  findAll(
    @Headers('Authorization') token: string | undefined
  ){
    if (!token) {
      throw new HttpException("ERROR: log in to see the documents.", HttpStatus.UNAUTHORIZED)
    }
    return this.documentService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('Authorization') token: string | undefined
  ){
    if(id === ":id"){
      throw new HttpException("ERROR: report the id of the document.", HttpStatus.BAD_REQUEST)
    }
    if (!token) {
      throw new HttpException("ERROR: log in to see the document.", HttpStatus.UNAUTHORIZED)
    }
    return this.documentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Headers('Authorization') token: string | undefined,
    @Body() updateDocumentDto: UpdateDocumentDto
  ){
    if(id === ":id"){
      throw new HttpException("ERROR: report the id of the document.", HttpStatus.BAD_REQUEST)
    }
    if (!token) {
      throw new HttpException("ERROR: log in to edit the document.", HttpStatus.UNAUTHORIZED)
    }
    return this.documentService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('Authorization') token: string | undefined,
  ){
    if(id === ":id"){
      throw new HttpException("ERROR: report the id of the document.", HttpStatus.BAD_REQUEST)
    }
    if (!token) {
      throw new HttpException("ERROR: log in to delete the document.", HttpStatus.UNAUTHORIZED)
    }
    return this.documentService.remove(+id);
  }
}
