import { AbstractConfigService, OptionalBoolean } from '@nestjs-library/config';
import { Expose, Transform, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsPositive, IsBoolean, IsOptional } from 'class-validator';

import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

export class DatabaseConfig extends AbstractConfigService<DatabaseConfig> implements SqliteConnectionOptions {
  @Expose({ name: 'DATABASE_TYPE' })
  @Transform(({ value }) => value ?? 'sqlite')
  @IsString()
  @IsNotEmpty()
  type: SqliteConnectionOptions['type'];

  @Expose({ name: 'DATABASE_NAME' })
  @Transform(({ value }) => value ?? ':memory:')
  @IsString()
  @IsNotEmpty()
  database: string;

  @Expose({ name: 'DATABASE_HOST' })
  @IsString()
  @IsOptional()
  host?: string;

  @Expose({ name: 'DATABASE_PORT' })
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  port?: number;

  @Expose({ name: 'DATABASE_USERNAME' })
  @IsString()
  @IsOptional()
  username?: string;

  @Expose({ name: 'DATABASE_PASSWORD' })
  @IsString()
  @IsOptional()
  password?: string;

  @Expose({ name: 'DATABASE_AUTO_LOAD_ENTITIES' })
  @Transform(({ value }) => OptionalBoolean(value) ?? true)
  @IsBoolean()
  @IsNotEmpty()
  autoLoadEntities: boolean;

  @Expose({ name: 'DATABASE_SYNCHRONIZE' })
  @Transform(({ value }) => OptionalBoolean(value) ?? true)
  @IsBoolean()
  @IsNotEmpty()
  synchronize: boolean;
}
