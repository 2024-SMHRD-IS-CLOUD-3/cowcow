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

  // 경매 소 생성
  async create(auctionCowData: Partial<AuctionCow>): Promise<AuctionCow> {
    const auctionCow = this.auctionCowRepository.create(auctionCowData);
    return this.auctionCowRepository.save(auctionCow);
  }

  // 모든 경매 소 조회
  async findAll(): Promise<AuctionCow[]> {
    return this.auctionCowRepository.find({ relations: ['auction', 'cow'] });
  }

  // 특정 경매 소 조회 (ID로 조회)
  async findOne(id: number): Promise<AuctionCow> {
    const auctionCow = await this.auctionCowRepository.findOne({
      where: { acowSeq: id },
      relations: ['auction', 'cow'],
    });

    if (!auctionCow) {
      throw new NotFoundException('해당 경매 소를 찾을 수 없습니다.');
    }

    return auctionCow;
  }

  // 경매 소 삭제
  async delete(id: number): Promise<void> {
    const result = await this.auctionCowRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('해당 경매 소를 찾을 수 없습니다.');
    }
  }

  // 경매 소 정보 업데이트
  async update(id: number, auctionCowData: Partial<AuctionCow>): Promise<AuctionCow> {
    await this.findOne(id); // 존재 여부 확인

    await this.auctionCowRepository.update(id, auctionCowData);
    return this.findOne(id);
  }
}
