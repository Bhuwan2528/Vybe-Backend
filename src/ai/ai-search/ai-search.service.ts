import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GroqProvider } from '../providers/groq.provider.js';
import Groq from 'groq-sdk';
import { AI_FILTERS_OUTPUT_SCHEMA, AiFiltersOutputDto } from '../schema/ai-filters-output.schema.js';
import { AI_SMART_SEARCH_PROMPT } from './prompts/ai-smart-search.prompt.js';

@Injectable()
export class AiSearchService {

    private readonly ai: Groq;

    constructor(private groqProvider: GroqProvider){
        this.ai = groqProvider.ai
    }

  async smartSearch(query: string): Promise<AiFiltersOutputDto> {

    const normalizedQuery = query.trim();

    const response = await this.ai.chat.completions.create({

      model: 'openai/gpt-oss-120b',
      reasoning_effort: 'medium',

      messages: [
        {
          role: 'system',
          content: AI_SMART_SEARCH_PROMPT
        },
        {
          role: 'user',
          content: normalizedQuery,
        },
      ],

      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'vybe_product_search_filters',
          strict: true,

          schema: AI_FILTERS_OUTPUT_SCHEMA
        },
      },
    });


    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new InternalServerErrorException(
        'AI returned an empty response',
      );
    }

    try {
      return JSON.parse(content) as AiFiltersOutputDto;
    } catch {
      throw new InternalServerErrorException(
        'AI returned invalid JSON',
      );
    }
  }
}
