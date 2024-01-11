import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../database/';
import { DbMessageIdempotentChecker } from './db-message-idempotent-checker';
import { MessageProcessHistoryEntity } from './message-process-history.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([MessageProcessHistoryEntity])],
  providers: [{ provide: 'MESSAGE_IDEMPOTENT_CHECKER', useClass: DbMessageIdempotentChecker }],
  exports: ['MESSAGE_IDEMPOTENT_CHECKER'],
})
export class MessageProcessHistoryModule {}
