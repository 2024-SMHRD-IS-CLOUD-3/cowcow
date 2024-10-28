import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionCowsService } from './auction-cows.service';
import { AuctionCowsController } from './auction-cows.controller';
import { AuctionCow } from './auction-cow.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionCow, User])],
  controllers: [AuctionCowsController],
  providers: [AuctionCowsService],
})
export class AuctionCowsModule {}
