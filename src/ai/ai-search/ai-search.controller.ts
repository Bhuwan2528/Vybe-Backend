import { Controller, Post, Body } from '@nestjs/common';
import { AiSearchService } from './ai-search.service.js';

@Controller('ai/search')
export class AiSearchController {
  constructor(private readonly aiSearchService: AiSearchService) {}

  @Post()
  smartSearch(@Body('query') query: string) {
    return this.aiSearchService.smartSearch(query);
  }
}