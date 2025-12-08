import { Module } from '@nestjs/common';
import { CommentsModule } from './comments/comments.module';
import { PrismaService } from './prisma/prisma.service';
import { HealthController } from './health.controller';
import { ArtworksModule } from './artworks/artworks.module';

@Module({
  imports: [CommentsModule, ArtworksModule],
  providers: [PrismaService],
  controllers: [HealthController],
})
export class AppModule {}