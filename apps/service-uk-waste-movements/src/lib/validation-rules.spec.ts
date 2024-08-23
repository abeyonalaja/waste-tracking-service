import { format } from 'date-fns';
import { validation } from '../model';
import {
  validateProducerDetailSection,
  validateWasteCollectionDetailSection,
  validateReceiverDetailSection,
  validateWasteTransportationDetailSection,
  validateWasteTypeDetailSection,
  validateCarrierDetailSection,
  validateCustomerReference,
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

const localAuthorities = [
  {
    name: {
      en: 'Local Authority 1',
      cy: 'Local Authority 1',
    },
    country: {
      en: 'England',
      cy: 'England',
    },
  },
  {
    name: {
      en: 'Local Authority 2',
      cy: 'Local Authority 2',
    },
    country: {
      en: 'England',
      cy: 'England',
    },
  },
  {
    name: {
      en: 'Local Authority 3',
      cy: 'Local Authority 3',
    },
    country: {
      en: 'England',
      cy: 'England',
    },
  },
];

describe(validateCustomerReference, () => {
  it('passes customer reference validation', () => {
    const result = validateCustomerReference('testref');
    expect(result.valid).toBe(true);
  });

  it('fails customer reference validation', () => {
    let result = validateCustomerReference('');
    expect(result.valid).toBe(false);
    expect(result.value).toEqual([
      {
        field: 'Reference',
        code: validation.errorCodes.producerEmptyReference,
      },
    ]);

    result = validateCustomerReference(faker.string.sample(21));
    expect(result.valid).toBe(false);
    expect(result.value).toEqual([
      {
        field: 'Reference',
        code: validation.errorCodes.producerCharTooManyReference,
      },
    ]);

    result = validateCustomerReference('@!"?');
    expect(result.valid).toBe(false);
    expect(result.value).toEqual([
      {
        field: 'Reference',
        code: validation.errorCodes.producerInvalidReference,
      },
    ]);
  });
});

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
    });
    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Producer organisation name',
        code: validation.errorCodes.producerEmptyOrganisationName,
      },
      {
        field: 'Producer address line 1',
        code: validation.errorCodes.producerEmptyAddressLine1,
      },
      {
        field: 'Producer town or city',
        code: validation.errorCodes.producerEmptyTownOrCity,
      },
      {
        field: 'Producer country',
        code: validation.errorCodes.producerEmptyCountry,
      },
      {
        field: 'Producer contact name',
        code: validation.errorCodes.producerEmptyContactFullName,
      },
      {
        field: 'Producer contact phone number',
        code: validation.errorCodes.producerEmptyPhone,
      },
      {
        field: 'Producer contact email address',
        code: validation.errorCodes.producerEmptyEmail,
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
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Producer organisation name',
        code: validation.errorCodes.producerEmptyOrganisationName,
      },
      {
        field: 'Producer address line 1',
        code: validation.errorCodes.producerEmptyAddressLine1,
      },
      {
        field: 'Producer town or city',
        code: validation.errorCodes.producerEmptyTownOrCity,
      },
      {
        field: 'Producer country',
        code: validation.errorCodes.producerEmptyCountry,
      },
      {
        field: 'Producer postcode',
        code: validation.errorCodes.producerInvalidPostcode,
      },
      {
        field: 'Producer contact name',
        code: validation.errorCodes.producerEmptyContactFullName,
      },
      {
        field: 'Producer contact phone number',
        code: validation.errorCodes.producerInvalidPhone,
      },
      {
        field: 'Producer contact email address',
        code: validation.errorCodes.producerInvalidEmail,
      },
      {
        field: 'Producer Standard Industrial Classification (SIC) code',
        code: validation.errorCodes.producerInvalidSicCode,
      },
    ]);

    result = validateProducerDetailSection({
      producerAddressLine1: faker.string.sample(251),
      producerAddressLine2: faker.string.sample(251),
      producerContactName: faker.string.sample(251),
      producerCountry: faker.string.sample(251),
      producerContactEmail: faker.string.sample(251),
      producerOrganisationName: faker.string.sample(251),
      producerContactPhone: faker.string.sample(251),
      producerPostcode: faker.string.sample(251),
      producerSicCode: faker.string.sample(251),
      producerTownCity: faker.string.sample(251),
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Producer organisation name',
        code: validation.errorCodes.producerCharTooManyOrganisationName,
      },
      {
        field: 'Producer address line 1',
        code: validation.errorCodes.producerCharTooManyAddressLine1,
      },
      {
        field: 'Producer address line 2',
        code: validation.errorCodes.producerCharTooManyAddressLine2,
      },
      {
        field: 'Producer town or city',
        code: validation.errorCodes.producerCharTooManyTownOrCity,
      },
      {
        field: 'Producer country',
        code: validation.errorCodes.producerInvalidCountry,
      },
      {
        field: 'Producer postcode',
        code: validation.errorCodes.producerInvalidPostcode,
      },
      {
        field: 'Producer contact name',
        code: validation.errorCodes.producerCharTooManyContactFullName,
      },
      {
        field: 'Producer contact phone number',
        code: validation.errorCodes.producerInvalidPhone,
      },
      {
        field: 'Producer contact email address',
        code: validation.errorCodes.producerInvalidEmail,
      },
      {
        field: 'Producer Standard Industrial Classification (SIC) code',
        code: validation.errorCodes.producerInvalidSicCode,
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
      receiverEnvironmentalPermitNumber: faker.string.sample(21),
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Receiver environmental permit number',
        code: validation.errorCodes
          .receiverInvalidEnvironmentalPermitNumberLength,
      },
      {
        field: 'Receiver organisation name',
        code: validation.errorCodes.receiverEmptyOrganisationName,
      },
      {
        field: 'Receiver address line 1',
        code: validation.errorCodes.receiverEmptyAddressLine1,
      },
      {
        field: 'Receiver town or city',
        code: validation.errorCodes.receiverEmptyTownOrCity,
      },
      {
        field: 'Receiver country',
        code: validation.errorCodes.receiverEmptyCountry,
      },
      {
        field: 'Receiver contact name',
        code: validation.errorCodes.receiverEmptyContactFullName,
      },
      {
        field: 'Receiver contact phone number',
        code: validation.errorCodes.receiverEmptyPhone,
      },
      {
        field: 'Receiver contact email address',
        code: validation.errorCodes.receiverEmptyEmail,
      },
    ]);

    result = validateReceiverDetailSection({
      receiverEnvironmentalPermitNumber: '   ',
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
        code: validation.errorCodes.receiverEmptyAuthorizationType,
      },
      {
        field: 'Receiver organisation name',
        code: validation.errorCodes.receiverEmptyOrganisationName,
      },
      {
        field: 'Receiver address line 1',
        code: validation.errorCodes.receiverEmptyAddressLine1,
      },
      {
        field: 'Receiver town or city',
        code: validation.errorCodes.receiverEmptyTownOrCity,
      },
      {
        field: 'Receiver country',
        code: validation.errorCodes.receiverEmptyCountry,
      },
      {
        field: 'Receiver postcode',
        code: validation.errorCodes.receiverInvalidPostcode,
      },
      {
        field: 'Receiver contact name',
        code: validation.errorCodes.receiverEmptyContactFullName,
      },
      {
        field: 'Receiver contact phone number',
        code: validation.errorCodes.receiverInvalidPhone,
      },
      {
        field: 'Receiver contact email address',
        code: validation.errorCodes.receiverInvalidEmail,
      },
    ]);

    result = validateReceiverDetailSection({
      receiverAddressLine1: faker.string.sample(251),
      receiverAddressLine2: faker.string.sample(251),
      receiverContactName: faker.string.sample(251),
      receiverCountry: 'France',
      receiverContactEmail: 'not_an_email',
      receiverOrganisationName: faker.string.sample(251),
      receiverContactPhone: faker.string.sample(251),
      receiverPostcode: faker.string.sample(251),
      receiverAuthorizationType: faker.string.sample(251),
      receiverTownCity: faker.string.sample(251),
      receiverEnvironmentalPermitNumber: faker.string.sample(21),
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Receiver authorization type',
        code: validation.errorCodes.receiverInvalidAuthorizationTypeLength,
      },
      {
        field: 'Receiver environmental permit number',
        code: validation.errorCodes
          .receiverInvalidEnvironmentalPermitNumberLength,
      },
      {
        field: 'Receiver organisation name',
        code: validation.errorCodes.receiverCharTooManyOrganisationName,
      },
      {
        field: 'Receiver address line 1',
        code: validation.errorCodes.receiverCharTooManyAddressLine1,
      },
      {
        field: 'Receiver address line 2',
        code: validation.errorCodes.receiverCharTooManyAddressLine2,
      },
      {
        field: 'Receiver town or city',
        code: validation.errorCodes.receiverCharTooManyTownOrCity,
      },
      {
        field: 'Receiver country',
        code: validation.errorCodes.receiverInvalidCountry,
      },
      {
        field: 'Receiver postcode',
        code: validation.errorCodes.receiverInvalidPostcode,
      },
      {
        field: 'Receiver contact name',
        code: validation.errorCodes.receiverCharTooManyContactFullName,
      },
      {
        field: 'Receiver contact phone number',
        code: validation.errorCodes.receiverInvalidPhone,
      },
      {
        field: 'Receiver contact email address',
        code: validation.errorCodes.receiverInvalidEmail,
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
        code: validation.errorCodes
          .wasteTransportationEmptyNameAndTypeOfContainers,
      },
    ]);

    result = validateWasteTransportationDetailSection({
      wasteTransportationNumberAndTypeOfContainers: faker.string.sample(251),
      wasteTransportationSpecialHandlingRequirements: faker.string.sample(251),
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Number and type of transportation containers',
        code: validation.errorCodes
          .wasteTransportationCharTooManyNameAndTypeOfContainers,
      },
      {
        field: 'Special handling requirements details',
        code: validation.errorCodes
          .wasteTransportationCharTooManySpecialHandlingRequirements,
      },
    ]);
  });
});

describe(validateWasteCollectionDetailSection, () => {
  it('passes WasteCollectionDetailsSection section validation', async () => {
    const response = validateWasteCollectionDetailSection(
      {
        wasteCollectionAddressLine1: '125, Ashtree Lane',
        wasteCollectionAddressLine2: 'Ashfield',
        wasteCollectionTownCity: 'Ashford',
        wasteCollectionCountry: 'England',
        wasteCollectionPostcode: 'TN14 8HA',
        wasteCollectionWasteSource: 'Commercial',
        wasteCollectionBrokerRegistrationNumber: '768453434',
        wasteCollectionCarrierRegistrationNumber: 'CBDL349812',
        wasteCollectionLocalAuthority: 'Local Authority 1',
        wasteCollectionExpectedWasteCollectionDate: '01/01/2028',
      },
      localAuthorities,
    );

    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      wasteSource: 'Commercial',
      brokerRegistrationNumber: '768453434',
      carrierRegistrationNumber: 'CBDL349812',
      localAuthority: 'Local Authority 1',
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
    let response = validateWasteCollectionDetailSection(
      {
        wasteCollectionAddressLine1: '',
        wasteCollectionAddressLine2: '',
        wasteCollectionTownCity: '',
        wasteCollectionCountry: '',
        wasteCollectionPostcode: '',
        wasteCollectionWasteSource: '',
        wasteCollectionBrokerRegistrationNumber: '',
        wasteCollectionCarrierRegistrationNumber: '',
        wasteCollectionLocalAuthority: '',
        wasteCollectionExpectedWasteCollectionDate: '',
      },
      localAuthorities,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'Waste Collection Details Waste Source',
        code: validation.errorCodes.wasteCollectionMissingWasteSource,
      },
      {
        field: 'Local authority',
        code: validation.errorCodes.wasteCollectionEmptyLocalAuthority,
      },
      {
        field: 'Waste Collection Details Expected Waste Collection Date',
        code: validation.errorCodes.wasteCollectionMissingWasteCollectionDate,
      },
    ]);

    response = validateWasteCollectionDetailSection(
      {
        wasteCollectionAddressLine1: faker.string.sample(251),
        wasteCollectionAddressLine2: faker.string.sample(251),
        wasteCollectionTownCity: faker.string.sample(251),
        wasteCollectionCountry: 'France',
        wasteCollectionPostcode: faker.string.sample(11),
        wasteCollectionWasteSource: faker.string.sample(),
        wasteCollectionBrokerRegistrationNumber: faker.string.sample(21),
        wasteCollectionCarrierRegistrationNumber: faker.string.sample(21),
        wasteCollectionLocalAuthority: faker.string.sample(251),
        wasteCollectionExpectedWasteCollectionDate: faker.string.sample(),
      },
      localAuthorities,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'Waste Collection Details Address Line 1',
        code: validation.errorCodes.wasteCollectionCharTooManyAddressLine1,
      },
      {
        field: 'Waste Collection Details Address Line 2',
        code: validation.errorCodes.wasteCollectionCharTooManyAddressLine2,
      },
      {
        field: 'Waste Collection Details Town or City',
        code: validation.errorCodes.wasteCollectionCharTooManyTownOrCity,
      },
      {
        field: 'Waste Collection Details Country',
        code: validation.errorCodes.wasteCollectionInvalidCountry,
      },
      {
        field: 'Waste Collection Details Postcode',
        code: validation.errorCodes.wasteCollectionInvalidPostcode,
      },
      {
        field: 'Waste Collection Details Waste Source',
        code: validation.errorCodes.wasteCollectionInvalidWasteSource,
      },
      {
        field: 'Local authority',
        code: validation.errorCodes.wasteCollectionCharTooManyLocalAuthority,
      },
      {
        field: 'Waste Collection Details Broker Registration Number',
        code: validation.errorCodes
          .wasteCollectionCharTooManyBrokerRegistrationNumber,
      },
      {
        field: 'Waste Collection Details Carrier Registration Number',
        code: validation.errorCodes
          .wasteCollectionCharTooManyCarrierRegistrationNumber,
      },
      {
        field: 'Waste Collection Details Expected Waste Collection Date',
        code: validation.errorCodes
          .wasteCollectionInvalidFormatWasteCollectionDate,
      },
    ]);
    const today = new Date();
    const yesterday = format(
      new Date(today.getTime() - 24 * 60 * 60 * 1000),
      'dd/MM/yy',
    );

    response = validateWasteCollectionDetailSection(
      {
        wasteCollectionAddressLine1: faker.string.sample(60),
        wasteCollectionAddressLine2: faker.string.sample(60),
        wasteCollectionTownCity: faker.string.sample(50),
        wasteCollectionCountry: 'France',
        wasteCollectionPostcode: faker.string.sample(11),
        wasteCollectionWasteSource: faker.string.sample(),
        wasteCollectionBrokerRegistrationNumber: faker.string.sample(21),
        wasteCollectionCarrierRegistrationNumber: faker.string.sample(21),
        wasteCollectionLocalAuthority: faker.string.sample(251),
        wasteCollectionExpectedWasteCollectionDate: yesterday,
      },
      localAuthorities,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'Waste Collection Details Country',
        code: validation.errorCodes.wasteCollectionInvalidCountry,
      },
      {
        field: 'Waste Collection Details Postcode',
        code: validation.errorCodes.wasteCollectionInvalidPostcode,
      },
      {
        field: 'Waste Collection Details Waste Source',
        code: validation.errorCodes.wasteCollectionInvalidWasteSource,
      },
      {
        field: 'Local authority',
        code: validation.errorCodes.wasteCollectionCharTooManyLocalAuthority,
      },
      {
        field: 'Waste Collection Details Broker Registration Number',
        code: validation.errorCodes
          .wasteCollectionCharTooManyBrokerRegistrationNumber,
      },
      {
        field: 'Waste Collection Details Carrier Registration Number',
        code: validation.errorCodes
          .wasteCollectionCharTooManyCarrierRegistrationNumber,
      },
      {
        field: 'Waste Collection Details Expected Waste Collection Date',
        code: validation.errorCodes
          .wasteCollectionDateInThePastWasteCollectionDate,
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
      ewcCodes,
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
      ewcCodes,
    );

    const firstWasteTypeErrorMessages =
      validation.errorCodes.WasteTypeValidationErrorCode(1);

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      { field: 'EWC Code', code: firstWasteTypeErrorMessages.emptyEwcCode },
      {
        field: 'Waste Description',
        code: firstWasteTypeErrorMessages.emptyWasteDescription,
      },
      {
        field: 'Physical Form',
        code: firstWasteTypeErrorMessages.emptyPhysicalForm,
      },
      {
        field: 'Waste Quantity',
        code: firstWasteTypeErrorMessages.emptyWasteQuantity,
      },
      {
        field: 'Waste Quantity Units',
        code: firstWasteTypeErrorMessages.emptyWasteQuantityUnit,
      },
      {
        field: 'Quantity of waste (actual or estimate)',
        code: firstWasteTypeErrorMessages.invalidWasteQuantityType,
      },
      {
        field: 'Chemical and biological components of the waste',
        code: firstWasteTypeErrorMessages.emptyChemicalAndBiologicalComponents,
      },
      {
        field: 'Chemical and biological concentration values',
        code: firstWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentration,
      },
      {
        field: 'Chemical and biological concentration units of measure',
        code: firstWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentrationUnit,
      },
      {
        field: 'Waste Has Hazardous Properties',
        code: firstWasteTypeErrorMessages.invalidHasHazardousProperties,
      },
      {
        field: 'Waste Contains POPs',
        code: firstWasteTypeErrorMessages.invalidContainsPops,
      },
    ]);

    result = validateWasteTypeDetailSection(
      {
        firstWasteTypeEwcCode: 'non_existant',
        firstWasteTypePhysicalForm: 'plasma',
        firstWasteTypeWasteDescription: faker.string.sample(101),
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
      ewcCodes,
    );

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'EWC Code',
        code: firstWasteTypeErrorMessages.invalidEwcCode,
      },
      {
        field: 'Waste Description',
        code: firstWasteTypeErrorMessages.charTooManyWasteDescription,
      },
      {
        field: 'Physical Form',
        code: firstWasteTypeErrorMessages.invalidPhysicalForm,
      },
      {
        field: 'Waste Quantity',
        code: firstWasteTypeErrorMessages.invalidWasteQuantity,
      },
      {
        field: 'Waste Quantity Units',
        code: firstWasteTypeErrorMessages.invalidWasteQuantityUnit,
      },
      {
        field: 'Quantity of waste (actual or estimate)',
        code: firstWasteTypeErrorMessages.invalidWasteQuantityType,
      },
      {
        field: 'Chemical and biological components of the waste',
        code: firstWasteTypeErrorMessages.charTooManyChemicalAndBiologicalComponents,
      },
      {
        field: 'Chemical and biological concentration values',
        code: firstWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentration,
      },
      {
        field: 'Chemical and biological concentration units of measure',
        code: firstWasteTypeErrorMessages.charTooManyChemicalAndBiologicalConcentrationUnit,
      },
      {
        field: 'Waste Has Hazardous Properties',
        code: firstWasteTypeErrorMessages.invalidHasHazardousProperties,
      },
      {
        field: 'Waste Contains POPs',
        code: firstWasteTypeErrorMessages.invalidContainsPops,
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
      ewcCodes,
    );
    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Chemical and biological concentration values',
        code: firstWasteTypeErrorMessages.invalidChemicalAndBiologicalConcentration,
      },
      {
        field: 'Chemical and biological concentration units of measure',
        code: firstWasteTypeErrorMessages.wrongAmountChemicalAndBiologicalContentrationUnit,
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
      ewcCodes,
    );
    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Chemical and biological concentration values',
        code: firstWasteTypeErrorMessages.wrongAmountChemicalAndBiologicalContentration,
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
      ewcCodes,
    );

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Hazardous Waste Codes',
        code: firstWasteTypeErrorMessages.invalidHazardousWasteCodes,
        args: ['h5'],
      },
      {
        field: 'Persistant organic pollutants (POPs) Concentration Values',
        code: firstWasteTypeErrorMessages.wrongAmountPopContentration,
      },
      {
        field: 'Persistant organic pollutants (POPs) Concentration Units',
        code: firstWasteTypeErrorMessages.wrongAmountPopContentrationUnit,
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
      ewcCodes,
    );

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Persistant organic pollutants (POPs)',
        code: firstWasteTypeErrorMessages.invalidPops,
        args: ['POP5'],
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
      ewcCodes,
    );

    const secondWasteTypeErrorMessages =
      validation.errorCodes.WasteTypeValidationErrorCode(2);

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Waste Description',
        code: secondWasteTypeErrorMessages.emptyWasteDescription,
      },
      {
        field: 'Physical Form',
        code: secondWasteTypeErrorMessages.emptyPhysicalForm,
      },
      {
        field: 'Waste Quantity',
        code: secondWasteTypeErrorMessages.emptyWasteQuantity,
      },
      {
        field: 'Waste Quantity Units',
        code: secondWasteTypeErrorMessages.emptyWasteQuantityUnit,
      },
      {
        field: 'Quantity of waste (actual or estimate)',
        code: secondWasteTypeErrorMessages.invalidWasteQuantityType,
      },
      {
        field: 'Chemical and biological components of the waste',
        code: secondWasteTypeErrorMessages.emptyChemicalAndBiologicalComponents,
      },
      {
        field: 'Chemical and biological concentration values',
        code: secondWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentration,
      },
      {
        field: 'Chemical and biological concentration units of measure',
        code: secondWasteTypeErrorMessages.emptyChemicalAndBiologicalConcentrationUnit,
      },
      {
        field: 'Waste Has Hazardous Properties',
        code: secondWasteTypeErrorMessages.invalidHasHazardousProperties,
      },
      {
        field: 'Waste Contains POPs',
        code: secondWasteTypeErrorMessages.invalidContainsPops,
      },
    ]);
  });
});

describe(validateCarrierDetailSection, () => {
  it('passes carrier section validation', () => {
    let result = validateCarrierDetailSection({
      carrierAddressLine1: '123 Real Street',
      carrierAddressLine2: '',
      carrierContactName: 'John Smith',
      carrierCountry: 'England',
      carrierContactEmail: 'john.smith@john.smith',
      carrierOrganisationName: 'Test organization',
      carrierContactPhone: "'0044140000000'",
      carrierPostcode: 'AB1 1CB',
      carrierTownCity: 'London',
    });

    expect(result.valid).toBe(true);

    expect(result.value).toEqual({
      address: {
        addressLine1: '123 Real Street',
        addressLine2: '',
        country: 'England',
        postcode: 'AB1 1CB',
        townCity: 'London',
      },
      contact: {
        emailAddress: 'john.smith@john.smith',
        fullName: 'John Smith',
        organisationName: 'Test organization',
        phoneNumber: '0044140000000',
      },
    });

    result = validateCarrierDetailSection({
      carrierAddressLine1: '',
      carrierAddressLine2: '',
      carrierContactName: '',
      carrierCountry: '',
      carrierContactEmail: '',
      carrierOrganisationName: '',
      carrierContactPhone: '',
      carrierPostcode: '',
      carrierTownCity: '',
    });

    expect(result.valid).toBe(true);
  });

  it('fails carrier section validation', () => {
    let result = validateCarrierDetailSection({
      carrierAddressLine1: '',
      carrierContactName: '',
      carrierCountry: '',
      carrierContactEmail: '',
      carrierOrganisationName: '',
      carrierContactPhone: '',
      carrierPostcode: '',
      carrierTownCity: '',
      carrierAddressLine2: 'line 2',
    });
    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Carrier organisation name',
        code: validation.errorCodes.carrierEmptyOrganisationName,
      },
      {
        field: 'Carrier address line 1',
        code: validation.errorCodes.carrierEmptyAddressLine1,
      },
      {
        field: 'Carrier town or city',
        code: validation.errorCodes.carrierEmptyTownOrCity,
      },
      {
        field: 'Carrier country',
        code: validation.errorCodes.carrierEmptyCountry,
      },
      {
        field: 'Carrier contact name',
        code: validation.errorCodes.carrierEmptyContactFullName,
      },
      {
        field: 'Carrier contact phone number',
        code: validation.errorCodes.carrierEmptyPhone,
      },
      {
        field: 'Carrier contact email address',
        code: validation.errorCodes.carrierEmptyEmail,
      },
    ]);

    result = validateCarrierDetailSection({
      carrierAddressLine1: '     ',
      carrierContactName: '     ',
      carrierCountry: '     ',
      carrierContactEmail: 'not_an_email',
      carrierOrganisationName: '     ',
      carrierContactPhone: '+123567578',
      carrierPostcode: 'AB1',
      carrierTownCity: '     ',
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Carrier organisation name',
        code: validation.errorCodes.carrierEmptyOrganisationName,
      },
      {
        field: 'Carrier address line 1',
        code: validation.errorCodes.carrierEmptyAddressLine1,
      },
      {
        field: 'Carrier town or city',
        code: validation.errorCodes.carrierEmptyTownOrCity,
      },
      {
        field: 'Carrier country',
        code: validation.errorCodes.carrierEmptyCountry,
      },
      {
        field: 'Carrier postcode',
        code: validation.errorCodes.carrierInvalidPostcode,
      },
      {
        field: 'Carrier contact name',
        code: validation.errorCodes.carrierEmptyContactFullName,
      },
      {
        field: 'Carrier contact phone number',
        code: validation.errorCodes.carrierInvalidPhone,
      },
      {
        field: 'Carrier contact email address',
        code: validation.errorCodes.carrierInvalidEmail,
      },
    ]);

    result = validateCarrierDetailSection({
      carrierAddressLine1: faker.string.sample(251),
      carrierAddressLine2: faker.string.sample(251),
      carrierContactName: faker.string.sample(251),
      carrierCountry: faker.string.sample(251),
      carrierContactEmail: faker.string.sample(251),
      carrierOrganisationName: faker.string.sample(251),
      carrierContactPhone: faker.string.sample(251),
      carrierPostcode: faker.string.sample(251),
      carrierTownCity: faker.string.sample(251),
    });

    expect(result.valid).toBe(false);

    expect(result.value).toEqual([
      {
        field: 'Carrier organisation name',
        code: validation.errorCodes.carrierCharTooManyOrganisationName,
      },
      {
        field: 'Carrier address line 1',
        code: validation.errorCodes.carrierCharTooManyAddressLine1,
      },
      {
        field: 'Carrier address line 2',
        code: validation.errorCodes.carrierCharTooManyAddressLine2,
      },
      {
        field: 'Carrier town or city',
        code: validation.errorCodes.carrierCharTooManyTownOrCity,
      },
      {
        field: 'Carrier country',
        code: validation.errorCodes.carrierInvalidCountry,
      },
      {
        field: 'Carrier postcode',
        code: validation.errorCodes.carrierInvalidPostcode,
      },
      {
        field: 'Carrier contact name',
        code: validation.errorCodes.carrierCharTooManyContactFullName,
      },
      {
        field: 'Carrier contact phone number',
        code: validation.errorCodes.carrierInvalidPhone,
      },
      {
        field: 'Carrier contact email address',
        code: validation.errorCodes.carrierInvalidEmail,
      },
    ]);
  });
});
