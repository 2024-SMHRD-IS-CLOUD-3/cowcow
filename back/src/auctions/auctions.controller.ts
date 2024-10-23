import { Controller, Get, Post, Delete, Param, Body, Put, NotFoundException } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { Auction } from './auction.entity';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  // 모든 경매 조회 (GET /auctions)
  @Get()
  async getAllAuctions(): Promise<Auction[]> {
    return this.auctionsService.findAll();
  }

  // 특정 경매 조회 (GET /auctions/:id)
  @Get(':id')
  async getAuction(@Param('id') id: number): Promise<Auction | null> {
    return this.auctionsService.findOne(id);
  }

  // 경매 생성 (POST /auctions)
  @Post()
  async createAuction(@Body() auctionData: Partial<Auction>): Promise<Auction> {
    return this.auctionsService.create(auctionData);
  }

  // 경매 삭제 (DELETE /auctions/:id)
  @Delete(':id')
  async deleteAuction(@Param('id') id: number): Promise<void> {
    return this.auctionsService.delete(id);
  }

  @Put(':id/win')
  async setWinningBid(
    @Param('id') aucSeq: number,
    @Body() body: any,
  ) {
    const { winningUserSeq, finalBidAmount } = body;
    const updatedAuction = await this.auctionsService.setWinningBid(aucSeq, winningUserSeq, finalBidAmount);
    if (!updatedAuction) {
      throw new NotFoundException('경매 정보를 찾을 수 없습니다.');
    }
    return updatedAuction;
  }

}
