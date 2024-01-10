import { Message } from '../custom-kafka/type';

export interface ProduceParams<Payload> {
  eventGroup: string;
  eventName: string;
  payload: Payload;
  message: Message;
}
export type EnqueueParams<Payload> = Omit<ProduceParams<Payload>, 'message'>;
export type LogParams<Payload> = Omit<ProduceParams<Payload>, 'message'>;
