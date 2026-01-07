import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정: Next.js (4040 포트)에서 접근 허용
  app.enableCors({
    origin: ['http://localhost:4040'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4041);
  console.log(
    `🚀 NestJS Backend is running on: http://localhost:${process.env.PORT ?? 4041}`,
  );
}
bootstrap().catch((err) => {
  console.error('Failed to start NestJS application:', err);
  process.exit(1);
});
