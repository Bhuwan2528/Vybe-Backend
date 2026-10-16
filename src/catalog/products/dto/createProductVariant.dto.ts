
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';

import { ProductColor, ProductSize } from '@prisma/client';

export class CreateProductVariantDto {
  @IsEnum(ProductSize)
  size: ProductSize;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;
}
