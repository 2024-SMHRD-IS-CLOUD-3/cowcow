import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cow } from './cow.entity';

@Injectable()
export class CowsService {
  constructor(
    @InjectRepository(Cow)
    private readonly cowRepository: Repository<Cow>,
  ) {}

  // 모든 소 조회
  async findAll(): Promise<Cow[]> {
    return this.cowRepository.find();
  }

  // 특정 소 조회
  async findOne(cowSeq: number): Promise<Cow> {
    const cow = await this.cowRepository.findOne({ where: { cowSeq } });
    if (!cow) {
      throw new NotFoundException(`Cow with ID ${cowSeq} not found`);
    }
    return cow;
  }

  // 소 생성
  async create(data: Partial<Cow>): Promise<Cow> {
    const newCow = this.cowRepository.create(data);
    return this.cowRepository.save(newCow);
  }

  // 소 삭제
  async remove(cowSeq: number): Promise<void> {
    const result = await this.cowRepository.delete(cowSeq);
    if (result.affected === 0) {
      throw new NotFoundException(`Cow with ID ${cowSeq} not found`);
    }
  }
}
