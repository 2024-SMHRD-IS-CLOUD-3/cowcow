import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionBid } from './auction-bid.entity';
import { Auction } from 'src/auctions/auction.entity';
import { AlarmsService } from 'src/alarms/alarms.service';

@Injectable()
export class AuctionBidsService {
  constructor(
    @InjectRepository(AuctionBid)
    private readonly auctionBidsRepository: Repository<AuctionBid>,

    @InjectRepository(Auction)
    private readonly auctionsRepository: Repository<Auction>,

    private readonly alarmsService: AlarmsService, // AlarmsService 주입
  ) {}

  // 입찰 생성
  async createBid(bidData: Partial<AuctionBid>): Promise<AuctionBid> {
    const newBid = this.auctionBidsRepository.create(bidData);
    const savedBid = await this.auctionBidsRepository.save(newBid);

    // 입찰한 경매 정보 가져오기
    const auction = await this.auctionsRepository.findOne({
      where: { aucSeq: bidData.aucSeq },
      relations: ['user'], // 경매 등록자 정보 포함
    });

    if (!auction) {
      throw new NotFoundException(`ID ${bidData.aucSeq}에 해당하는 경매를 찾을 수 없습니다.`);
    }

    // 알림 생성 - 판매자에게 '입찰 갱신되었습니다.' 메시지 전송
    await this.alarmsService.createAlarm(auction.user.usrSeq, '입찰 갱신되었습니다.');

    return savedBid;

  }

  // 특정 경매소의 최고 입찰가 조회 (입찰자 정보 포함)
  async getHighestBid(acowSeq: number): Promise<AuctionBid | null> {
    return this.auctionBidsRepository.findOne({
      where: { acowSeq },
      relations: ['user'], // 입찰자 정보 포함
      order: { bidAmt: 'DESC' }, // 최고 입찰가 기준 정렬
    });
  }
}
