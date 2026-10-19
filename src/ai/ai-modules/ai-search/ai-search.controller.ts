import { Controller, Post, Body } from '@nestjs/common';
import { AiSearchService } from './ai-search.service.js';
import { ProductColor, ProductStyle } from '@prisma/client';
import { AiToProductQueryConversion } from '../../utility/query-conversion.js';
import { ProductService } from '../../../catalog/product/product.service.js';

@Controller('ai/search')
export class AiSearchController {
  constructor(
    private readonly aiSearchService: AiSearchService,
    private readonly productService: ProductService
  ) {}


  @Post()
  async smartSearch(@Body('query') query: string) {
    
    const filters = await this.aiSearchService.smartSearch(query);
    const productQuery = AiToProductQueryConversion(filters)

    return this.productService.getAll(productQuery);
  }


}