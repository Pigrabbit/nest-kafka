import { ConfigModule } from '@nestjs-library/config';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaClientConfig } from './config';

@Module({
  imports: [ConfigModule.forFeature([KafkaClientConfig])],
  providers: [AppService],
})
export class AppModule {}
