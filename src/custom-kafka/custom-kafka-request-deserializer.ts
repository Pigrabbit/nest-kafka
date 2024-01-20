import { Logger } from '@nestjs/common';
import { Deserializer, IncomingEvent, IncomingRequest } from '@nestjs/microservices';
import { KafkaRequest } from '@nestjs/microservices/serializers';
import { MessageIdempotentChecker } from 'src/idempotent/message-idempotent-checker';
import { HandlerPatternTopicTransformer } from '../common';
import { KafkaEvent } from './type';

export class CustomKafkaRequestDeserializer implements Deserializer {
  constructor(
    private readonly messageIdempotentChecker: MessageIdempotentChecker,
    private readonly duplicatedPattern = 'duplicated',
  ) {}

  async deserialize(
    data: KafkaRequest<KafkaEvent<unknown>>,
    options?: { channel: string },
  ): Promise<IncomingRequest | IncomingEvent> {
    if (!options) {
      return { pattern: undefined, data: undefined };
    }

    const kafkaEvent = Object.assign({}, data.value);
    const { dataName: eventGroup } = HandlerPatternTopicTransformer.parseTopic(options.channel);

    if (await this.messageIdempotentChecker.isDuplicate(kafkaEvent.id)) {
      Logger.warn(`Duplicated event id=${kafkaEvent.id}`);
      return { pattern: this.duplicatedPattern, data: undefined };
    }

    return {
      pattern: HandlerPatternTopicTransformer.createHandlerPatternFrom({ eventGroup, eventName: kafkaEvent.eventName }),
      data: kafkaEvent.payload,
    };
  }
}
