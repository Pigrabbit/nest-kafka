import { Test, TestingModule } from '@nestjs/testing';
import { Admin, Kafka } from 'kafkajs';
import { MessageProducer, MessageProducerModule } from '../src/message-producer';
import { sleep } from './util';

describe('MessageProducer', () => {
  const BROKER = 'localhost:9092';
  const TOPIC = 'queuing.testgroup.json';

  let module: TestingModule;
  let kafkaAdmin: Admin;
  let messageProducer: MessageProducer;

  beforeAll(async () => {
    const kafka = new Kafka({ clientId: 'jest-client', brokers: [BROKER] });
    kafkaAdmin = kafka.admin();
    await kafkaAdmin.connect();
    await kafkaAdmin.createTopics({ topics: [{ topic: TOPIC }], waitForLeaders: true });

    module = await Test.createTestingModule({ imports: [MessageProducerModule] }).compile();
    await module.init();

    messageProducer = module.get<MessageProducer>(MessageProducer);
  });

  afterAll(async () => {
    await module.close();
    await kafkaAdmin.deleteTopics({ topics: [TOPIC], timeout: 5000 });
    await kafkaAdmin.disconnect();
  });

  describe('enqueue', () => {
    it('should produce "messaging" event', async () => {
      messageProducer.enqueue({ eventGroup: 'testGroup', eventName: 'testName', payload: { foo: 'bar' } });
      await sleep(1000);

      await expect(kafkaAdmin.fetchTopicOffsets('queuing.testgroup.json')).resolves.toEqual(
        expect.arrayContaining([expect.objectContaining({ offset: '1' })]),
      );
    });
  });
});
