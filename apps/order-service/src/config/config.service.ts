import { Inject } from '@nestjs/common';
import dbConfig from './database.config';
import srvConfig from './server.config';
import evtConfig from './events.config';
import { ConfigType } from '@nestjs/config';

export class ConfigService {
  constructor(
    @Inject(dbConfig.KEY)
    private readonly databaseConfig: ConfigType<typeof dbConfig>,

    @Inject(srvConfig.KEY)
    private readonly serverConfig: ConfigType<typeof srvConfig>,

    @Inject(evtConfig.KEY)
    private readonly eventsConfig: ConfigType<typeof evtConfig>,
  ) {}

  get database() {
    return this.databaseConfig;
  }

  get server() {
    return this.serverConfig;
  }

  get events() {
    return this.eventsConfig;
  }
}
