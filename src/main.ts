import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
<<<<<<< HEAD
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

=======
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
>>>>>>> 7b9df94 (ai-stylist-feature-completed)
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
