import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserBarn } from '../user-barns/user-barn.entity';

@Entity('cows')
export class Cow {
  @PrimaryGeneratedColumn({ name: 'cow_seq', unsigned: true })
  cowSeq: number;

  @Column({ name: 'barn_seq', unsigned: true, nullable: true })
  barnSeq: number;

  @Column({ name: 'cow_no', nullable: false })
  cowNo: string;

  @Column({ name: 'cow_bir_dt', type: 'date', nullable: true })
  cowBirDt: Date;

  @Column({ name: 'cow_gdr', nullable: true })
  cowGdr: string;

  @Column({ name: 'cow_gen', nullable: true })
  cowGen: string;

  @Column({ name: 'cow_kpn', nullable: true })
  cowKpn: string;

  @Column({ name: 'cow_prt', type: 'int', nullable: true })
  cowPrt: number;

  @Column({ name: 'cow_hp', nullable: true })
  cowHp: string;

  @Column({ name: 'notes', nullable: true })
  notes: string;

  @ManyToOne(() => UserBarn, (userBarn) => userBarn.barnSeq)
  userBarn: UserBarn;
}
