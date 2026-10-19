import { Module } from '@nestjs/common';
import { SubCategoryController } from './sub-category.controller.js';
import { SubCategoryService } from './sub-category.service.js';

@Module({
  controllers: [SubCategoryController],
  providers: [SubCategoryService]
})
export class SubCategoryModule {}
