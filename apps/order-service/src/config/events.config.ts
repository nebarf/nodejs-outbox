import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

class EventsConfig {
  @IsString()
  readonly EVENT_CHANNEL: string;
}

export default registerAs('events', () => {
  const instance = plainToInstance(EventsConfig, process.env);
  const validationErrors = validateSync(instance);

  if (validationErrors.length > 0) {
    throw new Error(validationErrors.toString());
  }

  return {
    channel: instance.EVENT_CHANNEL,
  };
});
