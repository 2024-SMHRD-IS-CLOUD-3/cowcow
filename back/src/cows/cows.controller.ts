import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CowsService } from './cows.service';
import { Cow } from './cow.entity';

@Controller('cows')
export class CowsController {
  constructor(private readonly cowsService: CowsService) {}

  // 모든 소 조회
  @Get()
  async getAllCows(): Promise<Cow[]> {
    return this.cowsService.findAll();
  }

  // 특정 소 조회
  @Get(':id')
  async getCow(@Param('id') id: number): Promise<Cow> {
    return this.cowsService.findOne(id);
  }

  // 소 생성
  @Post()
  async createCow(@Body() data: Partial<Cow>): Promise<Cow> {
    return this.cowsService.create(data);
  }

  // 소 삭제
  @Delete(':id')
  async deleteCow(@Param('id') id: number): Promise<void> {
    return this.cowsService.remove(id);
  }
}
