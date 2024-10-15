import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionBid } from './auction-bid.entity';

@Injectable()
export class AuctionBidsService {
  constructor(
    @InjectRepository(AuctionBid)
    private readonly auctionBidRepository: Repository<AuctionBid>,
  ) {}

  // 모든 입찰 조회
  async findAll(): Promise<AuctionBid[]> {
    return this.auctionBidRepository.find();
  }

  // 특정 입찰 조회
  async findOne(bidSeq: number): Promise<AuctionBid> {
    const bid = await this.auctionBidRepository.findOne({ where: { bidSeq } });
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${bidSeq} not found`);
    }
    return bid;
  }

  // 입찰 생성
  async create(data: Partial<AuctionBid>): Promise<AuctionBid> {
    const newBid = this.auctionBidRepository.create(data);
    return this.auctionBidRepository.save(newBid);
  }

  // 입찰 삭제
  async remove(bidSeq: number): Promise<void> {
    const result = await this.auctionBidRepository.delete(bidSeq);
    if (result.affected === 0) {
      throw new NotFoundException(`Bid with ID ${bidSeq} not found`);
    }
  }
}
