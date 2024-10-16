import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { Auction } from './auction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction])],
  controllers: [AuctionsController],
  providers: [AuctionsService],
})
export class AuctionsModule {}
