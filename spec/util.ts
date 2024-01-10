import { Kafka } from 'kafkajs';

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function setUpKafkaTopic(topic: string, broker: string): Promise<() => Promise<void>> {
  const kafka = new Kafka({ clientId: 'jest-client', brokers: [broker] });
  const kafkaAdmin = kafka.admin();
  await kafkaAdmin.connect();
  const topics = await kafkaAdmin.listTopics();
  if (!topics.includes(topic)) {
    await kafkaAdmin.createTopics({ topics: [{ topic }], waitForLeaders: true });
  }

  return async () => {
    await kafkaAdmin.deleteTopics({ topics: [topic], timeout: 5000 });
    await kafkaAdmin.disconnect();
  };
}
