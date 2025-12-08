import { Module } from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { ArtworksController } from './artworks.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ArtworksController],
  providers: [ArtworksService, PrismaService],
})
export class ArtworksModule {}