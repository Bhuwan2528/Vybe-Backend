import { Module } from '@nestjs/common';
import { ProductVariantController } from './product-variant.controller.js';
import { ProductVariantService } from './product-variant.service.js';

@Module({
  controllers: [ProductVariantController],
  providers: [ProductVariantService]
})
export class ProductVariantModule {}
