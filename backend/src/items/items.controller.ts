import { Controller, Get, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { QueryItemsDto } from './dto/query-items.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(@Query() query: QueryItemsDto) {
    return this.itemsService.findAll(query.limit, query.offset);
  }
}