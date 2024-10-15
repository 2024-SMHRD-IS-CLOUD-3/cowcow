import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Image } from './image.entity';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  // 이미지 생성 (예: 파일 업로드 후 DB 저장)
  @Post()
  async createImage(@Body() data: Partial<Image>): Promise<Image> {
    return this.imagesService.createImage(data);
  }

  // 특정 이미지 조회
  @Get(':id')
  async getImage(@Param('id') id: number): Promise<Image> {
    return this.imagesService.findOne(id);
  }

  // 모든 이미지 조회
  @Get()
  async getAllImages(): Promise<Image[]> {
    return this.imagesService.findAll();
  }
}
