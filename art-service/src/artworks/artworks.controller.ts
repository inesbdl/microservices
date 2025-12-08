import { Controller, Get, Param } from '@nestjs/common';
import { ArtworksService, Artwork } from './artworks.service';

@Controller('artworks')
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Get()
  async getAll(): Promise<Artwork[]> {
    return this.artworksService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.artworksService.getImageUrl(id);
  }
}
