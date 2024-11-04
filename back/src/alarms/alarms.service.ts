import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alarm } from './alarm.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmsRepository: Repository<Alarm>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, // User 레포지토리 주입
  ) {}

  // 새로운 알림 생성
  async createAlarm(userId: number, message: string): Promise<Alarm> {
    // userId에 해당하는 사용자 조회
    const user = await this.usersRepository.findOne({ where: { usrSeq: userId } });
    if (!user) {
      throw new NotFoundException(`ID ${userId}에 해당하는 사용자를 찾을 수 없습니다.`);
    }

    // 알림 엔티티 생성
    const alarm = this.alarmsRepository.create({
      user,       // user 객체를 직접 할당
      message,
    });
    return this.alarmsRepository.save(alarm);
  }

  // 특정 사용자의 알림 조회
  async getUserAlarms(userId: number): Promise<Alarm[]> {
    // userId로 특정 사용자의 알림 조회
    return this.alarmsRepository.find({
      where: { user: { usrSeq: userId } }, // user 필드에 접근하여 사용자 id 확인
      order: { createdAt: 'DESC' },
    });
  }
}
