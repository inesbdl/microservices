import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Schéma d'entrée pour créer une commande.
 */
export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @Type(() => Number)
  artwork: number;
  
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  parentId?: number;
  
}
