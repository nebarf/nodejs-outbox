import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import {
  IsBooleanString,
  IsNumberString,
  IsString,
  validateSync,
} from 'class-validator';

class DatabaseConfig {
  @IsString()
  DB_NAME: string;

  @IsString()
  DB_SCHEMA: string;

  @IsString()
  DB_HOST: string;

  @IsNumberString()
  DB_PORT: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsBooleanString()
  DB_DEBUG: string;
}

export default registerAs('database', () => {
  const instance = plainToInstance(DatabaseConfig, process.env);
  const validationErrors = validateSync(instance);

  if (validationErrors.length > 0) {
    throw new Error(validationErrors.toString());
  }

  return {
    name: instance.DB_NAME,
    schema: instance.DB_SCHEMA,
    host: instance.DB_HOST,
    port: +instance.DB_PORT,
    user: instance.DB_USER,
    password: instance.DB_PASSWORD,
    debug: instance.DB_DEBUG === 'true',
  };
});
