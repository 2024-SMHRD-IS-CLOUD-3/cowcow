import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { Auction } from './auction.entity';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  // 모든 경매 조회
  @Get()
  async getAllAuctions(): Promise<Auction[]> {
    return this.auctionsService.findAll();
  }

  // 특정 경매 조회
  @Get(':id')
  async getAuction(@Param('id') id: number): Promise<Auction> {
    return this.auctionsService.findOne(id);
  }

  // 경매 생성
  @Post()
  async createAuction(@Body() data: Partial<Auction>): Promise<Auction> {
    return this.auctionsService.create(data);
  }

  // 경매 삭제
  @Delete(':id')
  async deleteAuction(@Param('id') id: number): Promise<void> {
    return this.auctionsService.remove(id);
  }
}
