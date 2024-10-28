import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionCowsService } from './auction-cows.service';
import { AuctionCowsController } from './auction-cows.controller';
import { AuctionCow } from './auction-cow.entity';
import { User } from '../users/user.entity';
import { UserBarn } from '../user-barns/user-barn.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionCow, User, UserBarn])],
  controllers: [AuctionCowsController],
  providers: [AuctionCowsService],
})
export class AuctionCowsModule {}
