import { faker } from '@faker-js/faker';
import { validateCreatePaymentRequest } from './payment.validation';

describe('validateCreatePaymentRequest', () => {
  const validate = validateCreatePaymentRequest;

  it('Rejects invalid values', () => {
    expect(validate({})).toBe(false);

    expect(
      validate({
        returnUrl: faker.number.int(),
      }),
    ).toBe(false);

    expect(
      validate({
        returnUrl: faker.string.sample(),
        description: faker.number.int(),
      }),
    ).toBe(false);

    expect(
      validate({
        returnUrl: faker.string.sample(),
        description: faker.string.sample(),
        amount: faker.string.sample(),
      }),
    ).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        returnUrl: faker.string.sample(),
      }),
    ).toBe(true);

    expect(
      validate({
        returnUrl: faker.string.sample(),
        description: faker.string.sample(),
      }),
    ).toBe(true);

    expect(
      validate({
        returnUrl: faker.string.sample(),
        description: faker.string.sample(),
        amount: faker.number.int({ min: 0, max: 5000 }),
      }),
    ).toBe(true);

    expect(
      validate({
        returnUrl: faker.string.sample(),
        amount: faker.number.int({ min: 0, max: 5000 }),
      }),
    ).toBe(true);
  });
});
