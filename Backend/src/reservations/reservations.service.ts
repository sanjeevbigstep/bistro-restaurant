import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';
import { ReservationStatus } from '../common/enums/reservation-status.enum';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepo: Repository<Reservation>,
  ) {}

  async create(dto: CreateReservationDto, userId?: string): Promise<Reservation> {
    const conflict = await this.reservationsRepo.findOne({
      where: {
        date: dto.date,
        timeSlot: dto.timeSlot,
        status: ReservationStatus.CONFIRMED,
      },
    });

    if (conflict) {
      throw new BadRequestException('That time slot is fully booked. Please choose another time.');
    }

    const reservation = this.reservationsRepo.create({
      ...dto,
      userId: userId ?? null,
    });

    return this.reservationsRepo.save(reservation);
  }

  findAll(filters?: { date?: string; status?: ReservationStatus }) {
    const where: Record<string, unknown> = {};
    if (filters?.date) where['date'] = filters.date;
    if (filters?.status) where['status'] = filters.status;

    return this.reservationsRepo.find({
      where,
      order: { date: 'ASC', timeSlot: 'ASC' },
      relations: ['user'],
    });
  }

  async findByUser(userId: string) {
    return this.reservationsRepo.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async updateStatus(id: string, dto: UpdateReservationStatusDto): Promise<Reservation> {
    const reservation = await this.reservationsRepo.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reservation not found');
    reservation.status = dto.status;
    return this.reservationsRepo.save(reservation);
  }

  async remove(id: string) {
    const reservation = await this.reservationsRepo.findOne({ where: { id } });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return this.reservationsRepo.remove(reservation);
  }
}
