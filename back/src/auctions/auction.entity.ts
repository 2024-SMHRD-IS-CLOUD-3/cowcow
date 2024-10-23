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

  @Column({ name: 'auc_bottom_price', nullable: true, default: 0})
  aucBottomPrice: number;

  @Column({ name: 'auc_del_dt', nullable: true})
  aucDelDt: Date;

  // 사용자와의 관계 설정 (경매 등록자)
  @ManyToOne(() => User, (user) => user.auctions)
  @JoinColumn({ name: 'usr_seq' })
  user: User;

  // 축사와의 관계 설정
  @ManyToOne(() => UserBarn, (userBarn) => userBarn.auctions)
  @JoinColumn({ name: 'usr_barn_seq' })
  userBarn: UserBarn;

  // 소와의 관계 설정
  @ManyToOne(() => Cow, (cow) => cow.auctions)
  @JoinColumn({ name: 'cow_seq' })
  cow: Cow;

  // 입찰과의 양방향 관계 설정
  @OneToMany(() => AuctionBid, (auctionBid) => auctionBid.auction)
  bids: AuctionBid[];

  // 낙찰자와의 관계 설정
  @ManyToOne(() => User, (user) => user.auctionsWon)
  @JoinColumn({ name: 'auc_winner_seq' }) // 외래 키 컬럼 명시적으로 지정
  winningUser: User; // 낙찰자 정보
}
