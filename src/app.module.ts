import { ConfigModule } from '@nestjs-library/config';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaClientConfig } from './config';
import { InMemoryMessageIdempotentChecker } from './idempotent';

@Module({
  imports: [ConfigModule.forFeature([KafkaClientConfig])],
  providers: [AppService, { provide: 'MESSAGE_IDEMPOTENT_CHECKER', useClass: InMemoryMessageIdempotentChecker }],
})
export class AppModule {}
