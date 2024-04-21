import { Module } from '@nestjs/common';
import { ConfigModule as BaseConfigModule } from '@nestjs/config';
import databaseConfig from './database.config';
import serverConfig from './server.config';
import rabbitMQConfig from './rabbitmq.config';
import { ConfigService } from './config.service';

@Module({
  imports: [
    BaseConfigModule.forRoot({
      ignoreEnvFile: true,
      cache: true,
      load: [databaseConfig, serverConfig, rabbitMQConfig],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
