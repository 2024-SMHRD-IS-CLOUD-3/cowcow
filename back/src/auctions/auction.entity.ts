import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity'; // User Entity import
import { UserBarn } from '../user-barns/user-barn.entity'; // UserBarn Entity import
import { Cow } from '../cows/cow.entity'; // Cow Entity import

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn({ name: 'auc_seq', unsigned: true })
  aucSeq: number; // 경매 시퀀스

  @Column({ name: 'usr_seq', unsigned: true, nullable: true })
  usrSeq: number; // 사용자 시퀀스 (Foreign Key)

  @Column({ name: 'usr_barn_seq', unsigned: true, nullable: true })
  usrBarnSeq: number; // 축사 시퀀스 (Foreign Key)

  @Column({ name: 'cow_seq', unsigned: true, nullable: true })
  cowSeq: number; // 소 시퀀스 (Foreign Key)

  @Column({ name: 'auc_broadcast_title', nullable: true })
  aucBroadcastTitle: string; // 경매 방송 제목

  @Column({ name: 'auc_status', nullable: true, default: '진행중' })
  aucStatus: string; // 경매 상태

  @Column({ name: 'auc_final_bid', type: 'int', nullable: true })
  aucFinalBid: number; // 낙찰가

  @Column({ name: 'auc_crt_dt', type: 'datetime' })
  aucCrtDt: Date; // 등록일

  @ManyToOne(() => User, (user) => user.usrSeq)
  user: User; // 사용자와의 관계

  @ManyToOne(() => UserBarn, (userBarn) => userBarn.usrBarnSeq)
  userBarn: UserBarn; // 축사와의 관계

  @ManyToOne(() => Cow, (cow) => cow.cowSeq)
  cow: Cow; // 소와의 관계
}
