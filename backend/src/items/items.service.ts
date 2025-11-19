import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  async findAll(limit: number = 10, offset: number = 0) {
    const items = await this.itemsRepository.find({
      take: limit,
      skip: offset,
      order: { id: 'ASC' },
      select: ['id', 'name', 'created_at'],
    });

    return items;
  }
}