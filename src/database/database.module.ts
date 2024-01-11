import { ConfigModule } from '@nestjs-library/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '../config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature([DatabaseConfig])],
      useFactory: (config: DatabaseConfig) => config,
      inject: [DatabaseConfig],
    }),
  ],
})
export class DatabaseModule {}
