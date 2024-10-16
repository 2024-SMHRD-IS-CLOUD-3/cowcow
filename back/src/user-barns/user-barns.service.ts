import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBarn } from './user-barn.entity';

@Injectable()
export class UserBarnsService {
  constructor(
    @InjectRepository(UserBarn)
    private readonly userBarnRepository: Repository<UserBarn>,
  ) {}

  // 모든 축사 조회
  async findAll(): Promise<UserBarn[]> {
    return this.userBarnRepository.find();
  }

  // 특정 축사 조회
  async findOne(barnSeq: number): Promise<UserBarn> {
    const barn = await this.userBarnRepository.findOne({ where: { barnSeq } });
    if (!barn) {
      throw new NotFoundException(`Barn with ID ${barnSeq} not found`);
    }
    return barn;
  }

  // 축사 생성
  async create(data: Partial<UserBarn>): Promise<UserBarn> {
    const newBarn = this.userBarnRepository.create(data);
    return this.userBarnRepository.save(newBarn);
  }

  // 축사 삭제
  async remove(barnSeq: number): Promise<void> {
    const result = await this.userBarnRepository.delete(barnSeq);
    if (result.affected === 0) {
      throw new NotFoundException(`Barn with ID ${barnSeq} not found`);
    }
  }
}
