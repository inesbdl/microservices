import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

/**
 * Service métier pour la gestion des commandes.
 */
@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  create(user: string, data: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        user,
        artwork: data.artwork,
        content: data.content,
        parentId: data.parentId ?? null,
      },
    });
  }

  findAllByArtwork(artwork: number) {
    return this.prisma.comment.findMany({
      where: { artwork },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll(artwork: number) {
    return this.prisma.comment.findMany({
      where: { artwork },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number, user: string) {
    return this.prisma.comment.findFirst({
      where: { id, user },
    });
  }

  remove(id: number, user: string) {
    return this.prisma.comment.deleteMany({
      where: { id, user },
    });
  }
}

