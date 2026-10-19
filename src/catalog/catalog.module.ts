import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { CategoriesModule } from './categories/categories.module.js';
import { SubCategoriesModule } from './sub-categories/sub-categories.module.js';
import { ProductsModule } from './products/products.module.js';
import { ProductVariantModule } from './product-variant/product-variant.module.js';

@Module({
  imports: [CategoriesModule, SubCategoriesModule, ProductsModule, ProductVariantModule]
=======
import { CategoryModule } from './category/category.module.js';
import { SubCategoryModule } from './sub-category/sub-category.module.js';
import { ProductService } from './product/product.service.js';
import { ProductModule } from './product/product.module.js';

@Module({
  imports: [CategoryModule, SubCategoryModule, ProductModule],
  providers: [ProductService]
>>>>>>> 7b9df94 (ai-stylist-feature-completed)
})
export class CatalogModule {}
