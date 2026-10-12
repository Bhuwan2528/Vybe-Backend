import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AiModule } from './ai/ai.module.js';
import { CatalogModule } from './catalog/catalog.module.js';

@Module({
  imports: [PrismaModule, AiModule, CatalogModule]
})
export class AppModule {}
