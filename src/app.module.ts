import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { AiModule } from './ai/ai.module.js';
import { CatalogModule } from './catalog/catalog.module.js';
<<<<<<< HEAD

@Module({
  imports: [PrismaModule, AiModule, CatalogModule]
=======
import { CommonModule } from './common/common.module.js';
import { CategoryModule } from './catalog/category/category.module.js';

@Module({
  imports: [PrismaModule, AiModule, CatalogModule, CategoryModule, CommonModule, ]
>>>>>>> 7b9df94 (ai-stylist-feature-completed)
})
export class AppModule {}
