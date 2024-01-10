import { INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomKafkaRequestDeserializer, CustomServerKafka } from '../../src/custom-kafka';
import { DuplicateMessageController, InMemoryMessageIdempotentChecker } from '../../src/idempotent';
import { MessageProducer, MessageProducerModule } from '../../src/message-producer';
import { setUpKafkaTopic, sleep } from '../util';
import { TestController } from './test.controller';
import { TestProvider } from './test.provider';

jest.setTimeout(20000);
describe('KafkaConsumer Idempotency', () => {
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

    const inMemoryIdempotentChecker = new InMemoryMessageIdempotentChecker();
    const consumerModule: TestingModule = await Test.createTestingModule({
      controllers: [DuplicateMessageController, TestController],
      providers: [TestProvider, { provide: 'MESSAGE_IDEMPOTENT_CHECKER', useValue: inMemoryIdempotentChecker }],
    })
      .setLogger(new Logger())
      .compile();
    testProvider = consumerModule.get<TestProvider>(TestProvider);

    consumerApp = consumerModule.createNestApplication();
    consumerApp.enableShutdownHooks();
    consumerApp.connectMicroservice({
      strategy: new CustomServerKafka({
        client: { brokers: [BROKER] },
        deserializer: new CustomKafkaRequestDeserializer(inMemoryIdempotentChecker),
        consumer: { groupId: 'nest-jest-group', heartbeatInterval: 2000, sessionTimeout: 6000 },
      }),
    });
    await consumerApp.startAllMicroservices();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await consumerApp.close();
    await tearDownKafkaTopic();
  });

  it('should prevent handling same message twice', async () => {
    const processEventSpy = jest
      .spyOn(testProvider, 'processEvent')
      .mockImplementation(async (payload: unknown) => Logger.log(`processEvent mock`));

    // kafkf consumer group will be rebalanced when idx equals 1
    for (let idx = 0; idx < 3; idx += 1) {
      messageProducer.enqueue({
        eventGroup: 'testEventGroup',
        eventName: 'testEventName',
        payload: { text: 'Hello, World!', seq: idx + 1 },
      });
    }
    await sleep(12000);

    expect(processEventSpy).toHaveBeenCalledTimes(3);
  });
});
