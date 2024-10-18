import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity'; // User Entity import
import { Auction } from '../auctions/auction.entity'; // Auction Entity import

@Entity('user_barns')
export class UserBarn {
  @PrimaryGeneratedColumn({ name: 'usr_barn_seq', unsigned: true })
  usrBarnSeq: number; // 축사 시퀀스

  @Column({ name: 'usr_seq', nullable: false })
  usrSeq: number; // 사용자 시퀀스 (Foreign Key)

  @Column({ name: 'usr_barn_name', nullable: true })
  usrBarnName: string; // 축사명

  // Many-to-One 관계 설정
  @ManyToOne(() => User, (user) => user.userBarns)
  user: User; // 사용자와의 관계

  @OneToMany(() => Auction, (auction) => auction.userBarn)
    auctions: Auction[]; // 관계 추가

}
