/* eslint-disable @typescript-eslint/no-explicit-any */

import { LoggerService as DaprLoggerService } from '@dapr/dapr';
import * as winston from 'winston';

export default class LoggerService implements DaprLoggerService {
  constructor(private logger: winston.Logger) {}

  error(message: string, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
  }

  verbose(message: string, ...optionalParams: any[]): void {
    this.logger.verbose(message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  toJSON(): object {
    return {};
  }
}
