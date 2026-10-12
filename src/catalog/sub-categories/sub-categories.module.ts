import { Module } from '@nestjs/common';
import { SubCategoriesController } from './sub-categories.controller.js';
import { SubCategoriesService } from './sub-categories.service.js';

@Module({
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService]
})
export class SubCategoriesModule {}
