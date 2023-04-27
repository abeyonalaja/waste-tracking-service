/* eslint-disable @typescript-eslint/no-explicit-any */

import { LoggerService as DaprLoggerService } from '@dapr/dapr';
import * as winston from 'winston';

export default class LoggerService implements DaprLoggerService {
  constructor(private logger: winston.Logger) {}

  error(message: any, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  info(message: any, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): void {
    this.logger.verbose(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  toJSON(): object {
    return {};
  }
}
