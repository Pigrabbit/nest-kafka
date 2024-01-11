import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageIdempotentChecker } from '../message-idempotent-checker';
import { MessageProcessHistoryEntity } from './message-process-history.entity';

export class DbMessageIdempotentChecker implements MessageIdempotentChecker {
  constructor(
    @InjectRepository(MessageProcessHistoryEntity) private readonly repository: Repository<MessageProcessHistoryEntity>,
  ) {}

  async isDuplicate(id: string): Promise<boolean> {
    return this.repository.existsBy({ messageId: id });
  }

  async markAsProcessed(id: string): Promise<void> {
    await this.repository.save(this.repository.create({ messageId: id }));
  }
}
