import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 모든 사용자 조회
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // 사용자 생성 (회원가입)
  @Post('signup') // POST /users/signup
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }
}
