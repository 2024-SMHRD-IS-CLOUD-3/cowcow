import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.auctionsRepository.find({ relations: ['user', 'userBarn', 'auctionCows', 'bids'] });
  }

  // 특정 경매 조회 by ID
  async findOne(id: number): Promise<Auction | null> {
    return this.auctionsRepository.findOne({
      where: { aucSeq: id },
      relations: ['user', 'userBarn', 'auctionCows', 'bids'],
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

  //Todo#1 : 오류 수정
  async setWinningBid(aucSeq: number, winningUserId: number, finalBidAmount: number): Promise<Auction> {
    const auction = await this.auctionsRepository.findOne({ where: { aucSeq }, relations: ['winningUser'] });
    if (!auction) {
      throw new NotFoundException('해당 경매를 찾을 수 없습니다.');
    }

    const winningUser = await this.usersRepository.findOne({ where: { usrSeq: winningUserId } });
    if (!winningUser) {
      throw new NotFoundException('낙찰자를 찾을 수 없습니다.');
    }

    // 최고 입찰가와 낙찰자 정보를 업데이트합니다.
    // auction.winningUser = winningUser;
    // auction.aucFinalBid = finalBidAmount;
    auction.aucStatus = '낙찰';
    auction.aucDelDt = new Date();

    return await this.auctionsRepository.save(auction);
  }
}
