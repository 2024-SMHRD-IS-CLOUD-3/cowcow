import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from './auction.entity';
import { AuctionCow } from '../auction-cows/auction-cow.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionsRepository: Repository<Auction>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(AuctionCow)
    private readonly auctionCowsRepository: Repository<AuctionCow>,
  ) {}

  // 모든 경매 조회
  async findAll(): Promise<Auction[]> {
    return this.auctionsRepository.find({ relations: ['user', 'auctionCows'] });
  }

  // 특정 경매 조회 by ID
  async findOne(id: number): Promise<Auction | null> {
    return this.auctionsRepository.findOne({
      where: { aucSeq: id },
      relations: ['user', 'auctionCows'],
    });
  }

  // 경매 생성
  async createAuction(auctionData: {
    title: string;
    usrSeq: number;
    cows: { cowSeq: number; minValue: number }[];
  }): Promise<Auction> {
    // 1. 경매 생성 및 저장
    const newAuction = this.auctionsRepository.create({
      aucBroadcastTitle: auctionData.title,
      usrSeq: auctionData.usrSeq,
      aucCrtDt: new Date(),
      aucStatus: '진행중',
    });
    const savedAuction = await this.auctionsRepository.save(newAuction);

    // 2. 각 소 정보를 auction_cow 테이블에 저장
    try {
      const auctionCowPromises = auctionData.cows.map((cow) =>
        this.auctionCowsRepository.save({
          cowSeq: cow.cowSeq,
          aucSeq: savedAuction.aucSeq,
          acowBottomPrice: cow.minValue,
          acowCrtDt: new Date(),
        })
      );
      await Promise.all(auctionCowPromises); // 비동기 저장
    } catch (error) {
      console.error('Error saving auction cows:', error);
      throw new Error('소 정보를 저장하는 중 오류가 발생했습니다.');
    }

    return savedAuction;
  }

  // 경매 삭제 by ID
  async delete(id: number): Promise<void> {
    const result = await this.auctionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('해당 경매를 찾을 수 없습니다.');
    }
  }

  // 낙찰 정보 업데이트
  async setWinningBid(
    aucSeq: number,
    winningUserId: number,
    finalBidAmount: number,
  ): Promise<Auction> {
    // 1. 경매 조회
    const auction = await this.auctionsRepository.findOne({
      where: { aucSeq },
      relations: ['user'],
    });
    if (!auction) {
      throw new NotFoundException('해당 경매를 찾을 수 없습니다.');
    }

    // 2. 낙찰자 조회
    const winningUser = await this.usersRepository.findOne({
      where: { usrSeq: winningUserId },
    });
    if (!winningUser) {
      throw new NotFoundException('낙찰자를 찾을 수 없습니다.');
    }

    // 3. 경매 정보 업데이트
    auction.aucStatus = '낙찰';
    auction.aucDelDt = new Date();
    // auction.winningUser = winningUser; // 필요에 따라 활성화
    // auction.aucFinalBid = finalBidAmount; // 필요에 따라 활성화

    return await this.auctionsRepository.save(auction);
  }
}
