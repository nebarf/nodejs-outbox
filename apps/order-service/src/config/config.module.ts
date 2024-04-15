import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import serverConfig from './server.config';
import eventsConfig from './events.config';
import { ConfigService } from './config.service';

@Module({
  imports: [
    BaseConfigModule.forRoot({
      ignoreEnvFile: true,
      cache: true,
      load: [databaseConfig, serverConfig, eventsConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
