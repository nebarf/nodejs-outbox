import { Module } from '@nestjs/common';
import { MessageLogService } from './message-log.service';
import { TypeGuardService } from './type-guard.service';

@Module({
  providers: [MessageLogService, TypeGuardService],
  exports: [MessageLogService, TypeGuardService],
})
export class ServicesModule {}
