import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Image } from '../images/image.entity';
import { UserBarn } from '../user-barns/user-barn.entity';
import { AuctionBid } from '../auction-bids/auction-bid.entity';

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

  @Column({ name: 'usr_crt_dt', type: 'datetime', nullable: true })
  usrCrtDt: Date;

  @OneToMany(() => Image, (image) => image.user)
  images: Image[];

  @OneToMany(() => UserBarn, (userBarn) => userBarn.user)
  userBarns: UserBarn[];

  @OneToMany(() => AuctionBid, (auctionBid) => auctionBid.user)
  auctionBids: AuctionBid[];
}
