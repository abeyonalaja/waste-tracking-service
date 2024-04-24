import { validation } from '../model';
import {
  validateProducerDetailSection,
  validateWasteCollectionDetailSection,
  validateReceiverDetailSection,
  validateWasteTransportationDetailSection,
} from './validation-rules';
import { faker } from '@faker-js/faker';

describe(validateProducerDetailSection, () => {
  it('passes producer section validation', () => {
    const result = validateProducerDetailSection({
      producerAddressLine1: '123 Real Street',
      producerAddressLine2: '',
      producerContactName: 'John Smith',
      producerCountry: 'England',
      producerEmail: 'john.smith@john.smith',
      producerOrganisationName: 'Test organization',
      producerPhone: '0044140000000',
      producerPostcode: 'AB1 1CB',
      producerSicCode: '123456',
      producerTownCity: 'London',
      reference: 'testRef',
    });

    expect(result.valid).toBe(true);
  });

  it('fails producer section validation', () => {
    let result = validateProducerDetailSection({
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

    result = validateProducerDetailSection({
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

    result = validateProducerDetailSection({
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

describe(validateReceiverDetailSection, () => {
  it('passes receiver section validation', () => {
    const result = validateReceiverDetailSection({
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
    let result = validateReceiverDetailSection({
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

    result = validateReceiverDetailSection({
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

    result = validateReceiverDetailSection({
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

describe(validateWasteTransportationDetailSection, () => {
  it('passes waste transportation section validation', () => {
    const result = validateWasteTransportationDetailSection({
      wasteTransportationNumberAndTypeOfContainers: 'test',
      wasteTransportationSpecialHandlingRequirements: 'test',
    });

    expect(result.valid).toBe(true);
  });

  it('fails waste transportation section validation', () => {
    let result = validateWasteTransportationDetailSection({
      wasteTransportationNumberAndTypeOfContainers: '',
    });

    expect(result.valid).toBe(false);
    expect(result.value).toEqual([
      {
        field: 'Number and type of transportation containers',
        message:
          validation.WasteTransportationValidationErrorMessages
            .emptyNameAndTypeOfContainers,
      },
    ]);

    result = validateWasteTransportationDetailSection({
      wasteTransportationNumberAndTypeOfContainers: faker.datatype.string(251),
      wasteTransportationSpecialHandlingRequirements:
        faker.datatype.string(251),
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Number and type of transportation containers',
        message:
          validation.WasteTransportationValidationErrorMessages
            .charTooManyNameAndTypeOfContainers,
      },
      {
        field: 'Special handling requirements details',
        message:
          validation.WasteTransportationValidationErrorMessages
            .charTooManySpecialHandlingRequirements,
      },
    ]);
  });
});

describe(validateWasteCollectionDetailSection, () => {
  it('passes WasteCollectionDetailsSection section validation', async () => {
    const response = validateWasteCollectionDetailSection({
      wasteCollectionAddressLine1: '125, Ashtree Lane',
      wasteCollectionAddressLine2: 'Ashfield',
      wasteCollectionTownCity: 'Ashford',
      wasteCollectionCountry: 'England',
      wasteCollectionPostcode: 'TN14 8HA',
      wasteSource: 'Construction',
      brokerRegNumber: '768453434',
      carrierRegNumber: 'CBDL349812',
      modeOfWasteTransport: 'Rail',
      expectedWasteCollectionDate: '01/01/2028',
    });

    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      wasteSource: 'Construction',
      brokerRegistrationNumber: '768453434',
      carrierRegistrationNumber: 'CBDL349812',
      modeOfWasteTransport: 'Rail',
      expectedWasteCollectionDate: {
        day: '01',
        month: '01',
        year: '2028',
      },
      address: {
        addressLine1: '125, Ashtree Lane',
        addressLine2: 'Ashfield',
        townCity: 'Ashford',
        postcode: 'TN14 8HA',
        country: 'England',
      },
    });
  });

  it('fails WasteCollectionDetailsSection section validation', async () => {
    let response = validateWasteCollectionDetailSection({
      wasteCollectionAddressLine1: '',
      wasteCollectionAddressLine2: '',
      wasteCollectionTownCity: '',
      wasteCollectionCountry: '',
      wasteCollectionPostcode: '',
      wasteSource: '',
      brokerRegNumber: '',
      carrierRegNumber: '',
      modeOfWasteTransport: '',
      expectedWasteCollectionDate: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'Waste Collection Details Waste Source',
        message:
          validation.WasteCollectionDetailsErrorMessages.missingWasteSource,
      },
      {
        field: 'Waste Collection Details Mode of Waste Transport',
        message:
          validation.WasteCollectionDetailsErrorMessages.emptyModeOfTransport,
      },
      {
        field: 'Waste Collection Details Expected Waste Collection Date',
        message:
          validation.WasteCollectionDetailsErrorMessages
            .missingWasteCollectionDate,
      },
    ]);

    response = validateWasteCollectionDetailSection({
      wasteCollectionAddressLine1: faker.datatype.string(251),
      wasteCollectionAddressLine2: faker.datatype.string(251),
      wasteCollectionTownCity: faker.datatype.string(251),
      wasteCollectionCountry: 'France',
      wasteCollectionPostcode: faker.datatype.string(11),
      wasteSource: faker.datatype.string(),
      brokerRegNumber: faker.datatype.string(21),
      carrierRegNumber: faker.datatype.string(21),
      modeOfWasteTransport: faker.datatype.string(),
      expectedWasteCollectionDate: faker.datatype.string(),
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'Waste Collection Details Address Line 1',
        message:
          validation.WasteCollectionDetailsErrorMessages
            .charTooManyAddressLine1,
      },
      {
        field: 'Waste Collection Details Address Line 2',
        message:
          validation.WasteCollectionDetailsErrorMessages
            .charTooManyAddressLine2,
      },
      {
        field: 'Waste Collection Details Town or City',
        message:
          validation.WasteCollectionDetailsErrorMessages.charTooManyTownOrCity,
      },
      {
        field: 'Waste Collection Details Country',
        message: validation.WasteCollectionDetailsErrorMessages.invalidCountry,
      },
      {
        field: 'Waste Collection Details Postcode',
        message: validation.WasteCollectionDetailsErrorMessages.invalidPostcode,
      },
      {
        field: 'Waste Collection Details Waste Source',
        message:
          validation.WasteCollectionDetailsErrorMessages.invalidWasteSource,
      },
      {
        field: 'Waste Collection Details Broker Registration Number',
        message:
          validation.WasteCollectionDetailsErrorMessages
            .charTooManyBrokerRegistrationNumber,
      },
      {
        field: 'Waste Collection Details Carrier Registration Number',
        message:
          validation.WasteCollectionDetailsErrorMessages
            .charTooManyCarrierRegistrationNumber,
      },
      {
        field: 'Waste Collection Details Mode of Waste Transport',
        message:
          validation.WasteCollectionDetailsErrorMessages
            .invalidModeOfWasteTransport,
      },
      {
        field: 'Waste Collection Details Expected Waste Collection Date',
        message:
          validation.WasteCollectionDetailsErrorMessages
            .invalidFormatWasteCollectionDate,
      },
    ]);
  });
});
