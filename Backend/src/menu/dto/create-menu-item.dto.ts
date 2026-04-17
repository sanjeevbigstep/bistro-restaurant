import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsUUID()
  categoryId: string;
}
