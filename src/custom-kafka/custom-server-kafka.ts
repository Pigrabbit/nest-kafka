import { KafkaOptions, ServerKafka } from '@nestjs/microservices';
import { Consumer } from '@nestjs/microservices/external/kafka.interface';
import { CustomKafkaRequestDeserializer } from './custom-kafka-request-deserializer';
import { HandlerPatternTopicTransformer } from '../common';

export class CustomServerKafka extends ServerKafka {
  constructor(readonly options: KafkaOptions['options'] & { deserializer: CustomKafkaRequestDeserializer }) {
    super(options);
  }

  override async bindEvents(consumer: Consumer): Promise<void> {
    const registeredPatterns = [...this.messageHandlers.keys()];
    const consumerSubscribeOptions = this.options?.subscribe ?? {};

    const subscribePattern = (pattern: string) =>
      consumer.subscribe({
        topic: HandlerPatternTopicTransformer.toTopic(pattern),
        ...consumerSubscribeOptions,
      });
    await Promise.all(registeredPatterns.map(subscribePattern));

    const consumerRunOptions = Object.assign(this.options?.run ?? {}, {
      eachMessage: this.getMessageHandler(),
    });
    await consumer.run(consumerRunOptions);
  }
}
