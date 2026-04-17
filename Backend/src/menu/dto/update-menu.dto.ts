import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { CreateMenuItemDto } from './create-menu-item.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
export class UpdateMenuItemDto extends PartialType(CreateMenuItemDto) {}
