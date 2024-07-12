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
      iss: faker.string.sample(),
      sub: faker.string.uuid(),
      aud: faker.string.uuid(),
      exp: 1695921331,
      acr: faker.string.sample(),
      iat: faker.number.int(),
      auth_time: faker.number.int(),
      aal: faker.string.sample(),
      serviceId: faker.string.uuid(),
      correlationId: faker.string.uuid(),
      currentRelationshipId: faker.string.uuid(),
      sessionId: faker.string.uuid(),
      email: faker.string.sample(),
      contactId: faker.string.uuid(),
      firstName: faker.string.sample(),
      lastName: faker.string.sample(),
      uniqueReference: faker.string.sample(),
      loa: faker.number.int(),
      enrolmentCount: faker.number.int(),
      enrolmentRequestCount: faker.number.int(),
      relationships: [faker.string.sample()],
      roles: [faker.string.sample()],
      nbf: faker.number.int(),
    };

    expect(validate(value)).toBe(true);
  });
});
