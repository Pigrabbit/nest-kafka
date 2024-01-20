import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { CustomServerKafka } from './custom-kafka';
import { CustomKafkaRequestDeserializer } from './custom-kafka/custom-kafka-request-deserializer';
import { MessageIdempotentChecker } from './idempotent/message-idempotent-checker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const messageIdempotentChecker = app.get<MessageIdempotentChecker>('MESSAGE_IDEMPOTENT_CHECKER');
  app.connectMicroservice<MicroserviceOptions>({
    strategy: new CustomServerKafka({
      client: { brokers: ['localhost:9092'], connectionTimeout: 5000, authenticationTimeout: 5000 },
      deserializer: new CustomKafkaRequestDeserializer(messageIdempotentChecker),
    }),
  });

  await app.startAllMicroservices();
}

bootstrap();
