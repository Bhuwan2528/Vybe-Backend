import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProductDto } from './createProduct.dto.js';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['variants'] as const),
) {}