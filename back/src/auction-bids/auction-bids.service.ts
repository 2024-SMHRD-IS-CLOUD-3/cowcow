import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionBid } from './auction-bid.entity';
import { Auction } from 'src/auctions/auction.entity';
import { AlarmsService } from 'src/alarms/alarms.service';
import { AlarmsGateway } from 'src/alarms/alarms.gateway';


@Injectable()
export class AuctionBidsService {
  constructor(
    @InjectRepository(AuctionBid)
    private readonly auctionBidsRepository: Repository<AuctionBid>,

    @InjectRepository(Auction)
    private readonly auctionsRepository: Repository<Auction>,

    private readonly alarmsService: AlarmsService,
    private readonly alarmsGateway: AlarmsGateway, // WebSocket 게이트웨이 주입
  ) {}

  async createBid(bidData: Partial<AuctionBid>): Promise<AuctionBid> {
    const newBid = this.auctionBidsRepository.create(bidData);
    const savedBid = await this.auctionBidsRepository.save(newBid);

    const auction = await this.auctionsRepository.findOne({
      where: { aucSeq: bidData.aucSeq },
      relations: ['user'],
    });

    if (!auction) {
      throw new NotFoundException(`ID ${bidData.aucSeq}에 해당하는 경매를 찾을 수 없습니다.`);
    }

    const sellerId = auction.user.usrSeq;
    const message = '입찰 갱신되었습니다.';

    // 알림 생성 - 데이터베이스에 저장
    await this.alarmsService.createAlarm(sellerId, message);

    // 알림 전송 - WebSocket으로 실시간 알림 전달
    await this.alarmsGateway.sendAlarm(sellerId, message);

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
