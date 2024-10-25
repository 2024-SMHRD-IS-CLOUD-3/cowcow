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

  // 최고 입찰가 조회
  async getHighestBid(aucSeq: number): Promise<AuctionBid> {
    return await this.auctionBidsRepository
      .createQueryBuilder('bid')
      .where('bid.aucSeq = :aucSeq', { aucSeq })
      .orderBy('bid.bidAmt', 'DESC')
      .getOne();
  }
}
