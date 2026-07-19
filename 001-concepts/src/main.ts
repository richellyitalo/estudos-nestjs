import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { IsAdminGuard } from './common/guards/is-admin.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
    }),
  );
  // app.useGlobalFilters(new BadRequestExceptionFilter());
  app.useGlobalGuards(new IsAdminGuard());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
