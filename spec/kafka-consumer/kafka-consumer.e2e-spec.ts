import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Admin, Kafka } from 'kafkajs';
import { CustomKafkaRequestDeserializer, CustomServerKafka } from '../../src/custom-kafka';
import { MessageProducer, MessageProducerModule } from '../../src/message-producer';

import { sleep } from '../util';
import { TestController } from './test.controller';
import { TestProvider } from './test.provider';

describe('KafkaConsumer with CustomServerKafka and CustomKafkaRequestDeserializer', () => {
  const BROKER = 'localhost:9092';
  const TOPIC = 'queuing.testgroup.json';

  let kafkaAdmin: Admin;
  let app: INestApplication;
  let messageProducer: MessageProducer;
  let testProvider: TestProvider;

  beforeAll(async () => {
    const kafka = new Kafka({ clientId: 'jest-client', brokers: [BROKER] });
    kafkaAdmin = kafka.admin();
    await kafkaAdmin.connect();
    await kafkaAdmin.createTopics({ topics: [{ topic: TOPIC }], waitForLeaders: true });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MessageProducerModule],
      controllers: [TestController],
      providers: [TestProvider],
    })
      .setLogger(new Logger())
      .compile();

    messageProducer = moduleFixture.get<MessageProducer>(MessageProducer);
    testProvider = moduleFixture.get<TestProvider>(TestProvider);

    app = moduleFixture.createNestApplication();
    app.connectMicroservice({
      strategy: new CustomServerKafka({
        client: { brokers: [BROKER] },
        deserializer: new CustomKafkaRequestDeserializer(),
      }),
    });

    await app.startAllMicroservices();
  });

  afterAll(async () => {
    await app.close();
    await kafkaAdmin.deleteTopics({ topics: [TOPIC], timeout: 5000 });
    await kafkaAdmin.disconnect();
  });

  it('should trigger a method which has @EventPattern with according pattern', async () => {
    const testFunctionMock = jest.spyOn(testProvider, 'test').mockImplementationOnce(() => jest.fn());

    messageProducer.enqueue({
      eventGroup: 'testEventGroup',
      eventName: 'testEventName',
      payload: { text: 'Hello, World!' },
    });
    await sleep(2000);

    expect(testFunctionMock).toHaveBeenCalledTimes(1);
    expect(testFunctionMock).toHaveBeenCalledWith(expect.objectContaining({ text: 'Hello, World!' }));
  });
});
