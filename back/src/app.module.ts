import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// 엔티티 임포트
import { User } from './users/user.entity';
import { UserBarn } from './user-barns/user-barn.entity';
import { Cow } from './cows/cow.entity';
import { Auction } from './auctions/auction.entity';
import { AuctionBid } from './auction-bids/auction-bid.entity';
import { UsersModule } from './users/users.module'; // UsersModule import 추가

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'project-db-cgi.smhrd.com',
      port: 3307,
      username: 'ohi0',
      password: 'smart123!',
      database: 'ohi0',
      entities: [
        User, UserBarn, Cow, Auction, AuctionBid
      ],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([
      User, UserBarn, Cow, Auction, AuctionBid
    ]),
    UsersModule, // UsersModule 추가
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
