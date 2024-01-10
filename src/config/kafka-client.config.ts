import { KafkaConfig } from '@nestjs/microservices/external/kafka.interface';
import { AbstractConfigService } from '@nestjs-library/config';
import { Expose, Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsNotEmpty, IsPositive } from 'class-validator';

export class KafkaClientConfig extends AbstractConfigService<KafkaClientConfig> implements KafkaConfig {
  @Expose({ name: 'KAFKA_CLIENT_BROKERS' })
  @Transform(({ value }) => value?.split(',') ?? ['localhost:9092'])
  @IsString({ each: true })
  @IsNotEmpty()
  brokers: string[];

  @Expose({ name: 'KAFKA_CLIENT_ID' })
  @IsString()
  @IsOptional()
  clientId?: string;

  @Expose({ name: 'KAFKA_CLIENT_CONNECTION_TIMEOUT' })
  @Transform(({ value }) => value ?? 5000)
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  connectionTimeout?: number;

  @Expose({ name: 'KAFKA_CLIENT_AUTHENTICATION_TIMEOUT' })
  @Transform(({ value }) => value ?? 5000)
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  authenticationTimeout?: number;
}
