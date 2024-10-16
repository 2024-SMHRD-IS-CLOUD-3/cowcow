import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn({ name: 'auc_seq', unsigned: true })
  aucSeq: number;

  @Column({ name: 'auc_reg', nullable: true })
  aucReg: string;

  @Column({ name: 'auc_cow_cnt', type: 'int', nullable: true })
  aucCowCnt: number;

  @Column({ name: 'auc_str_dt', type: 'date', nullable: true })
  aucStrDt: Date;

  @Column({ name: 'auc_end_dt', type: 'date', nullable: true })
  aucEndDt: Date;

  @Column({ name: 'auc_max_pri', type: 'int', nullable: true })
  aucMaxPri: number;

  @Column({ name: 'auc_min_pri', type: 'int', nullable: true })
  aucMinPri: number;

  @Column({ name: 'auc_crt_dt', type: 'datetime', nullable: true })
  aucCrtDt: Date;
}
