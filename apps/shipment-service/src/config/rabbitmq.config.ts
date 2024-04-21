import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsNumberString, IsString, validateSync } from 'class-validator';

class RabbitMQConfig {
  @IsString()
  RABBITMQ_HOST: string;

  @IsNumberString()
  RABBITMQ_PORT: string;

  @IsString()
  RABBITMQ_USER: string;

  @IsString()
  RABBITMQ_PASSWORD: string;

  @IsString()
  RABBITMQ_ORDER_QUEUE: string;
}

export default registerAs('rabbitMQ', () => {
  const instance = plainToInstance(RabbitMQConfig, process.env);
  const validationErrors = validateSync(instance);

  if (validationErrors.length > 0) {
    throw new Error(validationErrors.toString());
  }

  return {
    host: instance.RABBITMQ_HOST,
    port: +instance.RABBITMQ_PORT,
    user: instance.RABBITMQ_USER,
    password: instance.RABBITMQ_PASSWORD,
    orderQueue: instance.RABBITMQ_ORDER_QUEUE,
  };
});
