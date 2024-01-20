import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbMessageIdempotentChecker } from './db-message-idempotent-checker';
import { MessageProcessHistoryEntity } from './message-process-history.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([MessageProcessHistoryEntity]),
  ],
  providers: [{ provide: 'MESSAGE_IDEMPOTENT_CHECKER', useClass: DbMessageIdempotentChecker }],
  exports: ['MESSAGE_IDEMPOTENT_CHECKER'],
})
export class MessageProcessHistoryModule {}
