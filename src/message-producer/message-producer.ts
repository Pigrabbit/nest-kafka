import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { v4 } from 'uuid';
import { HandlerPatternTopicTransformer } from '../common';
import { KafkaEvent } from '../custom-kafka/type';
import { KAFKA_CLIENT_INJECTION_TOKEN } from './constant';
import { EnqueueParams, LogParams, ProduceParams } from './type';

export class MessageProducer {
  constructor(@Inject(KAFKA_CLIENT_INJECTION_TOKEN) private readonly client: ClientKafka) {}

  enqueue<Payload>(params: EnqueueParams<Payload>) {
    const { eventGroup, eventName, payload } = params;
    this.produce<Payload>({ eventGroup, eventName, payload, message: 'queuing' });
  }

  log<Payload>(params: LogParams<Payload>) {
    const { eventGroup, eventName, payload } = params;
    this.produce<Payload>({ eventGroup, eventName, payload, message: 'logging' });
  }

  private produce<Payload>({ eventGroup, eventName, payload, message }: ProduceParams<Payload>) {
    const topic = HandlerPatternTopicTransformer.createTopicFrom({ message, dataName: eventGroup, dataFormat: 'json' });
    const event: KafkaEvent<Payload> = { id: v4(), eventName, producedAt: new Date().toISOString(), payload };

    this.client.emit(topic, event);
  }
}
