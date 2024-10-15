import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { AuctionCowsService } from './auction-cows.service';
import { AuctionCow } from './auction-cow.entity';

@Controller('auction-cows')
export class AuctionCowsController {
  constructor(private readonly auctionCowsService: AuctionCowsService) {}

  // 모든 경매 소 조회
  @Get()
  async getAllAuctionCows(): Promise<AuctionCow[]> {
    return this.auctionCowsService.findAll();
  }

  // 특정 경매 소 조회
  @Get(':id')
  async getAuctionCow(@Param('id') id: number): Promise<AuctionCow> {
    return this.auctionCowsService.findOne(id);
  }

  // 경매 소 생성
  @Post()
  async createAuctionCow(@Body() data: Partial<AuctionCow>): Promise<AuctionCow> {
    return this.auctionCowsService.create(data);
  }

  // 경매 소 삭제
  @Delete(':id')
  async deleteAuctionCow(@Param('id') id: number): Promise<void> {
    return this.auctionCowsService.remove(id);
  }
}
