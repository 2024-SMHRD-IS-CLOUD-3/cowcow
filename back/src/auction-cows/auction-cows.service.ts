import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionCow } from './auction-cow.entity';

@Injectable()
export class AuctionCowsService {
  constructor(
    @InjectRepository(AuctionCow)
    private readonly auctionCowRepository: Repository<AuctionCow>,
  ) {}

  // 모든 경매 소 조회
  async findAll(): Promise<AuctionCow[]> {
    return this.auctionCowRepository.find();
  }

  // 특정 경매 소 조회
  async findOne(aucCowSeq: number): Promise<AuctionCow> {
    const auctionCow = await this.auctionCowRepository.findOne({ where: { aucCowSeq } });
    if (!auctionCow) {
      throw new NotFoundException(`AuctionCow with ID ${aucCowSeq} not found`);
    }
    return auctionCow;
  }

  // 경매 소 생성
  async create(data: Partial<AuctionCow>): Promise<AuctionCow> {
    const newAuctionCow = this.auctionCowRepository.create(data);
    return this.auctionCowRepository.save(newAuctionCow);
  }

  // 경매 소 삭제
  async remove(aucCowSeq: number): Promise<void> {
    const result = await this.auctionCowRepository.delete(aucCowSeq);
    if (result.affected === 0) {
      throw new NotFoundException(`AuctionCow with ID ${aucCowSeq} not found`);
    }
  }
}
