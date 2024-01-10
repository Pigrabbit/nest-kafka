import { HandlerPatternTopicTransformer } from './pattern-topic-transformer';
import { DataFormat, Message } from '../custom-kafka/type';

describe('HandlerPatternTopicTransformer', () => {
  describe('handlerPatternToTopic', () => {
    it('should convert handlerPattern to kafka topic', () => {
      const handlerPattern: `${Message}__${string}__${string}__${DataFormat}` =
        'queuing__TestEventGroup__TestEventName__json';
      const kafkaTopic = HandlerPatternTopicTransformer.handlerPatternToTopic(handlerPattern);
      expect(kafkaTopic).toBe('queuing.testeventgroup.json');
    });
  });

  describe('getHandlerPattern', () => {
    it('should create handlerPattern based on eventGroup and eventName', () => {
      const handlerPattern = HandlerPatternTopicTransformer.createHandlerPatternFrom({
        eventGroup: 'TestEventGroup',
        eventName: 'TestEventName',
      });
      expect(handlerPattern).toBe('queuing__testeventgroup__testeventname__json');
    });
  });

  describe('parseTopic', () => {
    it('should parse kafka topic', () => {
      const kafkaTopic = 'queuing.testeventgroup.json';
      const parsed = HandlerPatternTopicTransformer.parseTopic(kafkaTopic);
      expect(parsed).toEqual(
        expect.objectContaining({
          message: 'queuing',
          dataName: 'testeventgroup',
          dataFormat: 'json',
        }),
      );
    });
  });
});
