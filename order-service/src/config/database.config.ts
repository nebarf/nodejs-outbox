import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  name: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}));
