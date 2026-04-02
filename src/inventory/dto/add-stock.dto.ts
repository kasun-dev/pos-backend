import { IsInt, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddStockDto {
  @ApiProperty({ example: 'variant-id' })
  @IsString()
  productVariantId: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  quantity: number;
}