import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CowDetailsService } from './cow-details.service';
import { CowDetailsController } from './cow-details.controller';
import { CowDetail } from './cow-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CowDetail])],
  controllers: [CowDetailsController],
  providers: [CowDetailsService],
})
export class CowDetailsModule {}
