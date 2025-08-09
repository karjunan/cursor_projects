import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for cross-origin requests
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  // Set global prefix for API routes
  app.setGlobalPrefix('api');
  
  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 WebSocket Client API is running on: http://localhost:${process.env.PORT ?? 3001}`);
  console.log(`🔌 Connecting to WebSocket server at: http://localhost:3000`);
}
bootstrap();
