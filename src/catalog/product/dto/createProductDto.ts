import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsArray, IsUrl, Min, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProductColor, ProductFit, ProductStyle } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsEnum(ProductColor)
  color: ProductColor[];

  @IsOptional()
  @IsEnum(ProductFit)
  fit?: ProductFit[];

  @IsOptional()
  @IsArray()
  @IsEnum(ProductStyle, { each: true })
  styleTags?: ProductStyle[];

  @Transform(()=> Number)
  @IsNotEmpty()
  @IsNumber()
  subCategoryId : number
}
