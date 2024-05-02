import { validation } from '../model';
import {
  validateProducerDetailSection,
  validateWasteCollectionDetailSection,
  validateReceiverDetailSection,
  validateWasteTransportationDetailSection,
  validateWasteTypeDetailSection,
} from './validation-rules';
import { faker } from '@faker-js/faker';

const ewcCodes = [
  {
    code: '010101',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
  {
    code: '010102',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
];

const hazardousCodes = [
  {
    code: 'H1',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
  {
    code: 'H2',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
  {
    code: 'H3',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
];

const pops = [
  {
    name: {
      en: 'POP1',
      cy: 'POP1',
    },
  },
  {
    name: {
      en: 'POP2',
      cy: 'POP2',
    },
  },
  {
    name: {
      en: 'POP3',
      cy: 'POP3',
    },
  },
];

describe(validateProducerDetailSection, () => {
  it('passes producer section validation', () => {
    const result = validateProducerDetailSection({
      producerAddressLine1: '123 Real Street',
      producerAddressLine2: '',
      producerContactName: 'John Smith',
      producerCountry: 'England',
      producerContactEmail: 'john.smith@john.smith',
      producerOrganisationName: 'Test organization',
      producerContactPhone: '0044140000000',
      producerPostcode: 'AB1 1CB',
      producerSicCode: '123456',
      producerTownCity: 'London',
      customerReference: 'testRef',
    });

    expect(result.valid).toBe(true);
  });

  it('fails producer section validation', () => {
    let result = validateProducerDetailSection({
      producerAddressLine1: '',
      producerContactName: '',
      producerCountry: '',
      producerContactEmail: '',
      producerOrganisationName: '',
      producerContactPhone: '',
      producerPostcode: '',
      producerSicCode: '',
      producerTownCity: '',
      customerReference: '',
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
      producerContactEmail: 'not_an_email',
      producerOrganisationName: '     ',
      producerContactPhone: '+123567578',
      producerPostcode: 'AB1',
      producerSicCode: '     ',
      producerTownCity: '     ',
      customerReference: '@!"?',
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
      producerContactEmail: faker.datatype.string(251),
      producerOrganisationName: faker.datatype.string(251),
      producerContactPhone: faker.datatype.string(251),
      producerPostcode: faker.datatype.string(251),
      producerSicCode: faker.datatype.string(251),
      producerTownCity: faker.datatype.string(251),
      customerReference: faker.datatype.string(21),
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
      wasteCollectionWasteSource: 'Construction',
      wasteCollectionBrokerRegistrationNumber: '768453434',
      wasteCollectionCarrierRegistrationNumber: 'CBDL349812',
      wasteCollectionModeOfWasteTransport: 'Rail',
      wasteCollectionExpectedWasteCollectionDate: '01/01/2028',
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
      wasteCollectionWasteSource: '',
      wasteCollectionBrokerRegistrationNumber: '',
      wasteCollectionCarrierRegistrationNumber: '',
      wasteCollectionModeOfWasteTransport: '',
      wasteCollectionExpectedWasteCollectionDate: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'Waste Collection Details Waste Source',
        message: validation.WasteCollectionErrorMessages.missingWasteSource,
      },
      {
        field: 'Waste Collection Details Mode of Waste Transport',
        message: validation.WasteCollectionErrorMessages.emptyModeOfTransport,
      },
      {
        field: 'Waste Collection Details Expected Waste Collection Date',
        message:
          validation.WasteCollectionErrorMessages.missingWasteCollectionDate,
      },
    ]);

    response = validateWasteCollectionDetailSection({
      wasteCollectionAddressLine1: faker.datatype.string(251),
      wasteCollectionAddressLine2: faker.datatype.string(251),
      wasteCollectionTownCity: faker.datatype.string(251),
      wasteCollectionCountry: 'France',
      wasteCollectionPostcode: faker.datatype.string(11),
      wasteCollectionWasteSource: faker.datatype.string(),
      wasteCollectionBrokerRegistrationNumber: faker.datatype.string(21),
      wasteCollectionCarrierRegistrationNumber: faker.datatype.string(21),
      wasteCollectionModeOfWasteTransport: faker.datatype.string(),
      wasteCollectionExpectedWasteCollectionDate: faker.datatype.string(),
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'Waste Collection Details Address Line 1',
        message:
          validation.WasteCollectionErrorMessages.charTooManyAddressLine1,
      },
      {
        field: 'Waste Collection Details Address Line 2',
        message:
          validation.WasteCollectionErrorMessages.charTooManyAddressLine2,
      },
      {
        field: 'Waste Collection Details Town or City',
        message: validation.WasteCollectionErrorMessages.charTooManyTownOrCity,
      },
      {
        field: 'Waste Collection Details Country',
        message: validation.WasteCollectionErrorMessages.invalidCountry,
      },
      {
        field: 'Waste Collection Details Postcode',
        message: validation.WasteCollectionErrorMessages.invalidPostcode,
      },
      {
        field: 'Waste Collection Details Waste Source',
        message: validation.WasteCollectionErrorMessages.invalidWasteSource,
      },
      {
        field: 'Waste Collection Details Broker Registration Number',
        message:
          validation.WasteCollectionErrorMessages
            .charTooManyBrokerRegistrationNumber,
      },
      {
        field: 'Waste Collection Details Carrier Registration Number',
        message:
          validation.WasteCollectionErrorMessages
            .charTooManyCarrierRegistrationNumber,
      },
      {
        field: 'Waste Collection Details Mode of Waste Transport',
        message:
          validation.WasteCollectionErrorMessages.invalidModeOfWasteTransport,
      },
      {
        field: 'Waste Collection Details Expected Waste Collection Date',
        message:
          validation.WasteCollectionErrorMessages
            .invalidFormatWasteCollectionDate,
      },
    ]);
  });
});

describe(validateWasteTypeDetailSection, () => {
  it('passes WasteTypeDetails validation', () => {
    const result = validateWasteTypeDetailSection(
      {
        firstWasteTypeEwcCode: '010101',
        firstWasteTypePhysicalForm: 'Solid',
        firstWasteTypeWasteDescription: 'Test waste',
        firstWasteTypeWasteQuantity: '100',
        firstWasteTypeWasteQuantityType: 'Estimate',
        firstWasteTypeWasteQuantityUnit: 'Kilogram',
        firstWasteTypeContainsPops: 'y',
        firstWasteTypeHasHazardousProperties: 'y',
        firstWasteTypeHazardousWasteCodesString: 'H1;H2;h3',
        firstWasteTypePopsString: 'POP1;POP2;POP3',
        firstWasteTypePopsConcentrationsString: '0.1;0.2;5',
        firstWasteTypePopsConcentrationUnitsString: 'g/kg;%;g/kg',
        firstWasteTypeChemicalAndBiologicalComponentsString:
          'Test; Test 2; Test 3',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
          '0.1;5;6',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
          'g/kg;%;kg',
      },
      hazardousCodes,
      pops,
      ewcCodes
    );

    expect(result.valid).toBe(true);
  });

  it('fails WasteTypeDetails validation', () => {
    let result = validateWasteTypeDetailSection(
      {
        firstWasteTypeEwcCode: '',
        firstWasteTypePhysicalForm: '',
        firstWasteTypeWasteDescription: '',
        firstWasteTypeWasteQuantity: '',
        firstWasteTypeWasteQuantityType: '',
        firstWasteTypeWasteQuantityUnit: '',
        firstWasteTypeContainsPops: '',
        firstWasteTypeHasHazardousProperties: '',
        firstWasteTypeHazardousWasteCodesString: '',
        firstWasteTypePopsString: '',
        firstWasteTypePopsConcentrationsString: '',
        firstWasteTypePopsConcentrationUnitsString: '',
        firstWasteTypeChemicalAndBiologicalComponentsString: '',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString: '',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
          '',
      },
      hazardousCodes,
      pops,
      ewcCodes
    );

    const firstWasteTypeErrorMessages =
      validation.WasteTypeValidationErrorMessages(1);

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      { field: 'EWC Code', message: firstWasteTypeErrorMessages.emptyEwcCode },
      {
        field: 'Waste Description',
        message: firstWasteTypeErrorMessages.emptyWasteDescription,
      },
      {
        field: 'Physical Form',
        message: firstWasteTypeErrorMessages.emptyPhysicalForm,
      },
      {
        field: 'Waste Quantity',
        message: firstWasteTypeErrorMessages.emptyWasteQuantity,
      },
      {
        field: 'Waste Quantity Units',
        message: firstWasteTypeErrorMessages.emptyWasteQuantityUnit,
      },
      {
        field: 'Quantity of waste (actual or estimate)',
        message: firstWasteTypeErrorMessages.invalidWasteQuantityType,
      },
      {
        field: 'Chemical and biological components of the waste',
        message:
          firstWasteTypeErrorMessages.emptyChemicalAndBiologicalComponents,
      },
      {
        field: 'Chemical and biological concentration values',
        message:
          firstWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentration,
      },
      {
        field: 'Chemical and biological concentration units of measure',
        message:
          firstWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentrationUnit,
      },
      {
        field: 'Waste Has Hazardous Properties',
        message: firstWasteTypeErrorMessages.invalidHasHazardousProperties,
      },
      {
        field: 'Waste Contains POPs',
        message: firstWasteTypeErrorMessages.invalidContainsPops,
      },
    ]);

    result = validateWasteTypeDetailSection(
      {
        firstWasteTypeEwcCode: 'non_existant',
        firstWasteTypePhysicalForm: 'plasma',
        firstWasteTypeWasteDescription: faker.datatype.string(101),
        firstWasteTypeWasteQuantity: 'not_a_number',
        firstWasteTypeWasteQuantityType: 'possible',
        firstWasteTypeWasteQuantityUnit: 'ounces',
        firstWasteTypeContainsPops: 'maybe',
        firstWasteTypeHasHazardousProperties: 'maybe',
        firstWasteTypeChemicalAndBiologicalComponentsString: 'a'.repeat(251),
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString: '',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
          'a'.repeat(51),
      },
      hazardousCodes,
      pops,
      ewcCodes
    );

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'EWC Code',
        message: firstWasteTypeErrorMessages.invalidEwcCode,
      },
      {
        field: 'Waste Description',
        message: firstWasteTypeErrorMessages.charTooManyWasteDescription,
      },
      {
        field: 'Physical Form',
        message: firstWasteTypeErrorMessages.invalidPhysicalForm,
      },
      {
        field: 'Waste Quantity',
        message: firstWasteTypeErrorMessages.invalidWasteQuantity,
      },
      {
        field: 'Waste Quantity Units',
        message: firstWasteTypeErrorMessages.invalidWasteQuantityUnit,
      },
      {
        field: 'Quantity of waste (actual or estimate)',
        message: firstWasteTypeErrorMessages.invalidWasteQuantityType,
      },
      {
        field: 'Chemical and biological components of the waste',
        message:
          firstWasteTypeErrorMessages.charTooManyChemicalAndBiologicalComponents,
      },
      {
        field: 'Chemical and biological concentration values',
        message:
          firstWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentration,
      },
      {
        field: 'Chemical and biological concentration units of measure',
        message:
          firstWasteTypeErrorMessages.charTooManyChemicalAndBiologicalConcentrationUnit,
      },
      {
        field: 'Waste Has Hazardous Properties',
        message: firstWasteTypeErrorMessages.invalidHasHazardousProperties,
      },
      {
        field: 'Waste Contains POPs',
        message: firstWasteTypeErrorMessages.invalidContainsPops,
      },
    ]);

    result = validateWasteTypeDetailSection(
      {
        firstWasteTypeEwcCode: '010101',
        firstWasteTypePhysicalForm: 'Solid',
        firstWasteTypeWasteDescription: 'Test waste',
        firstWasteTypeWasteQuantity: '100',
        firstWasteTypeWasteQuantityType: 'Estimate',
        firstWasteTypeWasteQuantityUnit: 'Kilogram',
        firstWasteTypeContainsPops: 'n',
        firstWasteTypeHasHazardousProperties: 'n',
        firstWasteTypeChemicalAndBiologicalComponentsString: 'Test; Test 2',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
          '0.1; test',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
          'g/kg;kg;%',
      },
      hazardousCodes,
      pops,
      ewcCodes
    );
    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Chemical and biological concentration values',
        message:
          firstWasteTypeErrorMessages.invalidChemicalAndBiologicalConcentration,
      },
      {
        field: 'Chemical and biological concentration units of measure',
        message:
          firstWasteTypeErrorMessages.wrongAmountChemicalAndBiologicalContentrationUnit,
      },
    ]);

    result = validateWasteTypeDetailSection(
      {
        firstWasteTypeEwcCode: '010101',
        firstWasteTypePhysicalForm: 'Solid',
        firstWasteTypeWasteDescription: 'Test waste',
        firstWasteTypeWasteQuantity: '100',
        firstWasteTypeWasteQuantityType: 'Estimate',
        firstWasteTypeWasteQuantityUnit: 'Kilogram',
        firstWasteTypeContainsPops: 'n',
        firstWasteTypeHasHazardousProperties: 'n',
        firstWasteTypeChemicalAndBiologicalComponentsString: 'Test; Test 2',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
          '0.1;',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
          'g/kg;kg',
      },
      hazardousCodes,
      pops,
      ewcCodes
    );
    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Chemical and biological concentration values',
        message:
          firstWasteTypeErrorMessages.wrongAmountChemicalAndBiologicalContentration,
      },
    ]);

    result = validateWasteTypeDetailSection(
      {
        firstWasteTypeEwcCode: '010101',
        firstWasteTypePhysicalForm: 'Solid',
        firstWasteTypeWasteDescription: 'Test waste',
        firstWasteTypeWasteQuantity: '100',
        firstWasteTypeWasteQuantityType: 'Estimate',
        firstWasteTypeWasteQuantityUnit: 'Kilogram',
        firstWasteTypeChemicalAndBiologicalComponentsString: 'Test',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
          '0.1',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
          'g/kg',
        firstWasteTypeContainsPops: 'y',
        firstWasteTypeHasHazardousProperties: 'y',
        firstWasteTypeHazardousWasteCodesString: 'H1;H2;h3;h5',
        firstWasteTypePopsString: 'POP1;POP2;POP3',
        firstWasteTypePopsConcentrationsString: '0.1;;5',
        firstWasteTypePopsConcentrationUnitsString: 'g/kg;;g/kg',
      },
      hazardousCodes,
      pops,
      ewcCodes
    );

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Hazardous Waste Codes',
        message: firstWasteTypeErrorMessages.invalidHazardousWasteCodes(['h5']),
      },
      {
        field: 'Persistant organic pollutants (POPs) Concentrations',
        message: firstWasteTypeErrorMessages.wrongAmountPopContentration,
      },
      {
        field: 'Persistant organic pollutants (POPs) Concentration Units',
        message: firstWasteTypeErrorMessages.wrongAmountPopContentrationUnit,
      },
    ]);

    result = validateWasteTypeDetailSection(
      {
        firstWasteTypeEwcCode: '010101',
        firstWasteTypePhysicalForm: 'Solid',
        firstWasteTypeWasteDescription: 'Test waste',
        firstWasteTypeWasteQuantity: '100',
        firstWasteTypeWasteQuantityType: 'Estimate',
        firstWasteTypeWasteQuantityUnit: 'Kilogram',
        firstWasteTypeChemicalAndBiologicalComponentsString: 'Test',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
          '0.1',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
          'g/kg',
        firstWasteTypeContainsPops: 'y',
        firstWasteTypeHasHazardousProperties: 'y',
        firstWasteTypeHazardousWasteCodesString: 'H1;H2;h3;',
        firstWasteTypePopsString: 'POP1;POP2;POP5',
        firstWasteTypePopsConcentrationsString: '0.1;2;5',
        firstWasteTypePopsConcentrationUnitsString: 'g/kg;g;g/kg',
      },
      hazardousCodes,
      pops,
      ewcCodes
    );

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Persistant organic pollutants (POPs)',
        message: firstWasteTypeErrorMessages.invalidPops(['POP5']),
      },
    ]);

    result = validateWasteTypeDetailSection(
      {
        firstWasteTypeEwcCode: '010101',
        firstWasteTypePhysicalForm: 'Solid',
        firstWasteTypeWasteDescription: 'Test waste',
        firstWasteTypeWasteQuantity: '100',
        firstWasteTypeWasteQuantityType: 'Estimate',
        firstWasteTypeWasteQuantityUnit: 'Kilogram',
        firstWasteTypeContainsPops: 'y',
        firstWasteTypeHasHazardousProperties: 'y',
        firstWasteTypeHazardousWasteCodesString: 'H1;H2;h3',
        firstWasteTypePopsString: 'POP1;POP2;POP3',
        firstWasteTypePopsConcentrationsString: '0.1;0.2;5',
        firstWasteTypePopsConcentrationUnitsString: 'g/kg;%;g/kg',
        firstWasteTypeChemicalAndBiologicalComponentsString: 'Test',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
          '0.1',
        firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
          'g/kg',
        secondWasteTypeEwcCode: '010102',
      },
      hazardousCodes,
      pops,
      ewcCodes
    );

    const secondWasteTypeErrorMessages =
      validation.WasteTypeValidationErrorMessages(2);

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Waste Description',
        message: secondWasteTypeErrorMessages.emptyWasteDescription,
      },
      {
        field: 'Physical Form',
        message: secondWasteTypeErrorMessages.emptyPhysicalForm,
      },
      {
        field: 'Waste Quantity',
        message: secondWasteTypeErrorMessages.emptyWasteQuantity,
      },
      {
        field: 'Waste Quantity Units',
        message: secondWasteTypeErrorMessages.emptyWasteQuantityUnit,
      },
      {
        field: 'Quantity of waste (actual or estimate)',
        message: secondWasteTypeErrorMessages.invalidWasteQuantityType,
      },
      {
        field: 'Chemical and biological components of the waste',
        message:
          secondWasteTypeErrorMessages.emptyChemicalAndBiologicalComponents,
      },
      {
        field: 'Chemical and biological concentration values',
        message:
          secondWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentration,
      },
      {
        field: 'Chemical and biological concentration units of measure',
        message:
          secondWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentrationUnit,
      },
      {
        field: 'Waste Has Hazardous Properties',
        message: secondWasteTypeErrorMessages.invalidHasHazardousProperties,
      },
      {
        field: 'Waste Contains POPs',
        message: secondWasteTypeErrorMessages.invalidContainsPops,
      },
    ]);
  });
});
