import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity'; // User Entity import
import { UserBarn } from '../user-barns/user-barn.entity'; // UserBarn Entity import
import { Cow } from '../cows/cow.entity'; // Cow Entity import
import { AuctionBid } from '../auction-bids/auction-bid.entity'; // AuctionBid Entity import

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn({ name: 'auc_seq', unsigned: true })
  aucSeq: number; // 경매 시퀀스

  @Column({ name: 'usr_seq', nullable: false }) // nullable을 false로 설정하여 필수값으로 변경
  usrSeq: number; // 사용자 시퀀스 (Foreign Key)

  @Column({ name: 'usr_barn_seq', nullable: false }) // nullable을 false로 설정하여 필수값으로 변경
  usrBarnSeq: number; // 축사 시퀀스 (Foreign Key)

  @Column({ name: 'cow_seq', nullable: false }) // nullable을 false로 설정하여 필수값으로 변경
  cowSeq: number; // 소 시퀀스 (Foreign Key)

  @Column({ name: 'auc_broadcast_title', nullable: true })
  aucBroadcastTitle: string; // 경매 방송 제목

  @Column({ name: 'auc_status', nullable: true, default: '진행중' })
  aucStatus: string; // 경매 상태

  @Column({ name: 'auc_final_bid', type: 'int', nullable: true })
  aucFinalBid: number; // 낙찰가

  @CreateDateColumn({ name: 'auc_crt_dt', type: 'datetime' }) // 생성일에 현재시간 자동 설정
  aucCrtDt: Date; // 등록일

  // Many-to-One 관계 설정
  @ManyToOne(() => User, (user) => user.auctions)
  user: User; // 사용자와의 관계

  @ManyToOne(() => UserBarn, (userBarn) => userBarn.auctions)
  userBarn: UserBarn; // 축사와의 관계

  @ManyToOne(() => Cow, (cow) => cow.auctions)
  cow: Cow; // 소와의 관계

  @OneToMany(() => AuctionBid, (auctionBid) => auctionBid.auction)
  auctionBids: AuctionBid[]; // 관계 추가
}
