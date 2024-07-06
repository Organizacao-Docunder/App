import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async createDocument(createDocumentDto: CreateDocumentDto) {
    const data = {
      ...createDocumentDto,
    };
    const createdDocument = await this.prisma.document.create({ data });
    const { createdAt, updatedAt, ...document } = createdDocument;
    return document;
  }

  async updateDocument(id: number, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    const updatedDocument = await this.prisma.document.update({
      where: { id },
      data: updateDocumentDto,
    });
    const { createdAt, updatedAt, ...updatedDocumentData } = updatedDocument;
    return updatedDocumentData;
  }

  async findDocumentById(id: number) {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return await this.prisma.document.findUnique({
      where: { id },
    });
  }

  async findById(id: number) {
    return await this.prisma.document.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return await this.prisma.document.findMany({
      select: {
        id: true,
        content: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async deleteDocument(id: number) {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    await this.prisma.document.delete({
      where: { id },
    });
  }
}
