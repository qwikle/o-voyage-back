import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: '*' },
  });
  app.set('trust proxy', 1);
  await app.listen(process.env.PORT || 3000, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `Server running at http://localhost:${process.env.PORT || 3000}`,
      );
    }
  });
}
bootstrap();
