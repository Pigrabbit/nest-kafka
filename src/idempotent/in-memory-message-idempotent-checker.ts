import { MessageIdempotentChecker } from './message-idempotent-checker';

export class InMemoryMessageIdempotentChecker implements MessageIdempotentChecker {
  private readonly processedMessages: Map<string, boolean> = new Map();

  isDuplicate(id: string) {
    return this.processedMessages.has(id);
  }

  markAsProcessed(id: string) {
    this.processedMessages.set(id, true);
  }
}
