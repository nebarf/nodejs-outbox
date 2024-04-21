import { Inject } from '@nestjs/common';
import dbConfig from './database.config';
import srvConfig from './server.config';
import rabbitConfig from './rabbitmq.config';
import { ConfigType } from '@nestjs/config';

export class ConfigService {
  constructor(
    @Inject(dbConfig.KEY)
    private readonly databaseConfig: ConfigType<typeof dbConfig>,

    @Inject(srvConfig.KEY)
    private readonly serverConfig: ConfigType<typeof srvConfig>,

    @Inject(rabbitConfig.KEY)
    private readonly rabbitMQConfig: ConfigType<typeof rabbitConfig>,
  ) {}

  get database() {
    return this.databaseConfig;
  }

  get server() {
    return this.serverConfig;
  }

  get rabbit() {
    return this.rabbitMQConfig;
  }
}
