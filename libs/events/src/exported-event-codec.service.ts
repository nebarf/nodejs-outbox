import { Injectable } from '@nestjs/common';
import { ExportedEventCodec } from './exported-event-codec';

@Injectable()
export class ExportedEventCodecService extends ExportedEventCodec {}
