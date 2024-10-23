import { Controller, Get, Post, Param, Delete, Body, Put } from '@nestjs/common';
import { AuctionCowsService } from './auction-cows.service';
import { AuctionCow } from './auction-cow.entity';

@Controller('auction-cows')
export class AuctionCowsController {
  constructor(private readonly auctionCowsService: AuctionCowsService) {}

  // 경매 소 생성
  @Post()
  async create(@Body() auctionCowData: Partial<AuctionCow>): Promise<AuctionCow> {
    return this.auctionCowsService.create(auctionCowData);
  }

  // 모든 경매 소 조회
  @Get()
  async findAll(): Promise<AuctionCow[]> {
    return this.auctionCowsService.findAll();
  }

  // 특정 경매 소 조회
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AuctionCow> {
    return this.auctionCowsService.findOne(id);
  }

  // 경매 소 정보 업데이트
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() auctionCowData: Partial<AuctionCow>,
  ): Promise<AuctionCow> {
    return this.auctionCowsService.update(id, auctionCowData);
  }

  // 경매 소 삭제
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.auctionCowsService.delete(id);
  }
}
