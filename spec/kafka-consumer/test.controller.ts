import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { TestProvider } from './test.provider';
import { HandlerPatternTopicTransformer } from '../../src/common';

@Controller()
export class TestController {
  constructor(private readonly testProvider: TestProvider) {}
  @EventPattern(
    HandlerPatternTopicTransformer.createHandlerPatternFrom({
      eventGroup: 'testEventGroup',
      eventName: 'testEventName',
    }),
  )
  handleEvent(@Payload() payload: unknown, @Ctx() context: KafkaContext) {
    this.testProvider.test(payload);
    Logger.log(payload);
    Logger.log(JSON.stringify(context.getMessage()));
  }
}
