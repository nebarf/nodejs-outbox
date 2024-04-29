import { Inject } from '@nestjs/common';
import dbConfig from './database.config';
import srvConfig from './server.config';
import { ConfigType } from '@nestjs/config';

export class ConfigService {
  constructor(
    @Inject(dbConfig.KEY)
    private readonly databaseConfig: ConfigType<typeof dbConfig>,

    @Inject(srvConfig.KEY)
    private readonly serverConfig: ConfigType<typeof srvConfig>,
  ) {}

  get database() {
    return this.databaseConfig;
  }

  get server() {
    return this.serverConfig;
  }
}
