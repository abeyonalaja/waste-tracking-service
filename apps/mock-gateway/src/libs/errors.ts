export abstract class CustomError<Data = unknown> extends Error {
  data?: Data;
  abstract statusCode: number;

  constructor(messageOrError?: string | Error, data?: Data) {
    super(
      typeof messageOrError === 'string'
        ? messageOrError
        : messageOrError?.message
    );
    this.data = data;

    if (messageOrError instanceof Error) {
      this.stack = messageOrError.stack;
    }
  }
}

export class NotFoundError<Data = unknown> extends CustomError<Data> {
  statusCode = 404;
  name = 'NotFoundError';
}

export class BadRequestError<Data = unknown> extends CustomError<Data> {
  statusCode = 400;
  name = 'BadRequestError';
}

export class ConflictError<Data = unknown> extends CustomError<Data> {
  statusCode = 409;
  name = 'ConflictError';
}

export class InternalServerError<Data = unknown> extends CustomError<Data> {
  statusCode = 500;
  name = 'InternalServerError';
}
