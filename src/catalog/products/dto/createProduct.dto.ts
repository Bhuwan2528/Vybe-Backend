
import {
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
  FitType,
  ProductColor,
  StyleTag,
} from '@prisma/client';
import { CreateProductVariantDto } from './createProductVariant.dto.js';


export class CreateProductDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(ProductColor, { each: true })
  colors: ProductColor[];

  @IsOptional()
  @IsEnum(FitType)
  fit?: FitType;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(StyleTag, { each: true })
  styleTags?: StyleTag[];

  @IsInt()
  @Min(1)
  subCategoryId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}
