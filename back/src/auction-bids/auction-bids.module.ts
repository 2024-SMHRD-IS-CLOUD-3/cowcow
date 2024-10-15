import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionBidsService } from './auction-bids.service';
import { AuctionBidsController } from './auction-bids.controller';
import { AuctionBid } from './auction-bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionBid])],
  controllers: [AuctionBidsController],
  providers: [AuctionBidsService],
})
export class AuctionBidsModule {}
