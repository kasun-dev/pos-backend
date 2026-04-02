import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE
  async create(dto: CreateProductDto, tenantId: string) {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        basePrice: dto.basePrice,
        hasVariants: dto.hasVariants,
        tenantId,
      },
    });

    return {
      message: 'Product created successfully',
      data: product,
    };
  }

  // ✅ GET ALL (tenant-safe)
  async findAll(tenantId: string) {
    const products = await this.prisma.product.findMany({
      where: { tenantId },
      include: {
        variants: true,
      },
    });

    return {
      data: products,
    };
  }

  // ✅ GET ONE
  async findOne(id: string, tenantId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (product.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return {
      data: product,
    };
  }

  // ✅ UPDATE
  async update(id: string, dto: UpdateProductDto, tenantId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (product.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: dto,
    });

    return {
      message: 'Product updated successfully',
      data: updated,
    };
  }

  // ✅ DELETE
  async remove(id: string, tenantId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (product.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: 'Product deleted successfully',
    };
  }

  // ✅ GET ALL PRODUCTS FOR A TENANT
  async findAllByTenant(tenantId: string) {
    const products = await this.prisma.product.findMany({
      where: { tenantId },
      include: {
        variants: true,
      },
    });
    return products;
  }

  async addVariant(
  productId: string,
  dto: CreateVariantDto,
  tenantId: string,
) {
  // 🔍 check product exists
  const product = await this.prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  // 🔒 tenant protection
  if (product.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    // ❗ ensure product supports variants
    if (!product.hasVariants) {
      throw new BadRequestException('This product has no variants');
    }

    // 🚀 create variant
    const variant = await this.prisma.productVariant.create({
      data: {
        productId,
        sku: dto.sku,
        price: dto.price,
        attributes: dto.attributes,
      },
    });

    await this.prisma.inventory.create({
      data: {
        productVariantId: variant.id,
        quantity: 0,
      },
    });

    return {
      message: 'Variant added successfully',
      data: variant,
    };
  }

}