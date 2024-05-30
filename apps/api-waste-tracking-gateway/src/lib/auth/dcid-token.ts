import { UserFilter } from './user-filter';
import { Options as StrategyOptions } from 'hapi-auth-jwt2';
import jwksRsa from 'jwks-rsa';
import { validateToken } from './validate';

export interface DcidToken {
  ver: string;
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  acr: string;
  iat: number;
  auth_time: number;
  aal: string;
  serviceId: string;
  correlationId: string;
  currentRelationshipId: string;
  sessionId: string;
  email: string;
  contactId: string;
  firstName: string;
  lastName: string;
  uniqueReference: string;
  loa: number;
  enrolmentCount: number;
  enrolmentRequestCount: number;
  relationships: string[];
  roles: string[];
  nbf: number;
}

export interface JwtOptions {
  audience: string;
  issuer: string;
  jwksUri: string;
}

export function configureStrategy(
  filter: UserFilter,
  options: JwtOptions,
): StrategyOptions {
  const { audience, issuer, jwksUri } = options;

  return {
    complete: true,
    headerKey: 'authorization',
    tokenType: 'Bearer',

    key: jwksRsa.hapiJwt2KeyAsync({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 2,
      jwksUri,
    }),

    validate: validateToken(filter),

    verifyOptions: {
      audience,
      issuer,
      algorithms: ['RS256'],
    },
  };
}
