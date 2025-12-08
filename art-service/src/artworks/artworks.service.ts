import { Injectable } from '@nestjs/common';

export interface Artwork {
  id: number;
  title: string;
  image_id: string | null;
}

@Injectable()
export class ArtworksService {
  async findAll(): Promise<Artwork[]> {
    try {
      const res = await fetch(
        'https://api.artic.edu/api/v1/artworks?limit=12&fields=id,title,image_id'
      );
      const data = (await res.json()) as { data: Artwork[] };
      return data.data ?? [];
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Erreur récupération artworks:", err.message);
      } else {
        console.error("Erreur récupération artworks:", err);
      }
      return [];
    }
  }

  getImageUrl(imageId: string): { url: string } | null {
    if (!imageId) return null;
    return { url: `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg` };
  }
}
