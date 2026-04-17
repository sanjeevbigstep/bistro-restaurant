import { IsString, MinLength, MaxLength, IsInt, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsInt()
  @Min(0)
  displayOrder: number;
}
