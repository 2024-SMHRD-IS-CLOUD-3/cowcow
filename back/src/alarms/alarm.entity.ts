import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('alarms')
export class Alarm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string; // 알림 메시지

  @Column({ default: false })
  isRead: boolean; // 읽음 여부

  @CreateDateColumn()
  createdAt: Date; // 생성 날짜

  @ManyToOne(() => User, (user) => user.alarms)
  @JoinColumn({ name: 'usr_seq' }) // 외래 키 이름을 명시적으로 지정
  user: User; // 알림 수신자
}
