import { JTDSchemaType } from 'ajv/dist/jtd';
import { DcidToken } from './dcid-token';

export const dcidToken: JTDSchemaType<DcidToken> = {
  properties: {
    ver: { type: 'string' },
    iss: { type: 'string' },
    sub: { type: 'string' },
    aud: { type: 'string' },
    exp: { type: 'float64' },
    acr: { type: 'string' },
    iat: { type: 'float64' },
    auth_time: { type: 'float64' },
    aal: { type: 'string' },
    serviceId: { type: 'string' },
    correlationId: { type: 'string' },
    currentRelationshipId: { type: 'string' },
    sessionId: { type: 'string' },
    email: { type: 'string' },
    contactId: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    uniqueReference: { type: 'string' },
    loa: { type: 'float64' },
    enrolmentCount: { type: 'float64' },
    enrolmentRequestCount: { type: 'float64' },
    relationships: { elements: { type: 'string' } },
    roles: { elements: { type: 'string' } },
    nbf: { type: 'float64' },
  },
};
