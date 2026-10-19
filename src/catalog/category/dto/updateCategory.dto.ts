import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './createCategory.dto.js';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}