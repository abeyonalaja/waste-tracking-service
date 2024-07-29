import { Boom } from '@hapi/boom';

export type Response<T> =
  | {
      success: true;
      value: T;
    }
  | {
      success: false;
      error: {
        statusCode: number;
        name: string;
        message: string;
        data?: unknown;
      };
    };

export function success<T>(value: T): Response<T> {
  return { success: true, value };
}

export function fromBoom<T>(boom: Boom): Response<T> {
  return {
    success: false,
    error: {
      statusCode: boom.output.statusCode,
      name: boom.output.payload.error,
      message: boom.message,
      data: boom.data,
    },
  };
}
