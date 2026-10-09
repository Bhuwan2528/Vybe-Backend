import { Module } from '@nestjs/common';
import { AiSearchModule } from './ai-search/ai-search.module.js';
import { GroqProvider } from './providers/groq.provider.js';
import { GroqProviderModule } from './providers/groq-provider.module.js';

@Module({
  providers: [GroqProvider],
  controllers: [],
  imports: [AiSearchModule, GroqProviderModule]
})
export class AiModule {}
