import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { AuctionBidsService } from './auction-bids.service';
import { AuctionBid } from './auction-bid.entity';

@Controller('auction-bids')
export class AuctionBidsController {
  constructor(private readonly auctionBidsService: AuctionBidsService) {}

  // 모든 입찰 조회
  @Get()
  async getAllBids(): Promise<AuctionBid[]> {
    return this.auctionBidsService.findAll();
  }

  // 특정 입찰 조회
  @Get(':id')
  async getBid(@Param('id') id: number): Promise<AuctionBid> {
    return this.auctionBidsService.findOne(id);
  }

  // 입찰 생성
  @Post()
  async createBid(@Body() data: Partial<AuctionBid>): Promise<AuctionBid> {
    return this.auctionBidsService.create(data);
  }

  // 입찰 삭제
  @Delete(':id')
  async deleteBid(@Param('id') id: number): Promise<void> {
    return this.auctionBidsService.remove(id);
  }
}
