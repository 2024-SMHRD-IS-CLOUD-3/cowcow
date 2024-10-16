import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { usrSeq: id } });
  }

  // 모든 사용자 조회
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

}
