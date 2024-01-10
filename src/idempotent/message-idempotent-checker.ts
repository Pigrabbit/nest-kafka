export interface MessageIdempotentChecker {
  isDuplicate(id: string): boolean;
  markAsProcessed(id: string): void | Promise<void>;
}
