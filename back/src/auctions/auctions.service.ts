import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from './auction.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionsRepository: Repository<Auction>,
  ) {}

  // 모든 경매 조회
  async findAll(): Promise<Auction[]> {
    return this.auctionsRepository.find({ relations: ['user', 'userBarn', 'cow'] });
  }

  // 특정 경매 조회 by ID
  async findOne(id: number): Promise<Auction | null> {
    return this.auctionsRepository.findOne({
      where: { aucSeq: id },
      relations: ['user', 'userBarn', 'cow'],
    });
  }

  // 경매 생성
  async create(auctionData: Partial<Auction>): Promise<Auction> {
    const newAuction = this.auctionsRepository.create(auctionData);
    return this.auctionsRepository.save(newAuction);
  }

  // 경매 삭제 by ID
  async delete(id: number): Promise<void> {
    await this.auctionsRepository.delete(id);
  }

  // 경매 상태 업데이트 (예: 종료)
  async updateStatus(id: number, status: string): Promise<Auction | null> {
    const auction = await this.findOne(id);
    if (!auction) return null;

    auction.aucStatus = status;
    return this.auctionsRepository.save(auction);
  }
}
