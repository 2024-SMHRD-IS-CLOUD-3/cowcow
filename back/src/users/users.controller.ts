import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('signup') // POST /users/signup
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Post('login') // POST /users/login
  async loginUser(@Body() userData: { usrEml: string; usrPwd: string }): Promise<User | null> {
    return this.usersService.validateUser(userData.usrEml, userData.usrPwd);
  }

  @Delete(':id') // DELETE /users/:id
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
