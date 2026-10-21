import { Module } from '@nestjs/common';
import { OutfitMatcherController } from './outfit-matcher.controller.js';
import { OutfitMatcherService } from './outfit-matcher.service.js';
import { ProductModule } from '../../../catalog/product/product.module.js';

@Module({
  controllers: [OutfitMatcherController],
  providers: [OutfitMatcherService],
  imports: [ProductModule]
})
export class OutfitMatcherModule {}
