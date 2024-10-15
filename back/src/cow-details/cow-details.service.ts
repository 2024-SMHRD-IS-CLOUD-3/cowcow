import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CowDetail } from './cow-detail.entity';

@Injectable()
export class CowDetailsService {
  constructor(
    @InjectRepository(CowDetail)
    private readonly cowDetailRepository: Repository<CowDetail>,
  ) {}

  // 모든 소 세부 정보 조회
  async findAll(): Promise<CowDetail[]> {
    return this.cowDetailRepository.find();
  }

  // 특정 소 세부 정보 조회
  async findOne(dtlSeq: number): Promise<CowDetail> {
    const detail = await this.cowDetailRepository.findOne({ where: { dtlSeq } });
    if (!detail) {
      throw new NotFoundException(`Detail with ID ${dtlSeq} not found`);
    }
    return detail;
  }

  // 소 세부 정보 생성
  async create(data: Partial<CowDetail>): Promise<CowDetail> {
    const newDetail = this.cowDetailRepository.create(data);
    return this.cowDetailRepository.save(newDetail);
  }

  // 소 세부 정보 삭제
  async remove(dtlSeq: number): Promise<void> {
    const result = await this.cowDetailRepository.delete(dtlSeq);
    if (result.affected === 0) {
      throw new NotFoundException(`Detail with ID ${dtlSeq} not found`);
    }
  }
}
