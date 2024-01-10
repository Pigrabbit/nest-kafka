import { ConfigModule } from '@nestjs-library/config';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaClientConfig } from '../config';
import { kafkaClientInjectionToken } from './constant';
import { MessageProducer } from './message-producer';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          imports: [ConfigModule.forFeature([KafkaClientConfig])],
          useFactory: (kafkaClientConfig: KafkaClientConfig) => ({
            transport: Transport.KAFKA,
            options: { producerOnlyMode: true, client: kafkaClientConfig },
          }),
          inject: [KafkaClientConfig],
          name: kafkaClientInjectionToken,
        },
      ],
    }),
  ],
  providers: [MessageProducer],
  exports: [MessageProducer],
})
export class MessageProducerModule {}
