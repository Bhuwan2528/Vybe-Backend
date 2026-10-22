import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module.js';
import { SubCategoryModule } from './sub-category/sub-category.module.js';
import { ProductService } from './product/product.service.js';
import { ProductModule } from './product/product.module.js';

@Module({
  imports: [CategoryModule, SubCategoryModule, ProductModule],
  providers: [ProductService]
})
export class CatalogModule {}
