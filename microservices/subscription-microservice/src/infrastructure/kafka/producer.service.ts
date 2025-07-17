import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
   private readonly kafka = new Kafka({ brokers: [process.env.KAFKA_URL || 'localhost:9092'] });
   private readonly producer: Producer = this.kafka.producer();

   async onModuleInit(): Promise<void> {
      await this.producer.connect();
   }

   async produce(record: ProducerRecord) {
      await this.producer.send(record);
   }

   async onApplicationShutdown(signal?: string): Promise<void> {
      await this.producer.disconnect();
   }
}
