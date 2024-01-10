import { ClientKafka } from '@nestjs/microservices';
import { MessageProducer } from './message-producer';

describe('MessageProducer', () => {
  describe('enqueue', () => {
    it('should produce "messaging" event', () => {
      const mockClient = { emit: jest.fn() };
      const messageProducer = new MessageProducer(mockClient as unknown as ClientKafka);

      messageProducer.enqueue({ eventGroup: 'testGroup', eventName: 'testName', payload: { foo: 'bar' } });

      expect(mockClient.emit).toHaveBeenCalledWith('queuing.testgroup.json', {
        id: expect.any(String),
        eventName: 'testName',
        producedAt: expect.any(String),
        payload: { foo: 'bar' },
      });
    });
  });
});
