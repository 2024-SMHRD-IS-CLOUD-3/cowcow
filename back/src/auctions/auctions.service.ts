import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from './auction.entity';
import { AuctionBid } from '../auction-bids/auction-bid.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionsRepository: Repository<Auction>,
    @InjectRepository(AuctionBid)
    private readonly auctionBidsRepository: Repository<AuctionBid>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // 모든 경매 조회
  async findAll(): Promise<Auction[]> {
    return this.auctionsRepository.find({ relations: ['user', 'userBarn', 'cow'] });
  }

  // 특정 경매 조회 by ID
  async findOne(id: number): Promise<Auction | null> {
    return this.auctionsRepository.findOne({
      where: { aucSeq: id },
      relations: ['user', 'userBarn', 'cow', 'winningUser'],
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

}
