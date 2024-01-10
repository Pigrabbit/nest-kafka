import { Deserializer, IncomingEvent, IncomingRequest } from '@nestjs/microservices';
import { KafkaRequest } from '@nestjs/microservices/serializers';
import { HandlerPatternTopicTransformer } from '../common';
import { KafkaEvent } from './type';

export class CustomKafkaRequestDeserializer implements Deserializer {
  deserialize(data: KafkaRequest<KafkaEvent<unknown>>, options?: { channel: string }): IncomingRequest | IncomingEvent {
    if (!options) {
      return { pattern: undefined, data: undefined };
    }

    const kafkaEvent = Object.assign({}, data.value);
    const { dataName: eventGroup } = HandlerPatternTopicTransformer.parseTopic(options.channel);

    return {
      pattern: HandlerPatternTopicTransformer.createHandlerPatternFrom({ eventGroup, eventName: kafkaEvent.eventName }),
      data: kafkaEvent.payload,
    };
  }
}
