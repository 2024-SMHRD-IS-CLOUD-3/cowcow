import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmsService } from './alarms.service';
import { AlarmsController } from './alarms.controller';
import { AlarmsGateway } from './alarms.gateway';
import { Alarm } from './alarm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alarm])],
  providers: [AlarmsService, AlarmsGateway],
  controllers: [AlarmsController],
  exports: [AlarmsService],
})
export class AlarmsModule {}
