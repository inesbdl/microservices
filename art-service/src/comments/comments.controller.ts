import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { CommentsService } from './comments.service';
  import { CreateCommentDto } from './dto/create-comment.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { User } from '../auth/user.decorator';
  
  /**
   * Contrôleur REST pour les commandes utilisateur.
   * Toutes les routes nécessitent un JWT valide.
   */
  @Controller('comments')
  @UseGuards(JwtAuthGuard)
  export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}
  
    @Post()
    create(@User() user: any, @Body() dto: CreateCommentDto) {
      return this.commentsService.create(user.sub, dto);
    }
  
    @Get()
    findAll(@User() user: any) {
      return this.commentsService.findAll(user.sub);
    }

    @Get('artwork/:id')
    getByArtwork(@Param('id', ParseIntPipe) artworkId: number) {
      return this.commentsService.findAllByArtwork(artworkId);
    }

  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @User() user: any) {
      return this.commentsService.findOne(id, user.sub);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @User() user: any) {
      return this.commentsService.remove(id, user.sub);
    }
  }
  
  