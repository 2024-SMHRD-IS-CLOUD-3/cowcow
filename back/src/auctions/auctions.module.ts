import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { Auction } from './auction.entity';
import { User } from '../users/user.entity';
import { AuctionBid } from '../auction-bids/auction-bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, User, AuctionBid])],
  controllers: [AuctionsController],
  providers: [AuctionsService],
})
export class AuctionsModule {}
