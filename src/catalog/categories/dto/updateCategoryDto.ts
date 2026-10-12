import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './createCategoryDto.js';

export class UpdateCategoryDto extends PartialType( CreateCategoryDto ) {}