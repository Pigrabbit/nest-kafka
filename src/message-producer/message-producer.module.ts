import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CLIENT_INJECTION_TOKEN } from './constant';
import { MessageProducer } from './message-producer';

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: () => ({
            transport: Transport.KAFKA,
            options: {
              producerOnlyMode: true,
              client: { brokers: ['localhost:9092'], connectionTimeout: 5000, authenticationTimeout: 5000 },
            },
          }),
          name: KAFKA_CLIENT_INJECTION_TOKEN,
        },
      ],
    }),
  ],
  providers: [MessageProducer],
  exports: [MessageProducer],
})
export class MessageProducerModule {}
