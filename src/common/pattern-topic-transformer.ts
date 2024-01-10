import { DataFormat, Message } from '../custom-kafka/type';

export class HandlerPatternTopicTransformer {
  private static readonly PATTERN_DIVIDER = '__';
  private static readonly TOPIC_DIVIDER = '.';

  /**
   *
   * @usgage ServerKafka에서 사용
   * @param handlerPattern
   * @example Message__EventGroup__EventName__DataFormat
   * @returns kafkaTopic
   * @example Message.DataName.DataFormat
   */
  static handlerPatternToTopic(pattern: string): string {
    const [message, eventGroup, , dataFormat] = pattern
      .split(HandlerPatternTopicTransformer.PATTERN_DIVIDER)
      .map((str) => str.toLowerCase());
    return [message, eventGroup, dataFormat].join(HandlerPatternTopicTransformer.TOPIC_DIVIDER);
  }

  static createTopicFrom({
    message,
    dataName,
    dataFormat,
  }: {
    message: Message;
    dataName: string;
    dataFormat: DataFormat;
  }): string {
    return [message, dataName.toLocaleLowerCase(), dataFormat].join(HandlerPatternTopicTransformer.TOPIC_DIVIDER);
  }

  /**
   * @usage @EventHandler() 데코레이터에서 사용
   */
  static createHandlerPatternFrom({
    eventGroup,
    eventName,
    message = 'queuing',
    dataFormat = 'json',
  }: {
    eventGroup: string;
    eventName: string;
    message?: Message;
    dataFormat?: DataFormat;
  }): string {
    return [message, eventGroup.toLowerCase(), eventName.toLowerCase(), dataFormat].join(
      HandlerPatternTopicTransformer.PATTERN_DIVIDER,
    );
  }

  static parseTopic(topic: string): {
    dataName: string;
    dataFormat: DataFormat;
    message: Message;
  } {
    const [message, dataName, dataFormat] = topic.split(HandlerPatternTopicTransformer.TOPIC_DIVIDER);
    return {
      message: message as Message,
      dataName,
      dataFormat: dataFormat as DataFormat,
    };
  }
}
