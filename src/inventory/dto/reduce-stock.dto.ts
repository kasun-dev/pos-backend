import { IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReduceStockDto {
  @ApiProperty({ example: 'variant-id' })
  @IsString()
  productVariantId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}