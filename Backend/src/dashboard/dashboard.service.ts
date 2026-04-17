import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../reservations/entities/reservation.entity';
import { MenuItem } from '../menu/entities/menu-item.entity';
import { User } from '../users/entities/user.entity';
import { ReservationStatus } from '../common/enums/reservation-status.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepo: Repository<Reservation>,
    @InjectRepository(MenuItem)
    private menuItemsRepo: Repository<MenuItem>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async getStats() {
    const today = new Date().toISOString().split('T')[0];

    const [
      todayReservations,
      pendingReservations,
      confirmedReservations,
      totalMenuItems,
      availableMenuItems,
      totalUsers,
      upcomingReservations,
    ] = await Promise.all([
      this.reservationsRepo.count({ where: { date: today } }),
      this.reservationsRepo.count({ where: { status: ReservationStatus.PENDING } }),
      this.reservationsRepo.count({ where: { status: ReservationStatus.CONFIRMED } }),
      this.menuItemsRepo.count(),
      this.menuItemsRepo.count({ where: { isAvailable: true } }),
      this.usersRepo.count(),
      this.reservationsRepo.find({
        where: { status: ReservationStatus.CONFIRMED },
        order: { date: 'ASC', timeSlot: 'ASC' },
        take: 10,
        relations: ['user'],
      }),
    ]);

    return {
      reservations: {
        today: todayReservations,
        pending: pendingReservations,
        confirmed: confirmedReservations,
      },
      menu: {
        total: totalMenuItems,
        available: availableMenuItems,
      },
      users: {
        total: totalUsers,
      },
      upcomingReservations,
    };
  }
}
