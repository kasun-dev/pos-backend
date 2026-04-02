import { Body, Controller, Post, Get } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { AddStockDto } from './dto/add-stock.dto';
import { ReduceStockDto } from './dto/reduce-stock.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('add')
  addStock(
    @Body() dto: AddStockDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.inventoryService.addStock(dto, tenantId);
  }

  @Post('reduce')
  reduceStock(
    @Body() dto: ReduceStockDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.inventoryService.reduceStock(dto, tenantId);
  }

  @Get()
  getAll(@CurrentUser('tenantId') tenantId: string) {
    return this.inventoryService.getAll(tenantId);
  }
}