import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cow } from '../cows/cow.entity';

@Entity('cow_details')
export class CowDetail {
  @PrimaryGeneratedColumn({ name: 'dtl_seq', unsigned: true })
  dtlSeq: number;

  @Column({ name: 'cow_seq', unsigned: true, nullable: true })
  cowSeq: number;

  @Column({ name: 'dtl_wgh', type: 'decimal', precision: 10, scale: 1, nullable: true })
  dtlWgh: number;

  @Column({ name: 'dtl_hgh', type: 'decimal', precision: 10, scale: 1, nullable: true })
  dtlHgh: number;

  @Column({ name: 'dtl_wid', type: 'decimal', precision: 10, scale: 1, nullable: true })
  dtlWid: number;

  @Column({ name: 'dtl_len', type: 'decimal', precision: 10, scale: 1, nullable: true })
  dtlLen: number;

  @Column({ name: 'dtl_msr_dt', type: 'date', nullable: true })
  dtlMsrDt: Date;

  @Column({ name: 'dtl_hp_sta', nullable: true })
  dtlHpSta: string;

  @Column({ name: 'dtl_crt_dt', type: 'datetime', nullable: true })
  dtlCrtDt: Date;

  @ManyToOne(() => Cow, (cow) => cow.cowSeq)
  cow: Cow;
}
