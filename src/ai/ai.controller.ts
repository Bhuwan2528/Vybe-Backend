import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service.js';

@Controller('ai')
export class AiController {

    constructor(private aiService: AiService){}

    @Post('search')
    searchQuery(
        @Body('query') query: string
    ){
        return this.aiService.smartSearch(query)
    }
}
