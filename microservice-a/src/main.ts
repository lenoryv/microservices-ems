import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  //Transportador RabbitMQ
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'reports_queue',
      queueOptions: { durable: false },
      prefetchCount: 1,
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
  logger.log(`🚀 Service running on port ${configService.get('PORT')}`);
}
bootstrap();
