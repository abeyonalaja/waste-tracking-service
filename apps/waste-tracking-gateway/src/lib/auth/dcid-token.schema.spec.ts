import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import { DcidToken } from './dcid-token';
import { dcidToken } from './dcid-token.schema';

const ajv = new Ajv();

describe('dcidToken', () => {
  const validate = ajv.compile<DcidToken>(dcidToken);

  it('is compatible with dto values', () => {
    const value: DcidToken = {
      ver: '1.0',
      iss: faker.datatype.string(),
      sub: faker.datatype.uuid(),
      aud: faker.datatype.uuid(),
      exp: 1695921331,
      acr: faker.datatype.string(),
      iat: faker.datatype.number(),
      auth_time: faker.datatype.number(),
      aal: faker.datatype.string(),
      serviceId: faker.datatype.uuid(),
      correlationId: faker.datatype.uuid(),
      currentRelationshipId: faker.datatype.uuid(),
      sessionId: faker.datatype.uuid(),
      email: faker.datatype.string(),
      contactId: faker.datatype.uuid(),
      firstName: faker.datatype.string(),
      lastName: faker.datatype.string(),
      uniqueReference: faker.datatype.string(),
      loa: faker.datatype.number(),
      enrolmentCount: faker.datatype.number(),
      enrolmentRequestCount: faker.datatype.number(),
      relationships: [faker.datatype.string()],
      roles: [faker.datatype.string()],
      nbf: faker.datatype.number(),
    };

    expect(validate(value)).toBe(true);
  });
});
