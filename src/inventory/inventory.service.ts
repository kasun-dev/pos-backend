import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddStockDto } from './dto/add-stock.dto';
import { ReduceStockDto } from './dto/reduce-stock.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // ➕ ADD STOCK
  async addStock(dto: AddStockDto, tenantId: string) {
    const { productVariantId, quantity } = dto;

    const variant = await this.prisma.productVariant.findUnique({
      where: { id: productVariantId },
      include: { product: true },
    });

    if (!variant) throw new NotFoundException('Variant not found');

    if (variant.product.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    const inventory = await this.prisma.inventory.upsert({
      where: { productVariantId },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        productVariantId,
        quantity,
      },
    });

    return {
      message: 'Stock added successfully',
      data: inventory,
    };
  }

  // ➖ REDUCE STOCK (IMPORTANT)
  async reduceStock(dto: ReduceStockDto, tenantId: string) {
    const { productVariantId, quantity } = dto;

    return this.prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: { id: productVariantId },
        include: { product: true },
      });

      if (!variant) throw new NotFoundException('Variant not found');

      if (variant.product.tenantId !== tenantId) {
        throw new ForbiddenException('Access denied');
      }

      const inventory = await tx.inventory.findUnique({
        where: { productVariantId },
      });

      if (!inventory || inventory.quantity < quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      const updated = await tx.inventory.update({
        where: { productVariantId },
        data: {
          quantity: { decrement: quantity },
        },
      });

      return {
        message: 'Stock reduced successfully',
        data: updated,
      };
    });
  }

  // GET INVENTORY
  async getAll(tenantId: string) {
    const data = await this.prisma.inventory.findMany({
      include: {
        variant: {
          include: {
            product: true,
          },
        },
      },
    });

    // filter by tenant
    const filtered = data.filter(
      (item) => item.variant.product.tenantId === tenantId,
    );

    return { data: filtered };
  }
}