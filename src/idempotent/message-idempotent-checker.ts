export interface MessageIdempotentChecker {
  isDuplicate(id: string): boolean | Promise<boolean>;
  markAsProcessed(id: string): void | Promise<void>;
}
