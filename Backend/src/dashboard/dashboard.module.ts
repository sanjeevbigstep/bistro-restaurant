import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Reservation } from '../reservations/entities/reservation.entity';
import { MenuItem } from '../menu/entities/menu-item.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, MenuItem, User])],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
