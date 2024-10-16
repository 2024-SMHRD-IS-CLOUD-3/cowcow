import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from './auction.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
  ) {}

  // 모든 경매 조회
  async findAll(): Promise<Auction[]> {
    return this.auctionRepository.find();
  }

  // 특정 경매 조회
  async findOne(aucSeq: number): Promise<Auction> {
    const auction = await this.auctionRepository.findOne({ where: { aucSeq } });
    if (!auction) {
      throw new NotFoundException(`Auction with ID ${aucSeq} not found`);
    }
    return auction;
  }

  // 경매 생성
  async create(data: Partial<Auction>): Promise<Auction> {
    const newAuction = this.auctionRepository.create(data);
    return this.auctionRepository.save(newAuction);
  }

  // 경매 삭제
  async remove(aucSeq: number): Promise<void> {
    const result = await this.auctionRepository.delete(aucSeq);
    if (result.affected === 0) {
      throw new NotFoundException(`Auction with ID ${aucSeq} not found`);
    }
  }
}
