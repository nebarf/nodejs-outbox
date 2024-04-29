import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import serverConfig from './server.config';
import { ConfigService } from './config.service';

@Module({
  imports: [
    BaseConfigModule.forRoot({
      ignoreEnvFile: true,
      cache: true,
      load: [databaseConfig, serverConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
