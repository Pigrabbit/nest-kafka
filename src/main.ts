import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { KafkaClientConfig } from './config';
import { CustomServerKafka } from './custom-kafka';
import { CustomKafkaRequestDeserializer } from './custom-kafka/custom-kafka-request-deserializer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const kafkaClientConfig = app.get<KafkaClientConfig>(KafkaClientConfig);
  app.connectMicroservice<MicroserviceOptions>({
    strategy: new CustomServerKafka({ client: kafkaClientConfig, deserializer: new CustomKafkaRequestDeserializer() }),
  });

  await app.startAllMicroservices();
}

bootstrap();
