import { Controller, Get, Post, Param, Delete, Body, Put, NotFoundException } from '@nestjs/common';
import { AuctionCowsService } from './auction-cows.service';
import { AuctionCow } from './auction-cow.entity';

@Controller('auction-cows')
export class AuctionCowsController {
  constructor(private readonly auctionCowsService: AuctionCowsService) {}

  // 경매 소 생성 (POST /auction-cows)
  @Post()
  async create(@Body() auctionCowData: Partial<AuctionCow>): Promise<AuctionCow> {
    return await this.auctionCowsService.create(auctionCowData);
  }

  // 모든 경매 소 조회 (GET /auction-cows)
  @Get()
  async findAll(): Promise<AuctionCow[]> {
    return await this.auctionCowsService.findAll();
  }

  // 특정 경매 소 조회 (GET /auction-cows/:id)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<AuctionCow> {
    const auctionCow = await this.auctionCowsService.findOne(id);
    if (!auctionCow) {
      throw new NotFoundException('경매 소를 찾을 수 없습니다.');
    }
    return auctionCow;
  }

  // // 경매 소 정보 업데이트 (PUT /auction-cows/:id)
  // @Put(':id')
  // async update(
  //   @Param('id') id: number,
  //   @Body() auctionCowData: Partial<AuctionCow>,
  // ): Promise<AuctionCow> {
  //   const updatedAuctionCow = await this.auctionCowsService.update(id, auctionCowData);
  //   if (!updatedAuctionCow) {
  //     throw new NotFoundException('경매 소를 찾을 수 없습니다.');
  //   }
  //   return updatedAuctionCow;
  // }

  // 경매 낙찰 처리 (PUT /auctions/:id/win)
  @Put(':id/win')
  async setWinningBid(
    @Param('id') acowSeq: number,
    @Body() body: { acowWinnerSeq: number; acowFinalBid: number }
  ): Promise<AuctionCow> {
    const { acowWinnerSeq, acowFinalBid } = body;
    const updatedAuctionCow = await this.auctionCowsService.setWinningBid(
      acowSeq,
      acowWinnerSeq,
      acowFinalBid,
    );

    console.log("controller Page : ")
    console.log(acowSeq)
    console.log(acowWinnerSeq)
    console.log(acowFinalBid)

    if (!updatedAuctionCow) {
      throw new NotFoundException('경매 정보를 찾을 수 없습니다.');
    }

    return updatedAuctionCow;
  }


  // 경매 소 삭제 (DELETE /auction-cows/:id)
  @Delete(':id')
async delete(@Param('id') id: number): Promise<void> {
  const result = await this.auctionCowsService.delete(id);

  if (result.affected === 0) {
    throw new NotFoundException(`ID ${id}에 해당하는 경매 소를 찾을 수 없습니다.`);
  }
}

}
