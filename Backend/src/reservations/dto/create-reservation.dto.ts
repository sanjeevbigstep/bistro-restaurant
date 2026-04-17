import {
  IsString,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  @Min(1)
  @Max(20)
  partySize: number;

  @IsDateString()
  date: string;

  @IsString()
  timeSlot: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  guestName?: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;
}
