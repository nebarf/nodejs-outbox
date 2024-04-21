import { HealthModule } from '@libs/health';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigService } from './config/config.service';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { EventsModule } from './event/events.module';

const logger = new Logger('Database');

@Module({
  imports: [
    HealthModule,
    ConfigModule,
    EventsModule,
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        entities: ['./dist/apps/shipment-service/src/model'],
        entitiesTs: ['./src/model'],
        forceUtcTimezone: true,
        driver: PostgreSqlDriver,
        host: config.database.host,
        dbName: config.database.name,
        schema: config.database.schema,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        debug: config.database.debug,
        logger: logger.log.bind(logger),
        highlighter: new SqlHighlighter(),
      }),
    }),
  ],
})
export class MainModule {}
