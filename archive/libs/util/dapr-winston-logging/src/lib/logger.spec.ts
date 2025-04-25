import { expect, jest } from '@jest/globals';
import { Logger as WinstonLogger } from 'winston';
import LoggerService from './logger';

const mockDebug = jest.fn<typeof WinstonLogger.prototype.debug>();
const mockVerbose = jest.fn<typeof WinstonLogger.prototype.info>();
const mockInfo = jest.fn<typeof WinstonLogger.prototype.info>();
const mockWarn = jest.fn<typeof WinstonLogger.prototype.warn>();
const mockError = jest.fn<typeof WinstonLogger.prototype.error>();

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    debug: mockDebug,
    verbose: mockVerbose,
    info: mockInfo,
    warn: mockWarn,
    error: mockError,
  })),
}));

beforeEach(() => {
  mockDebug.mockClear();
  mockVerbose.mockClear();
  mockInfo.mockClear();
  mockWarn.mockClear();
  mockError.mockClear();
});

const subject = new LoggerService(new WinstonLogger());

describe('debug', () => {
  it('echoes arguments to winston logger', () => {
    const msg = 'message';
    const opt = { x: 'y' };

    subject.debug(msg, opt);

    expect(mockDebug).toHaveBeenCalledTimes(1);
    expect(mockDebug).toHaveBeenCalledWith(msg, opt);
  });
});

describe('verbose', () => {
  it('echoes arguments to winston logger', () => {
    const msg = 'message';
    const opt = { x: 'y' };

    subject.verbose(msg, opt);

    expect(mockVerbose).toHaveBeenCalledTimes(1);
    expect(mockVerbose).toHaveBeenCalledWith(msg, opt);
  });
});

describe('info', () => {
  it('echoes arguments to winston logger', () => {
    const msg = 'message';
    const opt = { x: 'y' };

    subject.info(msg, opt);

    expect(mockInfo).toHaveBeenCalledTimes(1);
    expect(mockInfo).toHaveBeenCalledWith(msg, opt);
  });
});

describe('warn', () => {
  it('echoes arguments to winston logger', () => {
    const msg = 'message';
    const opt = { x: 'y' };

    subject.warn(msg, opt);

    expect(mockWarn).toHaveBeenCalledTimes(1);
    expect(mockWarn).toHaveBeenCalledWith(msg, opt);
  });
});

describe('error', () => {
  it('echoes arguments to winston logger', () => {
    const msg = 'message';
    const opt = { x: 'y' };

    subject.error(msg, opt);

    expect(mockError).toHaveBeenCalledTimes(1);
    expect(mockError).toHaveBeenCalledWith(msg, opt);
  });
});
