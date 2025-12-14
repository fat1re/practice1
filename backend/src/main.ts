import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Mebel')
    .setDescription(
      'REST API для управления мебелью, цехами производства и материалами',
    )
    .setVersion('1.0.0')
    .addTag('products', 'Управление продуктами')
    .addTag('product-types', 'Управление типами продуктов')
    .addTag('materials', 'Управление материалами')
    .addTag('workshops', 'Управление цехами')
    .addTag('product-workshops', 'Управление производством')
    .addTag('raw-materials', 'Расчет сырья')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
    http://localhost:${port}
    Swagger:   http://localhost:${port}/api/docs
    Environment: ${process.env.NODE_ENV || 'development'}
  `);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
