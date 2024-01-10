import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';
import { sleep } from '../util';

import { HandlerPatternTopicTransformer } from '../../src/common';
import { IdempotentInterceptor } from '../../src/idempotent';
import { TestProvider } from './test.provider';

@Controller()
export class TestController {
  private counter = 0;

  constructor(private readonly testProvider: TestProvider) {}

  @EventPattern(
    HandlerPatternTopicTransformer.createHandlerPatternFrom({
      eventGroup: 'testEventGroup',
      eventName: 'testEventName',
    }),
  )
  @UseInterceptors(IdempotentInterceptor)
  async handleEventAndTriggerRebalance(@Payload() payload: unknown, @Ctx() context: KafkaContext) {
    Logger.debug(`counter=${++this.counter}`);
    // trigger consumer group rebalance when counter is multiple of 2
    await sleep(this.counter % 2 === 0 ? 9000 : 0);
    await this.testProvider.processEvent(payload);
  }
}
