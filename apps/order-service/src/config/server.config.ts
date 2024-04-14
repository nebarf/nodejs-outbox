import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  port: process.env.SERVER_PORT ? +process.env.SERVER_PORT : 3000,
}));
