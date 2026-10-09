import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AiModule } from './ai/ai.module.js';

@Module({
  imports: [PrismaModule, AiModule]
})
export class AppModule {}
