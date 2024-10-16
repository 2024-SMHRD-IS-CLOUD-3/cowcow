import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // 모든 사용자 조회
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // 사용자 생성 (회원가입)
  async create(userData: Partial<User>): Promise<User> {
    // 비밀번호를 암호화하지 않고 그대로 저장
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  // 비밀번호 확인 메서드 추가
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { usrEml: email } });
    if (user && user.usrPwd === password) { // 비밀번호가 일치하는 경우
        return user; // 사용자 반환
    }
    return null; // 비밀번호가 일치하지 않는 경우 null 반환
}
}
