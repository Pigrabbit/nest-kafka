import { ConfigModule } from '@nestjs-library/config';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaClientConfig } from './config';
import { MessageProcessHistoryModule } from './idempotent/message-process-history';

@Module({
  imports: [ConfigModule.forFeature([KafkaClientConfig]), MessageProcessHistoryModule],
  providers: [AppService],
})
export class AppModule {}
