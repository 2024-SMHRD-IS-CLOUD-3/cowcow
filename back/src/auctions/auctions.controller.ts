import { 
  Controller, Get, Post, Delete, Param, Body, Put, NotFoundException 
} from '@nestjs/common';
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
    const auction = await this.auctionsService.findOne(id);
    if (!auction) {
      throw new NotFoundException(`ID ${id}에 해당하는 경매를 찾을 수 없습니다.`);
    }
    return auction;
  }

  // 경매 생성 (POST /auctions)
  @Post()
  async createAuction(
    @Body() auctionData: { 
      title: string; 
      usrSeq: number; 
      cows: { cowSeq: number; minValue: number }[] 
    }
  ): Promise<Auction> {
    const auction = await this.auctionsService.createAuction({
      title: auctionData.title,
      usrSeq: auctionData.usrSeq,
      cows: auctionData.cows,
    });

    return auction;
  }

  // 경매 삭제 (DELETE /auctions/:id)
  @Delete(':id')
  async deleteAuction(@Param('id') id: number): Promise<void> {
    await this.auctionsService.delete(id);
  }

  // 경매 낙찰 처리 (PUT /auctions/:id/win)
  @Put(':id/win')
  async setWinningBid(
    @Param('id') aucSeq: number,
    @Body() body: { winningUserSeq: number; finalBidAmount: number }
  ): Promise<Auction> {
    const { winningUserSeq, finalBidAmount } = body;
    const updatedAuction = await this.auctionsService.setWinningBid(
      aucSeq,
      winningUserSeq,
      finalBidAmount,
    );

    if (!updatedAuction) {
      throw new NotFoundException('경매 정보를 찾을 수 없습니다.');
    }

    return updatedAuction;
  }
}
