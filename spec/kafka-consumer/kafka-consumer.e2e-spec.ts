import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomKafkaRequestDeserializer, CustomServerKafka } from '../../src/custom-kafka';
import { InMemoryMessageIdempotentChecker } from '../../src/idempotent';
import { MessageProducer, MessageProducerModule } from '../../src/message-producer';
import { setUpKafkaTopic, sleep } from '../util';
import { TestController } from './test.controller';
import { TestProvider } from './test.provider';

describe('KafkaConsumer with CustomServerKafka and CustomKafkaRequestDeserializer', () => {
  const BROKER = 'localhost:9092';
  const TOPIC = 'queuing.testeventgroup.json';

  let consumerApp: INestApplication;
  let messageProducer: MessageProducer;
  let testProvider: TestProvider;
  let tearDownKafkaTopic: () => Promise<void>;

  beforeAll(async () => {
    tearDownKafkaTopic = await setUpKafkaTopic(TOPIC, BROKER);

    const producerModule: TestingModule = await Test.createTestingModule({
      imports: [MessageProducerModule],
    }).compile();
    messageProducer = producerModule.get<MessageProducer>(MessageProducer);

    const consumerModule: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [TestProvider],
    })
      .setLogger(new Logger())
      .compile();

    testProvider = consumerModule.get<TestProvider>(TestProvider);
    consumerApp = consumerModule.createNestApplication();
    consumerApp.enableShutdownHooks();
    consumerApp.connectMicroservice({
      strategy: new CustomServerKafka({
        client: { brokers: [BROKER] },
        deserializer: new CustomKafkaRequestDeserializer(new InMemoryMessageIdempotentChecker()),
      }),
    });
    await consumerApp.startAllMicroservices();
  });

  afterAll(async () => {
    await consumerApp.close();
    await tearDownKafkaTopic();
  });

  it('should trigger a method which has @EventPattern with according pattern', async () => {
    const testFunctionMock = jest.spyOn(testProvider, 'test').mockImplementationOnce(() => jest.fn());

    messageProducer.enqueue({
      eventGroup: 'testEventGroup',
      eventName: 'testEventName',
      payload: { text: 'Hello, World!' },
    });
    await sleep(1000);

    expect(testFunctionMock).toHaveBeenCalledTimes(1);
    expect(testFunctionMock).toHaveBeenCalledWith(expect.objectContaining({ text: 'Hello, World!' }));
  });
});
