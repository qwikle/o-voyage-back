import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  await app.listen(process.env.PORT || 3000, () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `Server running at http://localhost:${process.env.PORT || 3000}`,
      );
    }
  });
}
bootstrap();
