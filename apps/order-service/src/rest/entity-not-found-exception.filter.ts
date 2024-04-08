import { ArgumentsHost, Catch, NotFoundException } from '@nestjs/common';
import { EntityNotFoundException } from '../errors/entity-not-found';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(EntityNotFoundException)
export class HttpEntityNotFoundExceptionFilter extends BaseExceptionFilter {
  catch(exception: EntityNotFoundException, host: ArgumentsHost) {
    return super.catch(new NotFoundException(exception.message), host);
  }
}
