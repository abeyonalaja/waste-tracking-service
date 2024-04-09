import { validation } from '../model';
import { validateProducerDetailsSection } from './validation-rules';
import { faker } from '@faker-js/faker';

describe(validateProducerDetailsSection, () => {
  it('passes producer section validation', () => {
    const result = validateProducerDetailsSection({
      producerAddressLine1: '123 Real Street',
      producerContactName: 'John Smith',
      producerCountry: 'England',
      producerEmail: 'john.smith@john.smith',
      producerOrganisationName: 'Test organization',
      producerPhone: '0044140000000',
      producerPostcode: 'ABC 123',
      producerSicCode: '123456',
      producerTownCity: 'London',
      reference: 'testRef',
      producerAddressLine2: '',
    });

    expect(result.valid).toBe(true);
  });

  it('fails producer section validation', () => {
    let result = validateProducerDetailsSection({
      producerAddressLine1: '',
      producerContactName: '',
      producerCountry: '',
      producerEmail: '',
      producerOrganisationName: '',
      producerPhone: '',
      producerPostcode: '',
      producerSicCode: '',
      producerTownCity: '',
      reference: '',
    });
    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Reference',
        message: validation.ProducerValidationErrorMessages.emptyReference,
      },
      {
        field: 'Producer organisation name',
        message:
          validation.ProducerValidationErrorMessages.emptyOrganisationName,
      },
      {
        field: 'Producer address line 1',
        message: validation.ProducerValidationErrorMessages.emptyAddressLine1,
      },
      {
        field: 'Producer town or city',
        message: validation.ProducerValidationErrorMessages.emptyTownOrCity,
      },
      {
        field: 'Producer country',
        message: validation.ProducerValidationErrorMessages.emptyCountry,
      },
      {
        field: 'Producer contact name',
        message:
          validation.ProducerValidationErrorMessages.emptyContactFullName,
      },
      {
        field: 'Producer contact phone number',
        message: validation.ProducerValidationErrorMessages.emptyPhone,
      },
      {
        field: 'Producer contact email address',
        message: validation.ProducerValidationErrorMessages.emptyEmail,
      },
    ]);

    result = validateProducerDetailsSection({
      producerAddressLine1: '     ',
      producerContactName: '     ',
      producerCountry: '     ',
      producerEmail: 'not_an_email',
      producerOrganisationName: '     ',
      producerPhone: '+123567578',
      producerPostcode: '     ',
      producerSicCode: '     ',
      producerTownCity: '     ',
      reference: '@!"?',
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Reference',
        message: validation.ProducerValidationErrorMessages.invalidReference,
      },
      {
        field: 'Producer organisation name',
        message:
          validation.ProducerValidationErrorMessages.emptyOrganisationName,
      },
      {
        field: 'Producer address line 1',
        message: validation.ProducerValidationErrorMessages.emptyAddressLine1,
      },
      {
        field: 'Producer town or city',
        message: validation.ProducerValidationErrorMessages.emptyTownOrCity,
      },
      {
        field: 'Producer country',
        message: validation.ProducerValidationErrorMessages.emptyCountry,
      },
      {
        field: 'Producer contact name',
        message:
          validation.ProducerValidationErrorMessages.emptyContactFullName,
      },
      {
        field: 'Producer contact phone number',
        message: validation.ProducerValidationErrorMessages.invalidPhone,
      },
      {
        field: 'Producer contact email address',
        message: validation.ProducerValidationErrorMessages.invalidEmail,
      },
      {
        field: 'Producer Standard Industrial Classification (SIC) code',
        message: validation.ProducerValidationErrorMessages.invalidSicCode,
      },
    ]);

    result = validateProducerDetailsSection({
      producerAddressLine1: faker.datatype.string(251),
      producerAddressLine2: faker.datatype.string(251),
      producerContactName: faker.datatype.string(251),
      producerCountry: faker.datatype.string(251),
      producerEmail: faker.datatype.string(251),
      producerOrganisationName: faker.datatype.string(251),
      producerPhone: faker.datatype.string(251),
      producerPostcode: faker.datatype.string(251),
      producerSicCode: faker.datatype.string(251),
      producerTownCity: faker.datatype.string(251),
      reference: faker.datatype.string(21),
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Reference',
        message:
          validation.ProducerValidationErrorMessages.charTooManyReference,
      },
      {
        field: 'Producer organisation name',
        message:
          validation.ProducerValidationErrorMessages
            .charTooManyOrganisationName,
      },
      {
        field: 'Producer address line 1',
        message:
          validation.ProducerValidationErrorMessages.charTooManyAddressLine1,
      },
      {
        field: 'Producer address line 2',
        message:
          validation.ProducerValidationErrorMessages.charTooManyAddressLine2,
      },
      {
        field: 'Producer town or city',
        message:
          validation.ProducerValidationErrorMessages.charTooManyTownOrCity,
      },
      {
        field: 'Producer country',
        message: validation.ProducerValidationErrorMessages.invalidCountry,
      },
      {
        field: 'Producer postcode',
        message: validation.ProducerValidationErrorMessages.invalidPostcode,
      },
      {
        field: 'Producer contact name',
        message:
          validation.ProducerValidationErrorMessages.charTooManyContactFullName,
      },
      {
        field: 'Producer contact phone number',
        message: validation.ProducerValidationErrorMessages.invalidPhone,
      },
      {
        field: 'Producer contact email address',
        message: validation.ProducerValidationErrorMessages.invalidEmail,
      },
      {
        field: 'Producer Standard Industrial Classification (SIC) code',
        message: validation.ProducerValidationErrorMessages.invalidSicCode,
      },
    ]);
  });
});
