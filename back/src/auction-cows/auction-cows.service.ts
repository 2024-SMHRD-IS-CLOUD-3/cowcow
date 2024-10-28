import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';  // DeleteResult 추가
import { AuctionCow } from './auction-cow.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AuctionCowsService {
  constructor(
    @InjectRepository(AuctionCow)
    private readonly auctionCowRepository: Repository<AuctionCow>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // 경매 소 생성
  async create(auctionCowData: Partial<AuctionCow>): Promise<AuctionCow> {
    const auctionCow = this.auctionCowRepository.create(auctionCowData);
    return await this.auctionCowRepository.save(auctionCow);
  }

  // 모든 경매 소 조회
  async findAll(): Promise<AuctionCow[]> {
    return await this.auctionCowRepository.find({
      relations: ['auction', 'cow'],
    });
  }

  // 특정 경매 소 조회 (ID로 조회)
  async findOne(id: number): Promise<AuctionCow> {
    const auctionCow = await this.auctionCowRepository.findOne({
      where: { acowSeq: id },
      relations: ['auction', 'cow'],
    });

    if (!auctionCow) {
      throw new NotFoundException(`ID ${id}에 해당하는 경매 소를 찾을 수 없습니다.`);
    }

    return auctionCow;
  }

  // 경매 소 삭제
  async delete(id: number): Promise<DeleteResult> {
    return await this.auctionCowRepository.delete(id);
  }

  // 경매 소 정보 업데이트
  // async update(id: number, auctionCowData: Partial<AuctionCow>): Promise<AuctionCow> {
  //   const auctionCow = await this.findOne(id); // 존재 여부 확인

  //   // 수정된 데이터 병합
  //   const updatedCow = this.auctionCowRepository.merge(auctionCow, auctionCowData);

  //   return await this.auctionCowRepository.save(updatedCow);
  // }


  async setWinningBid(
    acowSeq: number,
    acowWinnerSeq: number,
    acowFinalBid: number,
  ): Promise<AuctionCow> {
    const auctionCow = await this.auctionCowRepository.findOne({
      where: { acowSeq },
      relations: ['user'],
    });

    if (!auctionCow) {
      throw new NotFoundException('해당 경매를 찾을 수 없습니다.');
    }

    const winningUser = await this.usersRepository.findOne({
      where: { usrSeq: acowWinnerSeq },
    });

    if (!winningUser) {
      throw new NotFoundException('낙찰자를 찾을 수 없습니다.');
    }

    auctionCow.acowStatus = '낙찰';
    auctionCow.acowFinalBid = acowFinalBid;
    auctionCow.acowDelDt = new Date();

    return await this.auctionCowRepository.save(auctionCow);
  }
}
