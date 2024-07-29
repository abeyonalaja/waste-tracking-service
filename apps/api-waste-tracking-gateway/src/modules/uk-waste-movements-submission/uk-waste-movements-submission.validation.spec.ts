import { faker } from '@faker-js/faker';
import { validateCreateDraftRequest } from './uk-waste-movements-submission.validation';

describe('validateCreateDraftRequest', () => {
  const validate = validateCreateDraftRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);
    expect(validate(faker.string.sample(10))).toBe(false);
    expect(validate({ ref: faker.string.sample(10) })).toBe(false);
    expect(validate({ reference: faker.number.int() })).toBe(false);
    expect(validate({ reference: faker.datatype.boolean() })).toBe(false);
    expect(validate({ reference: {} })).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(validate({ reference: faker.string.sample(10) })).toBe(true);
  });
});
