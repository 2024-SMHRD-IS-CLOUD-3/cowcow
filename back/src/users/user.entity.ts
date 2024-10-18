import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Auction } from '../auctions/auction.entity';
import { UserBarn } from '../user-barns/user-barn.entity';
import { AuctionBid } from '../auction-bids/auction-bid.entity';
import { Cow } from '../cows/cow.entity'; // Cow Entity import

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'usr_seq', unsigned: true })
  usrSeq: number;

  @Column({ name: 'usr_typ', nullable: true })
  usrTyp: string;

  @Column({ name: 'usr_acc', nullable: true })
  usrAcc: string;

  @Column({ name: 'usr_pwd', nullable: true })
  usrPwd: string;

  @Column({ name: 'usr_nm', nullable: true })
  usrNm: string;

  @Column({ name: 'usr_phn', nullable: true })
  usrPhn: string;

  @Column({ name: 'usr_eml', nullable: true })
  usrEml: string;

  @OneToMany(() => Auction, (auction) => auction.user)
  auctions: Auction[];

  @OneToMany(() => UserBarn, (userBarn) => userBarn.user)
  userBarns: UserBarn[];

  @OneToMany(() => AuctionBid, (auctionBid) => auctionBid.user)
  auctionBids: AuctionBid[];

  @OneToMany(() => Cow, (cow) => cow.user)
    cows: Cow[]; // 관계 추가
  
}
