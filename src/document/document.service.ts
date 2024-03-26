import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDocumentDto: CreateDocumentDto) {
    const data = {
      ...createDocumentDto
    };
    await this.prisma.document.create({ data });
  }

  async findAll() {
    return this.prisma.document.findMany({
      select: {
        id: true,
        creatorId: true,
        content: true
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.document.findUnique({
      where: { id },
    });
  }

  async update(id: number, newData: UpdateDocumentDto) {
    return this.prisma.document.update({
      where: { id },
      data: newData,
    });
  }

  async remove(id: number) {
    return this.prisma.document.delete({
      where: { id },
    });
  }
}
