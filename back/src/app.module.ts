import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity'; // 엔티티 경로
import { Image } from './images/image.entity';
import { UserBarn } from './user-barns/user-barn.entity';
import { Cow } from './cows/cow.entity';
import { CowDetail } from './cow-details/cow-detail.entity';
import { AuctionCow } from './auction-cows/auction-cow.entity';
import { Auction } from './auctions/auction.entity';
import { AuctionBid } from './auction-bids/auction-bid.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'project-db-cgi.smhrd.com',
    port: 3307,
    username: 'ohi0',
    password: 'smart123!',
    database: 'ohi0',
    entities: [
      User, Image, UserBarn, Cow, CowDetail, AuctionCow, Auction, AuctionBid,
    ],
    synchronize: true, // 개발 중에만 사용 (자동 테이블 생성)
  }),
  TypeOrmModule.forFeature([User, Image, UserBarn, Cow, CowDetail, AuctionCow, Auction, AuctionBid]),
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
