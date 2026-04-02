import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'T-Shirt' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  basePrice: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  hasVariants: boolean;
}