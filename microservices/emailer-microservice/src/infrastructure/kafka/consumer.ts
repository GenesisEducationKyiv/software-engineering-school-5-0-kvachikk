import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from 'kafkajs';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
   private readonly kafka = new Kafka({
      brokers: [process.env.KAFKA_URL || 'localhost:9092'],
   });
   private readonly consumers: Consumer[] = [];

   async consume(topic: ConsumerSubscribeTopics, config: ConsumerRunConfig): Promise<void> {
      const consumer = this.kafka.consumer({ groupId: 'nestjs-kafka' });
      await consumer.connect();
      await consumer.subscribe(topic);
      await consumer.run(config);

      this.consumers.push(consumer);
   }

   async onApplicationShutdown(signal?: string): Promise<void> {
      for (const consumer of this.consumers) {
         await consumer.disconnect();
      }
   }
}
