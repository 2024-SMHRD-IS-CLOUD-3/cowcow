import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { UserBarn } from '../user-barns/user-barn.entity';
import { Cow } from '../cows/cow.entity';
import { AuctionBid } from '../auction-bids/auction-bid.entity';

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn({ name: 'auc_seq', unsigned: true })
  aucSeq: number;

  @Column({ name: 'usr_seq', unsigned: true, nullable: true })
  usrSeq: number;

  @Column({ name: 'usr_barn_seq', unsigned: true, nullable: true })
  usrBarnSeq: number;

  @Column({ name: 'cow_seq', unsigned: true, nullable: true })
  cowSeq: number;

  @Column({ name: 'auc_broadcast_title', nullable: true })
  aucBroadcastTitle: string;

  @Column({ name: 'auc_status', nullable: true, default: '진행중' })
  aucStatus: string;

  @Column({ name: 'auc_final_bid', type: 'int', nullable: true })
  aucFinalBid: number;

  @Column({ name: 'auc_crt_dt', type: 'datetime' })
  aucCrtDt: Date;

  @ManyToOne(() => User, (user) => user.auctions)
  @JoinColumn({ name: 'usr_seq' })
  user: User;

  @ManyToOne(() => UserBarn, (userBarn) => userBarn.auctions)
  @JoinColumn({ name: 'usr_barn_seq' })
  userBarn: UserBarn;

  @ManyToOne(() => Cow, (cow) => cow.auctions)
  @JoinColumn({ name: 'cow_seq' })
  cow: Cow;

  @OneToMany(() => AuctionBid, (auctionBid) => auctionBid.auction)
  bids: AuctionBid[];
}
