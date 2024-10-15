import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('user_barns')
export class UserBarn {
  @PrimaryGeneratedColumn({ name: 'barn_seq', unsigned: true })
  barnSeq: number;

  @Column({ name: 'usr_seq', unsigned: true, nullable: true })
  usrSeq: number;

  @Column({ name: 'barn_nm', nullable: true })
  barnNm: string;

  @Column({ name: 'barn_add', nullable: true })
  barnAdd: string;

  @Column({ name: 'barn_add2', nullable: true })
  barnAdd2: string;

  @Column({ name: 'barn_cow_cnt', type: 'int', nullable: true })
  barnCowCnt: number;

  @Column({ name: 'barn_crt_dt', type: 'datetime', nullable: true })
  barnCrtDt: Date;

  @ManyToOne(() => User, (user) => user.userBarns)
  user: User;
}
