import { faker } from '@faker-js/faker';
import { validateCreateTemplateRequest } from './template.validation';

describe('validateCreateTemplateRequest', () => {
  const validate = validateCreateTemplateRequest;

  it('Rejects invalid values', () => {
    expect(validate(undefined)).toBe(false);
    expect(validate(faker.datatype.string(10))).toBe(false);
    expect(validate({ ref: faker.datatype.string(10) })).toBe(false);
    expect(validate({})).toBe(false);
  });

  it('Accepts valid values', () => {
    expect(
      validate({
        templateDetails: {
          name: faker.datatype.string(),
          description: faker.datatype.string(),
        },
      }),
    ).toBe(true);
  });
});
