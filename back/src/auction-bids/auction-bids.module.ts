import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionBidsService } from './auction-bids.service';
import { AuctionBidsController } from './auction-bids.controller';
import { AuctionBid } from './auction-bid.entity';
import { Auction } from '../auctions/auction.entity';
import { AlarmsService } from '../alarms/alarms.service';
import { Alarm } from '../alarms/alarm.entity';
import { User } from '../users/user.entity';
import { AlarmsGateway } from 'src/alarms/alarms.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionBid, Auction, Alarm, User])],
  controllers: [AuctionBidsController],
  providers: [AuctionBidsService, AlarmsService, AlarmsGateway ],
})
export class AuctionBidsModule {}
