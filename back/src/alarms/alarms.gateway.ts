import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AlarmsService } from './alarms.service';
import { Alarm } from './alarm.entity';

@WebSocketGateway({
  namespace: 'alarms',
  cors: {
    origin: '*', // 필요에 따라 클라이언트 도메인을 설정
  },
})
export class AlarmsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly alarmsService: AlarmsService) {}

  // 클라이언트에 실시간 알림을 보냄
  async sendAlarm(usrSeq: number, alarmMsg: string, alarm: Alarm) {
    // const alarm = await this.alarmsService.createAlarm(usrSeq, alarmMsg);
    this.server.to(`user_${usrSeq}`).emit('newAlarm', alarm);
  }

  // 클라이언트 연결 시 특정 방에 가입 (사용자 기반)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() data: { usrSeq: number }) {
    const roomName = `user_${data.usrSeq}`;
    return { event: 'joinedRoom', roomName };
  }
}
