import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { KafkaClientConfig } from './config';
import { CustomServerKafka } from './custom-kafka';
import { CustomKafkaRequestDeserializer } from './custom-kafka/custom-kafka-request-deserializer';
import { MessageIdempotentChecker } from './idempotent/message-idempotent-checker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const kafkaClientConfig = app.get<KafkaClientConfig>(KafkaClientConfig);
  const messageIdempotentChecker = app.get<MessageIdempotentChecker>('MESSAGE_IDEMPOTENT_CHECKER');
  app.connectMicroservice<MicroserviceOptions>({
    strategy: new CustomServerKafka({
      client: kafkaClientConfig,
      deserializer: new CustomKafkaRequestDeserializer(messageIdempotentChecker),
    }),
  });

  await app.startAllMicroservices();
}

bootstrap();
