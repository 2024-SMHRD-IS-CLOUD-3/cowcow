import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity'; // User Entity import
import { Auction } from '../auctions/auction.entity'; // Auction Entity import

@Entity('cows')
export class Cow {
  @PrimaryGeneratedColumn({ name: 'cow_seq', unsigned: true })
  cowSeq: number; // 소 시퀀스

  @Column({ name: 'usr_seq', nullable: false }) // Foreign Key로 반드시 필요할 경우 nullable: false로 설정
  usrSeq: number; // 사용자 시퀀스 (Foreign Key)

  @Column({ name: 'cow_no', nullable: true })
  cowNo: string; // 개체 번호

  @Column({ name: 'cow_bir_dt', type: 'date', nullable: true })
  cowBirDt: Date; // 출생일

  @Column({ name: 'cow_gdr', nullable: true })
  cowGdr: string; // 성별

  @Column({ name: 'cow_gen', nullable: true })
  cowGen: string; // 유전자 계통

  @Column({ name: 'cow_kpn', nullable: true })
  cowKpn: string; // KPN 번호

  @Column({ name: 'cow_prt', type: 'int', nullable: true })
  cowPrt: number; // 산차

  @Column({ name: 'notes', type: 'varchar', length: 255, nullable: true })
  notes: string; // 비고

  // Many-to-One 관계 설정
  @ManyToOne(() => User, (user) => user.cows, { onDelete: 'CASCADE' }) // 관계 설정
  user: User; // 사용자와의 관계

  @OneToMany(() => Auction, (auction) => auction.cow)
    auctions: Auction[]; // 관계 추가

}
