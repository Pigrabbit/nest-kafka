import { Module } from '@nestjs/common';
import { MessageProcessHistoryModule } from './idempotent/message-process-history';

@Module({ imports: [MessageProcessHistoryModule] })
export class AppModule {}
