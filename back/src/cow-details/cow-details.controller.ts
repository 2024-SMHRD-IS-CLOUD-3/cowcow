import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CowDetailsService } from './cow-details.service';
import { CowDetail } from './cow-detail.entity';

@Controller('cow-details')
export class CowDetailsController {
  constructor(private readonly cowDetailsService: CowDetailsService) {}

  // 모든 소 세부 정보 조회
  @Get()
  async getAllDetails(): Promise<CowDetail[]> {
    return this.cowDetailsService.findAll();
  }

  // 특정 소 세부 정보 조회
  @Get(':id')
  async getDetail(@Param('id') id: number): Promise<CowDetail> {
    return this.cowDetailsService.findOne(id);
  }

  // 소 세부 정보 생성
  @Post()
  async createDetail(@Body() data: Partial<CowDetail>): Promise<CowDetail> {
    return this.cowDetailsService.create(data);
  }

  // 소 세부 정보 삭제
  @Delete(':id')
  async deleteDetail(@Param('id') id: number): Promise<void> {
    return this.cowDetailsService.remove(id);
  }
}
