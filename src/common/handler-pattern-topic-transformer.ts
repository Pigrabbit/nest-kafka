import { DataFormat, Message } from '../custom-kafka/type';

export class HandlerPatternTopicTransformer {
  private static readonly PATTERN_DIVIDER = '__';
  private static readonly TOPIC_DIVIDER = '.';

  static toTopic(handlerPattern: string): string {
    const [message, eventGroup, , dataFormat] = handlerPattern
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
