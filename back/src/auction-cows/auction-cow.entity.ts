import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cow } from '../cows/cow.entity';
import { User } from '../users/user.entity';

@Entity('auction_cows')
export class AuctionCow {
  @PrimaryGeneratedColumn({ name: 'auc_cow_seq', unsigned: true })
  aucCowSeq: number;

  @Column({ name: 'cow_seq', unsigned: true, nullable: false })
  cowSeq: number;

  @Column({ name: 'auc_cow_bid_pri', type: 'int', nullable: true })
  aucCowBidPri: number;

  @Column({ name: 'auc_cow_ai_pri', type: 'int', nullable: true })
  aucCowAiPri: number;

  @Column({ name: 'auc_cow_apr_pri', type: 'int', nullable: true })
  aucCowAprPri: number;

  @Column({ name: 'auc_cow_fin_pri', type: 'int', nullable: true })
  aucCowFinPri: number;

  @Column({ name: 'auc_cow_buyer', unsigned: true, nullable: true })
  aucCowBuyer: number;

  @Column({ name: 'auc_cow_status', nullable: true })
  aucCowStatus: string;

  @Column({ name: 'auc_cow_condition', nullable: true })
  aucCowCondition: string;

  @Column({ name: 'auc_cow_fin_dt', type: 'datetime', nullable: true })
  aucCowFinDt: Date;

  @Column({ name: 'auc_cow_crt_dt', type: 'datetime', nullable: true })
  aucCowCrtDt: Date;

  @ManyToOne(() => Cow, (cow) => cow.cowSeq)
  cow: Cow;

  @ManyToOne(() => User, (user) => user.usrSeq)
  buyer: User;
}
