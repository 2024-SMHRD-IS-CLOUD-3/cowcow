import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity'; // User Entity import

@Entity('user_barns')
export class UserBarn {
  @PrimaryGeneratedColumn({ name: 'usr_barn_seq', unsigned: true })
  usrBarnSeq: number; // 축사 시퀀스

  @Column({ name: 'usr_seq', unsigned: true, nullable: true })
  usrSeq: number; // 사용자 시퀀스 (Foreign Key)

  @Column({ name: 'usr_barn_name', nullable: true })
  usrBarnName: string; // 축사명

  @ManyToOne(() => User, (user) => user.usrSeq)
  user: User; // 사용자와의 관계
}
