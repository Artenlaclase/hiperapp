import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  console.log('Bootstrap complete, listening on port 3001...');
  await app.listen(3001);
  console.log('Backend listening on http://localhost:3001');
}

bootstrap().catch((error) => {
  console.error('Backend bootstrap failed:', error);
  process.exit(1);
});
