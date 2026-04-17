import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuCategory } from './entities/menu-category.entity';
import { MenuItem } from './entities/menu-item.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto, UpdateMenuItemDto } from './dto/update-menu.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuCategory)
    private categoriesRepo: Repository<MenuCategory>,
    @InjectRepository(MenuItem)
    private itemsRepo: Repository<MenuItem>,
  ) {}

  findAllCategories() {
    return this.categoriesRepo.find({
      order: { displayOrder: 'ASC' },
      relations: ['items'],
    });
  }

  async createCategory(dto: CreateCategoryDto) {
    const category = this.categoriesRepo.create(dto);
    return this.categoriesRepo.save(category);
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await this.categoriesRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    Object.assign(category, dto);
    return this.categoriesRepo.save(category);
  }

  async deleteCategory(id: string) {
    const category = await this.categoriesRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return this.categoriesRepo.remove(category);
  }

  findAllItems() {
    return this.itemsRepo.find({ relations: ['category'], order: { createdAt: 'ASC' } });
  }

  async createItem(dto: CreateMenuItemDto) {
    const category = await this.categoriesRepo.findOne({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException('Category not found');
    const item = this.itemsRepo.create(dto);
    return this.itemsRepo.save(item);
  }

  async updateItem(id: string, dto: UpdateMenuItemDto) {
    const item = await this.itemsRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    Object.assign(item, dto);
    return this.itemsRepo.save(item);
  }

  async deleteItem(id: string) {
    const item = await this.itemsRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return this.itemsRepo.remove(item);
  }
}
