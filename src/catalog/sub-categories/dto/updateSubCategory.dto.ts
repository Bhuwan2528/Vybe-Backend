
import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './craeteSubCategory.dto.js';

export class UpdateSubCategoryDto extends PartialType(
  CreateSubCategoryDto,
) {}
