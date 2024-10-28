import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from './auction.entity';
import { AuctionCow } from '../auction-cows/auction-cow.entity';
import { Cow } from '../cows/cow.entity'; // Cow 엔티티 추가
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

    @InjectRepository(Cow) // Cow 엔티티 주입
    private readonly cowsRepository: Repository<Cow>,
  ) {}

  // 1. 소 데이터 가져오기
  async getCowDataForPrediction(cowSeq: number): Promise<any> {
    const cow = await this.cowsRepository.findOne({ where: { cowSeq } });
    if (!cow) {
      throw new NotFoundException(`Cow with id ${cowSeq} not found`);
    }

    // 필요한 데이터만 반환
    return {
      kpn: cow.cowKpn,
      family: cow.cowFamily, // 계대가 이 필드라고 가정
      weight: cow.cowWeight, // 중량 필드 가정
      gender: cow.cowGdr,
      type: cow.cowJagigubun,
    };
  }

  // 2. 경매 생성
  async createAuction(auctionData: {
    title: string; 
    usrSeq: number; 
    usrBarnSeq: number; 
    cows: { cowSeq: number; minValue: number; predictPrice: number }[] 
  }): Promise<Auction> {
    const newAuction = this.auctionsRepository.create({
      aucBroadcastTitle: auctionData.title,
      usrSeq: auctionData.usrSeq,
      aucCrtDt: new Date(),
      aucStatus: '진행중',
    });
    const savedAuction = await this.auctionsRepository.save(newAuction);

    try {
      const auctionCowPromises = auctionData.cows.map((cow) =>
        this.auctionCowsRepository.save({
          cowSeq: cow.cowSeq,
          aucSeq: savedAuction.aucSeq,
          acowBottomPrice: cow.minValue,
          acowPredictPrice: cow.predictPrice, // 이미 예측된 가격 사용
          acowCrtDt: new Date(),
        })
      );

      await Promise.all(auctionCowPromises);
    } catch (error) {
      console.error('Error saving auction cows:', error);
      throw new Error('Error occurred while saving auction cows');
    }

    return savedAuction;
  }

  async findAll(): Promise<Auction[]> {
    return this.auctionsRepository.find({ relations: ['user', 'auctionCows'] });
  }

  async findOne(id: number): Promise<Auction | null> {
    return this.auctionsRepository.findOne({
      where: { aucSeq: id },
      relations: ['user', 'auctionCows', 'auctionCows.cow'],
    });
  }

  async delete(id: number): Promise<void> {
    const result = await this.auctionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('해당 경매를 찾을 수 없습니다.');
    }
  }

  async setWinningBid(
    aucSeq: number,
    winningUserId: number,
    finalBidAmount: number,
  ): Promise<Auction> {
    const auction = await this.auctionsRepository.findOne({
      where: { aucSeq },
      relations: ['user'],
    });

    if (!auction) {
      throw new NotFoundException('해당 경매를 찾을 수 없습니다.');
    }

    const winningUser = await this.usersRepository.findOne({
      where: { usrSeq: winningUserId },
    });

    if (!winningUser) {
      throw new NotFoundException('낙찰자를 찾을 수 없습니다.');
    }

    auction.aucStatus = '낙찰';
    auction.aucDelDt = new Date();

    return await this.auctionsRepository.save(auction);
  }
}
