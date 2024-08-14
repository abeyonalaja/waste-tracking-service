import { SICCode } from '@wts/api/reference-data';
import {
  validateBuildingNameOrNumber,
  validateProducerReference,
  validateAddressLine1,
  validateAddressLine2,
  validateCountry,
  validateProducerOrganisationName,
  validatePostcode,
  validateTownCity,
  validateAddressDetails,
  validateProducerContactEmail,
  validateProducerContactFax,
  validateProducerContactOrganisationName,
  validateProducerContactPerson,
  validateProducerContactPhone,
  validatePartialAddressDetails,
  validateWasteSourceSection,
  validateSicCodesSection,
} from './validation-rules';
import { faker } from '@faker-js/faker';

describe('Producer reference validation', () => {
  it.each([
    '123456789012',
    'asd-123',
    '123/123',
    '123\\123',
    '132_123',
    '3454   123',
    'ABC_01/02/2025',
  ])('should return valid true when reference is valid (%s)', (ref) => {
    const result = validateProducerReference(ref);
    expect(result.valid).toBe(true);
  });

  it('should return valid false when reference is empty', () => {
    const result = validateProducerReference('');
    expect(result.valid).toBe(false);
  });

  it('should return the error message in English when the reference is empty', () => {
    const result = validateProducerReference('', {
      locale: 'en',
      context: 'ui',
    });

    if ('message' in result) {
      expect(result.message).toBe('Enter a unique reference');
    }
  });
});

describe('Producer building name or number validation', () => {
  it('should return valid true when building name or number is valid', () => {
    const buildingName = faker.datatype.string(10);
    const result = validateBuildingNameOrNumber(buildingName, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if ('message' in result) {
      expect(result.message).toBe(buildingName);
    }
  });

  it('truncates trailing spaces', () => {
    const result = validateBuildingNameOrNumber('  a   ', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toBe('a');
    }
  });

  it('truncates and returns valid when only spaces are entered', () => {
    const result = validateBuildingNameOrNumber('   ', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toBe('');
    }
  });

  it('should return an error when the building name is too long', () => {
    const buildingName = faker.datatype.string(251);
    const result = validateBuildingNameOrNumber(buildingName, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11000,
        field: 'Producer building name or number',
        message: 'Building name or number must be less than 250 characters',
      });
    }
  });
});

describe('Producer address line 1 validation', () => {
  it('should return valid true when address line 1 is valid', () => {
    const addressLine1 = faker.datatype.string(10);
    const result = validateAddressLine1(addressLine1, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if ('message' in result) {
      expect(result.message).toBe(addressLine1);
    }
  });

  it('truncates trailing spaces', () => {
    const result = validateAddressLine1('  a   ', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toBe('a');
    }
  });

  it('should return an error when the address line 1 is too long', () => {
    const addressLine1 = faker.datatype.string(251);
    const result = validateAddressLine1(addressLine1, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11004,
        field: 'Producer address line 1',
        message: 'Address line 1 must be less than 250 characters',
      });
    }
  });
});

describe('Producer address line 2 validation', () => {
  it('should return valid true when address line 2 is valid', () => {
    const addressLine2 = faker.datatype.string(10);
    const result = validateAddressLine2(addressLine2, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if ('message' in result) {
      expect(result.message).toBe(addressLine2);
    }
  });

  it('truncates trailing spaces', () => {
    const result = validateAddressLine2('  a   ', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toBe('a');
    }
  });

  it('should return an error when the address line 2 is too long', () => {
    const addressLine2 = faker.datatype.string(251);
    const result = validateAddressLine2(addressLine2, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11005,
        field: 'Producer address line 2',
        message: 'Address line 2 must be less than 250 characters',
      });
    }
  });
});

describe('Producer town or city validation', () => {
  it('should return valid true when town or city is valid', () => {
    const townOrCity = faker.datatype.string(10);
    const result = validateTownCity(townOrCity, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if ('message' in result) {
      expect(result.message).toBe(townOrCity);
    }
  });

  it('truncates trailing spaces', () => {
    const result = validateTownCity('  a   ', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toBe('a');
    }
  });

  it('should return an error when the town or city is too long', () => {
    const townOrCity = faker.datatype.string(251);
    const result = validateTownCity(townOrCity, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11007,
        field: 'Producer town or city',
        message: 'Town or city must be less than 250 characters',
      });
    }
  });
});

describe('Producer country validation', () => {
  it('should return valid true when country is valid', () => {
    const country = 'England';
    const result = validateCountry(country, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if ('message' in result) {
      expect(result.message).toBe(country);
    }
  });

  it('should return an error when the country is empty', () => {
    const result = validateCountry('', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11008,
        field: 'Producer country',
        message: 'Select a country',
      });
    }
  });
  it('Should return an error if the country is not england, scotland, wales or NI', () => {
    const result = validateCountry('Algeria', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11009,
        field: 'Producer country',
        message:
          'Country must only be England, Wales, Scotland, or Northern Ireland',
      });
    }
  });
});

describe('Producer postcode validation', () => {
  it('should return valid true when postcode is valid', () => {
    const postcode = 'SW1A1AA';
    const result = validatePostcode(postcode, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if ('message' in result) {
      expect(result.message).toBe(postcode);
    }
  });

  it('should return an error when the postcode is empty', () => {
    const result = validatePostcode('', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11010,
        field: 'Producer postcode',
        message: 'Enter a real postcode',
      });
    }
  });

  it('should return an error when the postcode is invalid', () => {
    const result = validatePostcode('123', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11010,
        field: 'Producer postcode',
        message: 'Enter a real postcode',
      });
    }
  });
});

describe('Producer organisation name validation', () => {
  it('should return valid true when organisation name is valid', () => {
    const orgName = faker.datatype.string(10);
    const result = validateProducerOrganisationName(orgName, {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if ('message' in result) {
      expect(result.message).toBe(orgName);
    }
  });

  it('truncates trailing spaces', () => {
    const result = validateProducerOrganisationName('  a   ', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toBe('a');
    }
  });

  it('should return an error when the organisation name is too long', () => {
    const orgName = faker.datatype.string(251);
    const result = validateProducerOrganisationName(orgName, {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11002,
        field: 'Producer organisation name',
        message: 'The organisation name can only be 250 characters or less',
      });
    }
  });
});

describe('Producer Address Details Validation', () => {
  it('should return valid true when all address details are valid', () => {
    const addressDetails = {
      buildingNameOrNumber: faker.datatype.string(10),
      addressLine1: faker.datatype.string(10),
      addressLine2: faker.datatype.string(10),
      townCity: faker.datatype.string(10),
      country: 'England',
      postcode: 'SW1A1AA',
    };

    const result = validateAddressDetails(addressDetails, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toEqual(addressDetails);
    }
  });

  it('should return valid true when an optional field is missing', () => {
    const addressDetails = {
      addressLine1: faker.datatype.string(10),
      townCity: faker.datatype.string(10),
      country: 'England',
      postcode: 'SW1A1AA',
    };

    const result = validateAddressDetails(addressDetails, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toEqual(addressDetails);
    }
  });

  it('should return valid false when any address detail is invalid', () => {
    const addressDetails = {
      buildingNameOrNumber: faker.datatype.string(10),
      addressLine1: faker.datatype.string(10),
      addressLine2: faker.datatype.string(10),
      townCity: faker.datatype.string(10),
      country: 'England',
      postcode: '123',
    };

    const result = validateAddressDetails(addressDetails, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
  });
});

describe('validatePartialProducerAddressDetails', () => {
  it('should return valid true when all address details are valid', () => {
    const addressDetails = {
      buildingNameOrNumber: faker.datatype.string(10),
      addressLine1: faker.datatype.string(10),
      addressLine2: faker.datatype.string(10),
      townCity: faker.datatype.string(10),
      country: 'England',
      postcode: 'SW1A1AA',
    };

    const result = validatePartialAddressDetails(addressDetails, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toEqual(addressDetails);
    }
  });

  it('should return valid true when a mandatory field is missing', () => {
    const addressDetails = {
      townCity: faker.datatype.string(10),
      country: 'England',
      postcode: 'SW1A1AA',
    };

    const result = validatePartialAddressDetails(addressDetails, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toEqual(addressDetails);
    }
  });

  it('should return valid false when any address detail is invalid', () => {
    const addressDetails = {
      buildingNameOrNumber: faker.datatype.string(10),
      addressLine1: faker.datatype.string(10),
      addressLine2: faker.datatype.string(10),
      townCity: faker.datatype.string(10),
      country: 'England',
      postcode: '123',
    };

    const result = validatePartialAddressDetails(addressDetails, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
  });
});

describe(`Producer's contact person validation`, () => {
  it('should return valid true when organisation name is valid', () => {
    const result = validateProducerContactOrganisationName('GroupexOOD');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when organisation name is empty', () => {
    const result = validateProducerContactOrganisationName();
    expect(result.valid).toBe(false);
  });

  it('should return valid false when organisation name exceeds 250 characters', () => {
    const organisationName = faker.string.sample(251);
    const result = validateProducerContactOrganisationName(organisationName);
    expect(result.valid).toBe(false);
  });
});

describe(`Producer's contact person validation`, () => {
  it('should return valid true when person is valid', () => {
    const result = validateProducerContactPerson('Ivan Ivanov');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when person is empty', () => {
    const result = validateProducerContactPerson();
    expect(result.valid).toBe(false);
  });

  it('should return valid false when person exceeds 250 characters', () => {
    const producerContactPerson = faker.string.sample(251);
    const result = validateProducerContactPerson(producerContactPerson);
    expect(result.valid).toBe(false);
  });
});

describe(`Producer's contact email validation`, () => {
  it('should return valid true when email is valid', () => {
    const result = validateProducerContactEmail('john@gmail.com');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when email is empty', () => {
    const result = validateProducerContactEmail();
    expect(result.valid).toBe(false);
  });

  it('should return valid false when email is invalid', () => {
    const result = validateProducerContactEmail('john123');
    expect(result.valid).toBe(false);
  });

  it('should return valid false when email exceeds 250 characters', () => {
    const producerContactEmail = faker.string.sample(251);
    const result = validateProducerContactEmail(producerContactEmail);
    expect(result.valid).toBe(false);
  });
});

describe(`Producer's contact phone validation`, () => {
  it('should return valid true when phone is valid', () => {
    const result = validateProducerContactPhone('01903230482');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when phone is empty', () => {
    const result = validateProducerContactPhone();
    expect(result.valid).toBe(false);
  });

  it('should return valid false when phone is invalid', () => {
    const result = validateProducerContactPhone('21315');
    expect(result.valid).toBe(false);
  });
});

describe(`Producer's contact fax validation`, () => {
  it('should return valid true when fax is valid', () => {
    const result = validateProducerContactFax('00-44 1234 567890');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when fax is invalid', () => {
    const result = validateProducerContactFax('21315');
    expect(result.valid).toBe(false);
  });
});

describe(`Waste source`, () => {
  it('should return valid true when wasteSource is valid', () => {
    const result = validateWasteSourceSection('Industrial');
    expect(result.valid).toBe(true);
  });

  it('should return valid true when wasteSource is different string versions of construction and demolition', () => {
    const result = validateWasteSourceSection('Construction And Demolition');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when waste source is missing', () => {
    const result = validateWasteSourceSection('');
    expect(result.valid).toBe(false);
  });

  it('should return valid false when waste source is invalid', () => {
    const result = validateWasteSourceSection('Public');
    expect(result.valid).toBe(false);
  });
});

describe(`Producer Standard Industrial Classification (SIC) code`, () => {
  it('should return valid true when SIC code is valid', () => {
    const value = '01140';
    const draftSicCodesList: string[] = ['01110', '01120', '01130'];
    const sicCodesList: SICCode[] = [
      {
        code: '01110',
        description: {
          en: 'Growing of cereals (except rice), leguminous crops and oil seeds',
          cy: 'Tyfu grawn (heblaw rîs), cnydau llygadlys a hadau olew',
        },
      },
      {
        code: '01120',
        description: {
          en: 'Growing of rice',
          cy: 'Tyfu rîs',
        },
      },
      {
        code: '01130',
        description: {
          en: 'Growing of vegetables and melons, roots and tubers',
          cy: 'Tyfu llysiau a melynnau, gwreiddiau a thwberau',
        },
      },
      {
        code: '01140',
        description: {
          en: 'Growing of sugar cane',
          cy: 'Tyfu siwgr',
        },
      },
      {
        code: '01150',
        description: {
          en: 'Growing of tobacco',
          cy: 'Tyfu tybaco',
        },
      },
      {
        code: '01160',
        description: {
          en: 'Growing of fibre crops',
          cy: 'Tyfu cnydau ffibr',
        },
      },
      {
        code: '01190',
        description: {
          en: 'Growing of other non-perennial crops',
          cy: 'Tyfu cnydau anhynodol eraill',
        },
      },
    ];

    const result = validateSicCodesSection(
      value,
      draftSicCodesList,
      sicCodesList,
    );
    expect(result.valid).toBe(true);
  });

  it('should return valid false when SIC code is not found in the reference data set', () => {
    const value = '01140';
    const draftSicCodesList: string[] = ['01110', '01120', '01130'];
    const sicCodesList: SICCode[] = [
      {
        code: '01110',
        description: {
          en: 'Growing of cereals (except rice), leguminous crops and oil seeds',
          cy: 'Tyfu grawn (heblaw rîs), cnydau llygadlys a hadau olew',
        },
      },
      {
        code: '01120',
        description: {
          en: 'Growing of rice',
          cy: 'Tyfu rîs',
        },
      },
      {
        code: '01130',
        description: {
          en: 'Growing of vegetables and melons, roots and tubers',
          cy: 'Tyfu llysiau a melynnau, gwreiddiau a thwberau',
        },
      },
      {
        code: '01150',
        description: {
          en: 'Growing of tobacco',
          cy: 'Tyfu tybaco',
        },
      },
      {
        code: '01160',
        description: {
          en: 'Growing of fibre crops',
          cy: 'Tyfu cnydau ffibr',
        },
      },
      {
        code: '01190',
        description: {
          en: 'Growing of other non-perennial crops',
          cy: 'Tyfu cnydau anhynodol eraill',
        },
      },
    ];

    const result = validateSicCodesSection(
      value,
      draftSicCodesList,
      sicCodesList,
    );
    expect(result.valid).toBe(false);
  });

  it('should return valid false when SIC code in the draft record already exists in the current sic code collection of the draft', () => {
    const value = '01140';
    const draftSicCodesList: string[] = ['01110', '01120', '01140'];
    const sicCodesList: SICCode[] = [
      {
        code: '01110',
        description: {
          en: 'Growing of cereals (except rice), leguminous crops and oil seeds',
          cy: 'Tyfu grawn (heblaw rîs), cnydau llygadlys a hadau olew',
        },
      },
      {
        code: '01120',
        description: {
          en: 'Growing of rice',
          cy: 'Tyfu rîs',
        },
      },
      {
        code: '01130',
        description: {
          en: 'Growing of vegetables and melons, roots and tubers',
          cy: 'Tyfu llysiau a melynnau, gwreiddiau a thwberau',
        },
      },
      {
        code: '01140',
        description: {
          en: 'Growing of sugar cane',
          cy: 'Tyfu siwgr',
        },
      },
      {
        code: '01150',
        description: {
          en: 'Growing of tobacco',
          cy: 'Tyfu tybaco',
        },
      },
      {
        code: '01160',
        description: {
          en: 'Growing of fibre crops',
          cy: 'Tyfu cnydau ffibr',
        },
      },
      {
        code: '01190',
        description: {
          en: 'Growing of other non-perennial crops',
          cy: 'Tyfu cnydau anhynodol eraill',
        },
      },
    ];

    const result = validateSicCodesSection(
      value,
      draftSicCodesList,
      sicCodesList,
    );
    expect(result.valid).toBe(false);
  });

  it('should return valid false when SIC code is empty', () => {
    const value = '';
    const draftSicCodesList: string[] = ['01110', '01120', '01140'];
    const sicCodesList: SICCode[] = [
      {
        code: '01110',
        description: {
          en: 'Growing of cereals (except rice), leguminous crops and oil seeds',
          cy: 'Tyfu grawn (heblaw rîs), cnydau llygadlys a hadau olew',
        },
      },
      {
        code: '01120',
        description: {
          en: 'Growing of rice',
          cy: 'Tyfu rîs',
        },
      },
      {
        code: '01130',
        description: {
          en: 'Growing of vegetables and melons, roots and tubers',
          cy: 'Tyfu llysiau a melynnau, gwreiddiau a thwberau',
        },
      },
      {
        code: '01140',
        description: {
          en: 'Growing of sugar cane',
          cy: 'Tyfu siwgr',
        },
      },
      {
        code: '01150',
        description: {
          en: 'Growing of tobacco',
          cy: 'Tyfu tybaco',
        },
      },
      {
        code: '01160',
        description: {
          en: 'Growing of fibre crops',
          cy: 'Tyfu cnydau ffibr',
        },
      },
      {
        code: '01190',
        description: {
          en: 'Growing of other non-perennial crops',
          cy: 'Tyfu cnydau anhynodol eraill',
        },
      },
    ];

    const result = validateSicCodesSection(
      value,
      draftSicCodesList,
      sicCodesList,
    );
    expect(result.valid).toBe(false);
  });
});
