import { Logger, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './event/events.module';
import { RestModule } from './rest/rest.module';
import { HealthModule } from '@libs/health';

const logger = new Logger('Database');

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    EventsModule,
    HealthModule,
    RestModule,
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        entities: ['./dist/apps/order-service/src/model'],
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
