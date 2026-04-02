import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateVariantDto } from './dto/create-variant.dto';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(
    @Body() dto: CreateProductDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productService.create(dto, tenantId);
  }

  @Post(':id/variants')
  addVariant(
    @Param('id') productId: string,
    @Body() dto: CreateVariantDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productService.addVariant(productId, dto, tenantId);
  }

  @Get()
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.productService.findAll(tenantId);
  }

  //get all products based on tentant id taken from jwt
  @Get('tenant')
  findAllByTenant(@CurrentUser('tenantId') tenantId: string) {
    return this.productService.findAllByTenant(tenantId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productService.findOne(id, tenantId);
  }


  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productService.update(id, dto, tenantId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productService.remove(id, tenantId);
  }
}