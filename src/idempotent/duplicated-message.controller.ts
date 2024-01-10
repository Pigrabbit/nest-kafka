import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, KafkaContext } from '@nestjs/microservices';

@Controller()
export class DuplicateMessageController {
  @EventPattern('duplicated')
  async handleDuplicatedEvent(@Payload() payload: unknown, @Ctx() context: KafkaContext) {
    Logger.warn('Duplicated event');
  }
}
