import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CowsService } from './cows.service';
import { Cow } from './cow.entity';

@Controller('cows')
export class CowsController {
  constructor(private readonly cowService: CowsService) {}

  // 소 등록 API
  @Post()
  async createCow(@Body() cowData: Partial<Cow>): Promise<Cow> {
    return this.cowService.create(cowData);
  }

  // 특정 소 조회 API
  @Get(':id')
  async getCowById(@Param('id') id: number): Promise<Cow> {
    return this.cowService.findOne(id);
  }

  // 모든 소 조회 API
  @Get()
  async getAllCows(): Promise<Cow[]> {
    return this.cowService.findAll();
  }

    // 특정 사용자 소 조회 API
  @Get('/user/:userId')
  async getCowsByUserId(@Param('userId') userId: number): Promise<Cow[]> {
    return this.cowService.findByUserId(userId);
  }
}
