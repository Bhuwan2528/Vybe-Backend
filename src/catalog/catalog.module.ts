import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module.js';
import { SubCategoriesModule } from './sub-categories/sub-categories.module.js';
import { ProductsModule } from './products/products.module.js';
import { ProductVariantModule } from './product-variant/product-variant.module.js';

@Module({
  imports: [CategoriesModule, SubCategoriesModule, ProductsModule, ProductVariantModule]
})
export class CatalogModule {}
