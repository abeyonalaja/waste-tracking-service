import { verify } from 'jsonwebtoken';

export type Payload = {
  content: string;
  participantId: string;
};

export type ValidationResult =
  | {
      valid: true;
      payload: Payload;
    }
  | {
      valid: false;
      error: string;
    };

export interface TokenValidator {
  validate(token: string): Promise<ValidationResult>;
}

export class JwtTokenValidator implements TokenValidator {
  constructor(private publicKey: string) {}

  validate(token: string): Promise<ValidationResult> {
    const publicKey = this.publicKey;
    return new Promise(function (resolve, reject) {
      verify(token, publicKey, function (err, decoded) {
        if (err !== null) {
          if (err.name === 'JsonWebTokenError') {
            resolve({
              valid: false,
              error: err.message,
            });
          }

          reject(new Error('unknown error during token verification'));
        }

        if (typeof decoded !== 'object') {
          reject('unexpected payload');
          return;
        }

        if (decoded === undefined) {
          reject('undefined payload');
          return;
        }

        resolve({
          valid: true,
          payload: {
            content: decoded.cohort,
            participantId: decoded.sub!,
          },
        });
      });
    });
  }
}
