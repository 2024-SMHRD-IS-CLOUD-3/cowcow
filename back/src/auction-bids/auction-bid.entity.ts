import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity'; // User Entity import
import { Auction } from '../auctions/auction.entity'; // Auction Entity import

@Entity('auction_bids')
export class AuctionBid {
  @PrimaryGeneratedColumn({ name: 'bid_seq', unsigned: true })
  bidSeq: number; // 입찰 시퀀스

  @Column({ name: 'auc_seq', nullable: false }) // nullable을 false로 설정하여 필수값으로 변경
  aucSeq: number; // 경매 시퀀스 (Foreign Key)

  @Column({ name: 'bid_acc', nullable: false }) // nullable을 false로 설정하여 필수값으로 변경
  bidAcc: number; // 입찰자 (Foreign Key)

  @Column({ name: 'bid_amt', type: 'int', nullable: false }) // nullable을 false로 설정하여 필수값으로 변경
  bidAmt: number; // 입찰 금액

  @CreateDateColumn({ name: 'bid_dt', type: 'datetime' }) // 생성 시 현재 시간 자동 설정
  bidDt: Date; // 입찰 일시

  // Many-to-One 관계 설정
  @ManyToOne(() => Auction, (auction) => auction.auctionBids)
  auction: Auction; // 경매와의 관계

  @ManyToOne(() => User, (user) => user.auctionBids)
  user: User; // 입찰자와의 관계
}
