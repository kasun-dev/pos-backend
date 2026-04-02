import { IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariantDto {
  @ApiProperty({ example: 'TS-BLK-M' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 1600 })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: {
      size: 'M',
      color: 'Black',
    },
  })
  @IsObject()
  attributes: Record<string, any>;
}