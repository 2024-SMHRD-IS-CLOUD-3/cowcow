import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  // 이미지 저장
  async createImage(data: Partial<Image>): Promise<Image> {
    const newImage = this.imageRepository.create(data);
    return this.imageRepository.save(newImage);
  }

  // 이미지 ID로 조회
  async findOne(id: number): Promise<Image> {
    const image = await this.imageRepository.findOne({ where: { imgSeq: id } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }
    return image;
  }

  // 모든 이미지 조회
  async findAll(): Promise<Image[]> {
    return this.imageRepository.find();
  }
}
