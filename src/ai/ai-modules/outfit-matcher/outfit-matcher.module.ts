import { Module } from '@nestjs/common';
import { OutfitMatcherController } from './outfit-matcher.controller.js';
import { OutfitMatcherService } from './outfit-matcher.service.js';

@Module({
  controllers: [OutfitMatcherController],
  providers: [OutfitMatcherService]
})
export class OutfitMatcherModule {}
