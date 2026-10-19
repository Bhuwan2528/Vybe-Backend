import { Module } from '@nestjs/common';
import { GroqProvider } from './providers/groq.provider.js';
import { GroqProviderModule } from './providers/groq-provider.module.js';
import { AiStylistModule } from './ai-modules/ai-stylist/ai-stylist.module.js';
import { AiSearchModule } from './ai-modules/ai-search/ai-search.module.js';
import { OutfitMatcherModule } from './ai-modules/outfit-matcher/outfit-matcher.module.js';

@Module({
  providers: [GroqProvider],
  controllers: [],
  imports: [AiSearchModule, GroqProviderModule, AiStylistModule, OutfitMatcherModule]
})
export class AiModule {}
