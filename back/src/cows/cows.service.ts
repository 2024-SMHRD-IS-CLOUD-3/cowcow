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

  // 소 등록
  async create(cowData: Partial<Cow>): Promise<Cow> {
    const cow = this.cowRepository.create(cowData);
    return this.cowRepository.save(cow);
  }

  // 특정 소 조회
  async findOne(id: number): Promise<Cow> {
    const cow = await this.cowRepository.findOne({
      where: { cowSeq: id },
      relations: ['user', 'auctions'], // 연관된 데이터도 조회
    });
    if (!cow) {
      throw new NotFoundException(`Cow with ID ${id} not found`);
    }
    return cow;
  }

  // 모든 소 조회
  async findAll(): Promise<Cow[]> {
    return this.cowRepository.find({ relations: ['user', 'auctions'] });
  }
}
