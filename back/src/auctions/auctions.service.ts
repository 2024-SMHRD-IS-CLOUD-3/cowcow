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
    // @InjectRepository(User)
    // private readonly usersRepository: Repository<User>,
    // @InjectRepository(AuctionCow)
    // private readonly auctionCowsRepository: Repository<AuctionCow>,
  ) {}

  // 모든 경매 조회
  async findAll(): Promise<Auction[]> {
    return this.auctionsRepository.find({ relations: ['user', 'auctionCows', 'bids'] });
  }

  // 특정 경매 조회 by ID
  async findOne(id: number): Promise<Auction | null> {
    return this.auctionsRepository.findOne({
      where: { aucSeq: id },
      relations: ['user', 'auctionCows', 'bids'],
    });
  }

  // 경매 생성
  // async createAuction(auctionData: { 
  //   title: string; 
  //   usrSeq: number; 
  //   usrBarnSeq: number; 
  //   cows: { cowSeq: number; minValue: number; predictPrice?: number }[] 
  // }) {
  //   // 1. 경매 생성 및 저장
  //   const newAuction = this.auctionsRepository.create({
  //     aucBroadcastTitle: auctionData.title,
  //     usrSeq: auctionData.usrSeq,
  //     usrBarnSeq: auctionData.usrBarnSeq,
  //     aucCrtDt: new Date(),
  //     aucStatus: '진행중',
  //   });
  //   const savedAuction = await this.auctionsRepository.save(newAuction);

  //   // 2. 각 소 정보를 auction_cow 테이블에 저장
  //   const auctionCows = auctionData.cows.map((cow) => {
  //     return this.auctionCowsRepository.create({
  //       cowSeq: cow.cowSeq,
  //       aucSeq: savedAuction.aucSeq,
  //       acowBottomPrice: cow.minValue,
  //       acowPredictPrice: cow.predictPrice || 0, // 소 예정가 저장
  //       acowCrtDt: new Date(),
  //     });
  //   });
  //   await this.auctionCowsRepository.save(auctionCows);

  //   return savedAuction;
  // }
  
  // 경매 삭제 by ID
  async delete(id: number): Promise<void> {
    await this.auctionsRepository.delete(id);
  }

  //Todo#1 : 오류 수정
  // async setWinningBid(aucSeq: number, winningUserId: number, finalBidAmount: number): Promise<Auction> {
  //   const auction = await this.auctionsRepository.findOne({ where: { aucSeq }, relations: ['winningUser'] });
  //   if (!auction) {
  //     throw new NotFoundException('해당 경매를 찾을 수 없습니다.');
  //   }

  //   const winningUser = await this.usersRepository.findOne({ where: { usrSeq: winningUserId } });
  //   if (!winningUser) {
  //     throw new NotFoundException('낙찰자를 찾을 수 없습니다.');
  //   }

  //   // 최고 입찰가와 낙찰자 정보를 업데이트합니다.
  //   // auction.winningUser = winningUser;
  //   // auction.aucFinalBid = finalBidAmount;
  //   auction.aucStatus = '낙찰';
  //   auction.aucDelDt = new Date();

  //   return await this.auctionsRepository.save(auction);
  // }
}
