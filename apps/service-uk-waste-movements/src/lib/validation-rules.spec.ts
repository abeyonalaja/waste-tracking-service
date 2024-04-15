import { validation } from '../model';
import {
  validateProducerDetailsSection,
  validateReceiverDetailsSection,
} from './validation-rules';
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
      producerPostcode: 'AB1 1CB',
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
      producerPostcode: 'AB1',
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
        field: 'Producer postcode',
        message: validation.ProducerValidationErrorMessages.invalidPostcode,
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

describe(validateReceiverDetailsSection, () => {
  it('passes receiver section validation', () => {
    const result = validateReceiverDetailsSection({
      receiverAddressLine1: '123 Real Street',
      receiverContactName: 'John Smith',
      receiverCountry: 'England',
      receiverContactEmail: 'john.smith@john.smith',
      receiverOrganisationName: 'Test organization',
      receiverContactPhone: '0044140000000',
      receiverPostcode: 'AB1 1AB',
      receiverEnvironmentalPermitNumber: '123456',
      receiverAuthorizationType: 'permit',
      receiverTownCity: 'London',
      receiverAddressLine2: '',
    });

    expect(result.valid).toBe(true);
  });

  it('fails receiver section validation', () => {
    let result = validateReceiverDetailsSection({
      receiverAddressLine1: '',
      receiverContactName: '',
      receiverCountry: '',
      receiverContactEmail: '',
      receiverOrganisationName: '',
      receiverContactPhone: '',
      receiverPostcode: '',
      receiverAuthorizationType: 'Denied',
      receiverTownCity: '',
      receiverEnvironmentalPermitNumber: faker.datatype.string(21),
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Receiver environmental permit number',
        message:
          validation.ReceiverValidationErrorMessages
            .invalidEnvironmentalPermitNumberLength,
      },
      {
        field: 'Receiver organisation name',
        message:
          validation.ReceiverValidationErrorMessages.emptyOrganisationName,
      },
      {
        field: 'Receiver address line 1',
        message: validation.ReceiverValidationErrorMessages.emptyAddressLine1,
      },
      {
        field: 'Receiver town or city',
        message: validation.ReceiverValidationErrorMessages.emptyTownOrCity,
      },
      {
        field: 'Receiver country',
        message: validation.ReceiverValidationErrorMessages.emptyCountry,
      },
      {
        field: 'Receiver contact name',
        message:
          validation.ReceiverValidationErrorMessages.emptyContactFullName,
      },
      {
        field: 'Receiver contact phone number',
        message: validation.ReceiverValidationErrorMessages.emptyPhone,
      },
      {
        field: 'Receiver contact email address',
        message: validation.ReceiverValidationErrorMessages.emptyEmail,
      },
    ]);

    result = validateReceiverDetailsSection({
      receiverEnvironmentalPermitNumber: '             ',
      receiverAddressLine1: '     ',
      receiverContactName: '     ',
      receiverCountry: '     ',
      receiverContactEmail: '     ',
      receiverOrganisationName: '     ',
      receiverContactPhone: '+123567578',
      receiverPostcode: 'AB1',
      receiverAuthorizationType: '     ',
      receiverTownCity: '     ',
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Receiver authorization type',
        message:
          validation.ReceiverValidationErrorMessages.emptyAuthorizationType,
      },
      {
        field: 'Receiver organisation name',
        message:
          validation.ReceiverValidationErrorMessages.emptyOrganisationName,
      },
      {
        field: 'Receiver address line 1',
        message: validation.ReceiverValidationErrorMessages.emptyAddressLine1,
      },
      {
        field: 'Receiver town or city',
        message: validation.ReceiverValidationErrorMessages.emptyTownOrCity,
      },
      {
        field: 'Receiver country',
        message: validation.ReceiverValidationErrorMessages.emptyCountry,
      },
      {
        field: 'Receiver postcode',
        message: validation.ReceiverValidationErrorMessages.invalidPostcode,
      },
      {
        field: 'Receiver contact name',
        message:
          validation.ReceiverValidationErrorMessages.emptyContactFullName,
      },
      {
        field: 'Receiver contact phone number',
        message: validation.ReceiverValidationErrorMessages.invalidPhone,
      },
      {
        field: 'Receiver contact email address',
        message: validation.ReceiverValidationErrorMessages.invalidEmail,
      },
    ]);

    result = validateReceiverDetailsSection({
      receiverAddressLine1: faker.datatype.string(251),
      receiverAddressLine2: faker.datatype.string(251),
      receiverContactName: faker.datatype.string(251),
      receiverCountry: 'France',
      receiverContactEmail: 'not_an_email',
      receiverOrganisationName: faker.datatype.string(251),
      receiverContactPhone: faker.datatype.string(251),
      receiverPostcode: faker.datatype.string(251),
      receiverAuthorizationType: faker.datatype.string(251),
      receiverTownCity: faker.datatype.string(251),
      receiverEnvironmentalPermitNumber: faker.datatype.string(21),
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Receiver authorization type',
        message:
          validation.ReceiverValidationErrorMessages
            .invalidAuthorizationTypeLength,
      },
      {
        field: 'Receiver environmental permit number',
        message:
          validation.ReceiverValidationErrorMessages
            .invalidEnvironmentalPermitNumberLength,
      },
      {
        field: 'Receiver organisation name',
        message:
          validation.ReceiverValidationErrorMessages
            .charTooManyOrganisationName,
      },
      {
        field: 'Receiver address line 1',
        message:
          validation.ReceiverValidationErrorMessages.charTooManyAddressLine1,
      },
      {
        field: 'Receiver address line 2',
        message:
          validation.ReceiverValidationErrorMessages.charTooManyAddressLine2,
      },
      {
        field: 'Receiver town or city',
        message:
          validation.ReceiverValidationErrorMessages.charTooManyTownOrCity,
      },
      {
        field: 'Receiver country',
        message: validation.ReceiverValidationErrorMessages.invalidCountry,
      },
      {
        field: 'Receiver postcode',
        message: validation.ReceiverValidationErrorMessages.invalidPostcode,
      },
      {
        field: 'Receiver contact name',
        message:
          validation.ReceiverValidationErrorMessages.charTooManyContactFullName,
      },
      {
        field: 'Receiver contact phone number',
        message: validation.ReceiverValidationErrorMessages.invalidPhone,
      },
      {
        field: 'Receiver contact email address',
        message: validation.ReceiverValidationErrorMessages.invalidEmail,
      },
    ]);
  });
});
