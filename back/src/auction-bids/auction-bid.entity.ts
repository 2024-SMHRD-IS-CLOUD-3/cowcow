import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Auction } from '../auctions/auction.entity';
import { Cow } from '../cows/cow.entity';
import { User } from '../users/user.entity';

@Entity('auction_bids')
export class AuctionBid {
  @PrimaryGeneratedColumn({ name: 'bid_seq', unsigned: true })
  bidSeq: number;

  @Column({ name: 'bid_acc', unsigned: true, nullable: false })
  bidAcc: number;

  @Column({ name: 'auc_seq', unsigned: true, nullable: false })
  aucSeq: number;

  @Column({ name: 'cow_seq', unsigned: true, nullable: false })
  cowSeq: number;

  @Column({ name: 'bid_amt', type: 'int', nullable: true })
  bidAmt: number;

  @Column({ name: 'bid_dt', type: 'date', nullable: true })
  bidDt: Date;

  @Column({ name: 'bid_tim', type: 'datetime', nullable: true })
  bidTim: Date;

  @Column({ name: 'bid_is_fin', nullable: true })
  bidIsFin: string;

  @ManyToOne(() => User, (user) => user.usrSeq)
  user: User;

  @ManyToOne(() => Auction, (auction) => auction.aucSeq)
  auction: Auction;

  @ManyToOne(() => Cow, (cow) => cow.cowSeq)
  cow: Cow;
}
