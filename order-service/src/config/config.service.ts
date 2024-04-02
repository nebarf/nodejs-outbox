import { Inject } from '@nestjs/common';
import dbConfig from './database.config';
import { ConfigType } from '@nestjs/config';

export class ConfigService {
  constructor(
    @Inject(dbConfig.KEY)
    private readonly databaseConfig: ConfigType<typeof dbConfig>,
  ) {}

  get database() {
    return this.databaseConfig;
  }
}
