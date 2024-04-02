import { Logger, Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const logger = new Logger('Database');

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['./dist/model'],
      entitiesTs: ['./src/model'],
      forceUtcTimezone: true,
      driver: PostgreSqlDriver,
      host: process.env.DB_HOST,
      dbName: process.env.DB_NAME,
      schema: process.env.DB_SCHEMA,
      port: +process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      logger: logger.log.bind(logger),
      highlighter: new SqlHighlighter(),
    }),
  ],
  controllers: [HealthController],
  providers: [],
})
export class MainModule {}
