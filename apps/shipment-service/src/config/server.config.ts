import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsNumberString, validateSync } from 'class-validator';

class ServerConfig {
  @IsNumberString()
  SERVER_PORT: string;
}

export default registerAs('server', () => {
  const instance = plainToInstance(ServerConfig, process.env);
  const validationErrors = validateSync(instance);

  if (validationErrors.length > 0) {
    throw new Error(validationErrors.toString());
  }

  return {
    port: +instance.SERVER_PORT,
  };
});
