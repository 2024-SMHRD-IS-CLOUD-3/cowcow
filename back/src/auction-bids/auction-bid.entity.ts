import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity'; // User Entity import
import { Auction } from '../auctions/auction.entity'; // Auction Entity import

@Entity('auction_bids')
export class AuctionBid {
  @PrimaryGeneratedColumn({ name: 'bid_seq', unsigned: false })
  bidSeq: number; // 입찰 시퀀스

  @Column({ name: 'auc_seq', unsigned: true, nullable: false })
  aucSeq: number; // 경매 시퀀스 (Foreign Key)

  @Column({ name: 'bid_acc', unsigned: true, nullable: false })
  bidAcc: number; // 입찰자 (Foreign Key)

  @Column({ name: 'bid_amt', type: 'int', nullable: true })
  bidAmt: number; // 입찰 금액

  @Column({ name: 'bid_dt', type: 'datetime' })
  bidDt: Date; // 입찰 일시

  @ManyToOne(() => Auction, (auction) => auction.aucSeq)
  auction: Auction; // 경매와의 관계

  @ManyToOne(() => User, (user) => user.usrSeq)
  user: User; // 입찰자와의 관계
}
