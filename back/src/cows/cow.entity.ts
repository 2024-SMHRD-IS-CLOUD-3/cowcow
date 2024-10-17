import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserBarn } from '../user-barns/user-barn.entity';

@Entity('cows')
export class Cow {
  @PrimaryGeneratedColumn({ name: 'cow_seq', unsigned: true })
  cowSeq: number;

  @Column({ name: 'barn_seq', unsigned: true, nullable: true })
  barnSeq: number;

  @Column({ name: 'cow_no', type: 'varchar', length: 100, nullable: true })
  cowNo: string;

  @Column({ name: 'cow_bir_dt', type: 'date', nullable: true })
  cowBirDt: Date;

  @Column({ name: 'cow_gdr', type: 'varchar', length: 100, nullable: true })
  cowGdr: string;

  @Column({ name: 'cow_kpn', type: 'varchar', length: 100, nullable: true })
  cowKpn: string;

  @Column({ name: 'cow_prt', type: 'int', nullable: true })
  cowPrt: number;

  @Column({ name: 'cow_notes', type: 'varchar', length: 255, nullable: true })
  cowNotes: string;

  @Column({ name: 'cow_chejang', type: 'decimal', precision: 5, scale: 1, nullable: true })
  cowChejang: number;

  @Column({ name: 'cow_yogakpok', type: 'decimal', precision: 5, scale: 1, nullable: true })
  cowYogakpok: number;

  @Column({ name: 'cow_jwagolpok', type: 'decimal', precision: 5, scale: 1, nullable: true })
  cowJwagolpok: number;

  @Column({ name: 'cow_hyungpok', type: 'decimal', precision: 5, scale: 1, nullable: true })
  cowHyungpok: number;

  @Column({ name: 'cow_chego', type: 'decimal', precision: 5, scale: 1, nullable: true })
  cowChego: number;

  @Column({ name: 'cow_sibjabugo', type: 'decimal', precision: 5, scale: 1, nullable: true })
  cowSibjabugo: number;

  @Column({ name: 'cow_hyungsim', type: 'decimal', precision: 5, scale: 1, nullable: true })
  cowHyungsim: number;

  @Column({ name: 'cow_gojang', type: 'decimal', precision: 5, scale: 1, nullable: true })
  cowGojang: number;

  @Column({ name: 'cow_weight', type: 'decimal', precision: 5, scale: 1, nullable: true })
  cowWeight: number;

  @Column({ name: 'cow_crt_dt', type: 'datetime', nullable: true })
  cowCrtDt: Date;

  @ManyToOne(() => UserBarn, (userBarn) => userBarn.barnSeq)
  userBarn: UserBarn;
}
