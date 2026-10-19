import {
  Pattern,
  ProductColor,
  ProductFit,
  ProductStyle,
  SubCategory,
} from '@prisma/client';

import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

const toArray = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value;
};

export class ProductQueryDto {
    
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  // Subcategory ki ID
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  subCategory?: string[];

  // Multiple colors
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsEnum(ProductColor, { each: true })
  colors?: ProductColor[];

  // Multiple styles
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsEnum(ProductStyle, { each: true })
  style?: ProductStyle[];

  // Multiple fits
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsEnum(ProductFit, { each: true })
  fit?: ProductFit[];

  // Multiple patterns, although each product has one pattern
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsEnum(Pattern, { each: true })
  pattern?: Pattern[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  // Optional text search, if needed
  @IsOptional()
  @IsString()
  description?: string;
}