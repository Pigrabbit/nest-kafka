export interface KafkaEvent<T extends Array<Record<keyof T, unknown>> | Record<keyof T, unknown>> {
  id: string;
  eventName: string;
  producedAt: string;
  payload: T;
}

export function isKafkaEvent<T>(event: unknown): event is KafkaEvent<T> {
  return (
    typeof event === 'object' && event !== null && 'eventName' in event && 'producedAt' in event && 'payload' in event
  );
}

export type Message = 'logging' | 'queuing' | 'streaming' | 'push' | 'user';
export type DataFormat = 'text' | 'json' | 'avro' | 'protobuf' | 'thrift';
