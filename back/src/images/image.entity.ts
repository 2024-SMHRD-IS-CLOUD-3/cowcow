import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn({ name: 'img_seq', unsigned: true })
  imgSeq: number;

  @Column({ name: 'usr_seq', unsigned: true, nullable: true })
  usrSeq: number;

  @Column({ name: 'img_org_nm', nullable: true })
  imgOrgNm: string;

  @Column({ name: 'img_sav_nm', nullable: true })
  imgSavNm: string;

  @Column({ name: 'img_file_path', nullable: true })
  imgFilePath: string;

  @Column({ name: 'img_file_ext', nullable: true })
  imgFileExt: string;

  @Column({ name: 'img_file_siz', type: 'int', nullable: true })
  imgFileSiz: number;

  @Column({ name: 'img_file_cap', type: 'bigint', nullable: true })
  imgFileCap: number;

  @Column({ name: 'img_crt_dt', type: 'datetime', nullable: true })
  imgCrtDt: Date;

  @ManyToOne(() => User, (user) => user.images)
  user: User;
}
