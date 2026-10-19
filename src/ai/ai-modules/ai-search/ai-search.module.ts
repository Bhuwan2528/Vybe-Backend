import { Module } from '@nestjs/common';
import { AiSearchController } from './ai-search.controller.js';
import { AiSearchService } from './ai-search.service.js';
import { GroqProviderModule } from '../../providers/groq-provider.module.js';
import { ProductModule } from '../../../catalog/product/product.module.js';

@Module({
  imports:[GroqProviderModule, ProductModule],
  controllers: [AiSearchController],
  providers: [AiSearchService]
})
export class AiSearchModule {}
