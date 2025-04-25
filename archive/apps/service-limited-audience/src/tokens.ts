import { verify } from 'jsonwebtoken';

export interface Payload {
  content: string;
  participantId: string;
}

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
  /**
   * Azure Pipelines Library does not currently support multiline variables
   * and so a public key can appear with newlines replaced with spaces. This
   * function attempts to reconstruct the PEM with newlines.
   */
  static formatPublicKey(publicKey: string): string {
    const re = /-----BEGIN PUBLIC KEY-----\s([\s\S]*)\s-----END PUBLIC KEY/;
    const results = re.exec(publicKey);
    if (results === null || results.length < 2) {
      throw new Error('Unable to parse supplied PEM');
    }

    return `
-----BEGIN PUBLIC KEY-----
${results[1].replace(' ', '\n')}
-----END PUBLIC KEY-----
`;
  }

  publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = JwtTokenValidator.formatPublicKey(publicKey);
  }

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
