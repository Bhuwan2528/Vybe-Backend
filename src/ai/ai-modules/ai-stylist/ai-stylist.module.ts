import { Module } from '@nestjs/common';
import { AiStylistController } from './ai-stylist.controller.js';
import { AiStylistService } from './ai-stylist.service.js';
import { GroqProviderModule } from '../../providers/groq-provider.module.js';
import { ProductModule } from '../../../catalog/product/product.module.js';

@Module({
  imports: [GroqProviderModule, ProductModule],
  controllers: [AiStylistController],
  providers: [AiStylistService]
})
export class AiStylistModule {}
