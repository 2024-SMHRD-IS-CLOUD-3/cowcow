import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionBid } from './auction-bid.entity';

@Injectable()
export class AuctionBidsService {
  constructor(
    @InjectRepository(AuctionBid)
    private readonly auctionBidsRepository: Repository<AuctionBid>,
  ) {}

  // 입찰 생성
  async createBid(bidData: Partial<AuctionBid>): Promise<AuctionBid> {
    const newBid = this.auctionBidsRepository.create(bidData);
    return await this.auctionBidsRepository.save(newBid);
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
