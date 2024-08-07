import { faker } from '@faker-js/faker';
import {
  validateCreateDraftRequest,
  validateSetDraftProducerAddressDetailsRequest,
} from './uk-waste-movements-submission.validation';

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

describe('validateSetDraftProducerAddressRequest', () => {
  const validate = validateSetDraftProducerAddressDetailsRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate({})).toBe(false);

    expect(
      validate({
        buildingNameOrNumber: faker.number.int(),
        addressLine1: faker.number.int(),
        addressLine2: faker.number.int(),
        townCity: faker.number.int(),
        postcode: faker.number.int(),
        country: faker.number.int(),
      }),
    ).toBe(false);
    expect(
      validate({
        buildingNameOrNumber: faker.string.sample(),
        addressLine2: faker.string.sample(),
        townCity: faker.string.sample(),
        postcode: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        buildingNameOrNumber: faker.string.sample(),
        addressLine1: faker.string.sample(),
        addressLine2: faker.string.sample(),
        townCity: faker.string.sample(),
        postcode: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(true);
    expect(
      validate({
        addressLine1: faker.string.sample(),
        townCity: faker.string.sample(),
        country: faker.string.sample(),
      }),
    ).toBe(true);
  });
});
