import { SICCode } from '@wts/api/reference-data';
import {
  validateBuildingNameOrNumber,
  validateReference,
  validateAddressLine1,
  validateAddressLine2,
  validateCountry,
  validateOrganisationName,
  validatePostcode,
  validateTownOrCity,
  validateAddressDetails,
  validateEmailAddress,
  validateFaxNumber,
  validateFullName,
  validatePhoneNumber,
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
    const result = validateReference(ref);
    expect(result.valid).toBe(true);
  });

  it('should return valid false when reference is empty', () => {
    const result = validateReference('');
    expect(result.valid).toBe(false);
  });

  it('should return the error message in English when the reference is empty', () => {
    const result = validateReference('', {
      locale: 'en',
      context: 'ui',
    });

    if ('message' in result) {
      expect(result.message).toBe('Enter a unique reference');
    }
  });
});

describe('Building name or number validation', () => {
  it('should return valid true when building name or number is valid', () => {
    const buildingName = faker.string.sample(10);
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
      expect(result.value).toBeUndefined();
    }
  });

  it('should return an error when the building name is too long - producer', () => {
    const buildingName = faker.string.sample(251);
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

  it('should return an error when the building name is too long - waste collection', () => {
    const buildingName = faker.string.sample(251);
    const result = validateBuildingNameOrNumber(
      buildingName,
      'Waste collection',
      {
        locale: 'en',
        context: 'ui',
      },
    );

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 12000,
        field: 'Waste collection building name or number',
        message: 'Building name or number must be less than 250 characters',
      });
    }
  });

  it('should return an error when the building name is too long - carrier', () => {
    const buildingName = faker.string.sample(251);
    const result = validateBuildingNameOrNumber(buildingName, 'Carrier', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 15000,
        field: 'Carrier building name or number',
        message: 'Building name or number must be less than 250 characters',
      });
    }
  });
});

describe('Address line 1 validation', () => {
  it('should return valid true when address line 1 is valid', () => {
    const addressLine1 = faker.string.sample(10);
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

  it('should return an error when the address line 1 is too long - producer', () => {
    const addressLine1 = faker.string.sample(251);
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

  it('should return an error when the address line 1 is too long - waste collection', () => {
    const addressLine1 = faker.string.sample(251);
    const result = validateAddressLine1(addressLine1, 'Waste collection', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 12004,
        field: 'Waste collection address line 1',
        message: 'Address line 1 must be less than 250 characters',
      });
    }
  });

  it('should return an error when the address line 1 is too long - Carrier', () => {
    const addressLine1 = faker.string.sample(251);
    const result = validateAddressLine1(addressLine1, 'Carrier', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 15004,
        field: 'Carrier address line 1',
        message: 'Address line 1 must be less than 250 characters',
      });
    }
  });
});

describe('Address line 2 validation', () => {
  it('should return valid true when address line 2 is valid', () => {
    const addressLine2 = faker.string.sample(10);
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

  it('should return an error when the address line 2 is too long - producer', () => {
    const addressLine2 = faker.string.sample(251);
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

  it('should return an error when the address line 2 is too long - Waste Collection', () => {
    const addressLine2 = faker.string.sample(251);
    const result = validateAddressLine2(addressLine2, 'Waste collection', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 12005,
        field: 'Waste collection address line 2',
        message: 'Address line 2 must be less than 250 characters',
      });
    }
  });

  it('should return an error when the address line 2 is too long - Carrier', () => {
    const addressLine2 = faker.string.sample(251);
    const result = validateAddressLine2(addressLine2, 'Carrier', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 15005,
        field: 'Carrier address line 2',
        message: 'Address line 2 must be less than 250 characters',
      });
    }
  });
});

describe('Town or city validation', () => {
  it('should return valid true when town or city is valid', () => {
    const townOrCity = faker.string.sample(10);
    const result = validateTownOrCity(townOrCity, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if ('message' in result) {
      expect(result.message).toBe(townOrCity);
    }
  });

  it('truncates trailing spaces', () => {
    const result = validateTownOrCity('  a   ', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toBe('a');
    }
  });

  it('should return an error when the town or city is too long', () => {
    const townOrCity = faker.string.sample(251);
    const result = validateTownOrCity(townOrCity, 'Producer', {
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

  it('should return an error when the town or city is too long', () => {
    const townOrCity = faker.string.sample(251);
    const result = validateTownOrCity(townOrCity, 'Waste collection', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 12007,
        field: 'Waste collection town or city',
        message: 'Town or city must be less than 250 characters',
      });
    }
  });
});

describe('Country validation', () => {
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

  it('should return an error when the country is empty - producer', () => {
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

  it('should return an error when the country is empty - waste collection', () => {
    const result = validateCountry('', 'Waste collection', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 12008,
        field: 'Waste collection country',
        message: 'Select a country',
      });
    }
  });

  it('should return an error when the country is empty - Carrier', () => {
    const result = validateCountry('', 'Carrier', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 15008,
        field: 'Carrier country',
        message: 'Select a country',
      });
    }
  });

  it('Should return an error if the country is not england, scotland, wales or NI - producer', () => {
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

  it('Should return an error if the country is not england, scotland, wales or NI - Waste collection', () => {
    const result = validateCountry('Algeria', 'Waste collection', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 12009,
        field: 'Waste collection country',
        message:
          'Country must only be England, Wales, Scotland, or Northern Ireland',
      });
    }
  });

  it('Should return an error if the country is not england, scotland, wales or NI - Carrier', () => {
    const result = validateCountry('Algeria', 'Carrier', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 15009,
        field: 'Carrier country',
        message:
          'Country must only be England, Wales, Scotland, or Northern Ireland',
      });
    }
  });
});

describe('Postcode validation', () => {
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

  it('should return an error when the postcode is empty - producer', () => {
    const result = validatePostcode('', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11010,
        field: 'Producer postcode',
        message: 'Enter a valid postcode',
      });
    }
  });

  it('should return an error when the postcode is empty - waste collection', () => {
    const result = validatePostcode('', 'Waste collection', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 12010,
        field: 'Waste collection postcode',
        message: 'Enter a valid postcode',
      });
    }
  });

  it('should return an error when the postcode is empty - carrier', () => {
    const result = validatePostcode('', 'Carrier', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 15010,
        field: 'Carrier postcode',
        message: 'Enter a valid postcode',
      });
    }
  });

  it('should return an error when the postcode is invalid - producer', () => {
    const result = validatePostcode('123', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11010,
        field: 'Producer postcode',
        message: 'Enter a valid postcode',
      });
    }
  });

  it('should return an error when the postcode is invalid - waste collection', () => {
    const result = validatePostcode('123', 'Waste collection', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 12010,
        field: 'Waste collection postcode',
        message: 'Enter a valid postcode',
      });
    }
  });

  it('should return an error when the postcode is invalid - carrier', () => {
    const result = validatePostcode('123', 'Carrier', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 15010,
        field: 'Carrier postcode',
        message: 'Enter a valid postcode',
      });
    }
  });
});

describe('Producer organisation name validation', () => {
  it('should return valid true when organisation name is valid', () => {
    const orgName = faker.string.sample(10);
    const result = validateOrganisationName(orgName, 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if ('message' in result) {
      expect(result.message).toBe(orgName);
    }
  });

  it('truncates trailing spaces', () => {
    const result = validateOrganisationName('  a   ', 'Producer', {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.value).toBe('a');
    }
  });

  it('should return an error when the organisation name is too long', () => {
    const orgName = faker.string.sample(251);
    const result = validateOrganisationName(orgName, 'Producer', {
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

describe('Address Details Validation', () => {
  it('should return valid true when all address details are valid', () => {
    const addressDetails = {
      buildingNameOrNumber: faker.string.sample(10),
      addressLine1: faker.string.sample(10),
      addressLine2: faker.string.sample(10),
      townCity: faker.string.sample(10),
      country: 'England',
      postcode: 'SW1A1AA',
    };

    const result = validateAddressDetails(addressDetails, 'Producer', true, {
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
      addressLine1: faker.string.sample(10),
      townCity: faker.string.sample(10),
      country: 'England',
      postcode: 'SW1A1AA',
    };

    const result = validateAddressDetails(addressDetails, 'Producer', true, {
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
      buildingNameOrNumber: faker.string.sample(10),
      addressLine1: faker.string.sample(10),
      addressLine2: faker.string.sample(10),
      townCity: faker.string.sample(10),
      country: 'England',
      postcode: '123',
    };

    const result = validateAddressDetails(addressDetails, 'Producer', true, {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
  });
});

describe('validatePartialProducerAddressDetails', () => {
  it('should return valid true when all address details are valid', () => {
    const addressDetails = {
      buildingNameOrNumber: faker.string.sample(10),
      addressLine1: faker.string.sample(10),
      addressLine2: faker.string.sample(10),
      townCity: faker.string.sample(10),
      country: 'England',
      postcode: 'SW1A1AA',
    };

    const result = validateAddressDetails(addressDetails, 'Producer', true, {
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
      townCity: faker.string.sample(10),
      country: 'England',
      postcode: 'SW1A1AA',
    };

    const result = validateAddressDetails(addressDetails, 'Producer', true, {
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
      buildingNameOrNumber: faker.string.sample(10),
      addressLine1: faker.string.sample(10),
      addressLine2: faker.string.sample(10),
      townCity: faker.string.sample(10),
      country: 'England',
      postcode: '123',
    };

    const result = validateAddressDetails(addressDetails, 'Producer', false, {
      locale: 'en',
      context: 'ui',
    });

    expect(result.valid).toBe(false);
  });
});

describe(`Producer's contact organisation name validation`, () => {
  it('should return valid true when organisation name is valid', () => {
    const result = validateOrganisationName('GroupexOOD', 'Producer');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when organisation name is empty', () => {
    const result = validateOrganisationName('', 'Producer', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11001,
        field: 'Producer organisation name',
        message: 'Enter an organisation name',
      });
    }
  });

  it('should return valid false when organisation name exceeds 250 characters', () => {
    const organisationName = faker.string.sample(251);
    const result = validateOrganisationName(organisationName, 'Producer', {
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

describe(`Producer's contact person validation`, () => {
  it('should return valid true when person is valid', () => {
    const result = validateFullName('Ivan Ivanov', 'Producer');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when person is empty', () => {
    const result = validateFullName('', 'Producer', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11011,
        field: 'Producer contact name',
        message: 'Enter an organisation contact person',
      });
    }
  });

  it('should return valid false when person exceeds 250 characters', () => {
    const producerContactPerson = faker.string.sample(251);
    const result = validateFullName(producerContactPerson, 'Producer', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11012,
        field: 'Producer contact name',
        message:
          'The organisation contact person can only be 250 characters or less',
      });
    }
  });
});

describe(`Producer's contact email validation`, () => {
  it('should return valid true when email is valid', () => {
    const result = validateEmailAddress('john@gmail.com', 'Producer');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when email is empty', () => {
    const result = validateEmailAddress('', 'Producer', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11015,
        field: 'Producer contact email address',
        message: 'Enter an email address',
      });
    }
  });

  it('should return valid false when email is invalid', () => {
    const result = validateEmailAddress('john123', 'Producer', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11016,
        field: 'Producer contact email address',
        message:
          'Enter an email address in the correct format, like name@example.com',
      });
    }
  });

  it('should return valid false when email exceeds 250 characters', () => {
    const producerContactEmail = faker.string.sample(251);
    const result = validateEmailAddress(producerContactEmail, 'Producer', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11017,
        field: 'Producer contact email address',
        message:
          'The organisation contact email can only be 250 characters or less',
      });
    }
  });
});

describe(`Producer's contact phone validation`, () => {
  it('should return valid true when phone is valid', () => {
    const result = validatePhoneNumber('01903230482', 'Producer');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when phone is empty', () => {
    const result = validatePhoneNumber('', 'Producer', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11013,
        field: 'Producer contact phone number',
        message: 'Enter a phone number',
      });
    }
  });

  it('should return valid false when phone is invalid', () => {
    const result = validatePhoneNumber('21315', 'Producer', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11014,
        field: 'Producer contact phone number',
        message:
          'Enter a phone number only using numbers, spaces, dashes, pluses and brackets',
      });
    }
  });
});

describe(`Producer's contact fax validation`, () => {
  it('should return valid true when fax is valid', () => {
    const result = validateFaxNumber('00-44 1234 567890', 'Producer');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when fax is invalid', () => {
    const result = validateFaxNumber('21315', 'Producer', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 11023,
        field: 'Producer fax number',
        message:
          'Enter a fax number only using numbers, spaces, dashes, pluses and brackets',
      });
    }
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

describe(`Receiver's organisation name validation`, () => {
  it('should return valid true when organisation name is valid', () => {
    const result = validateOrganisationName('GroupexOOD', 'Receiver');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when organisation name is empty', () => {
    const result = validateOrganisationName('', 'Receiver', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 13001,
        field: 'Receiver organisation name',
        message: 'Enter an organisation name',
      });
    }
  });

  it('should return valid false when organisation name exceeds 250 characters', () => {
    const organisationName = faker.string.sample(251);
    const result = validateOrganisationName(organisationName, 'Receiver', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 13002,
        field: 'Receiver organisation name',
        message: 'The organisation name can only be 250 characters or less',
      });
    }
  });
});

describe(`Receiver's contact person validation`, () => {
  it('should return valid true when person is valid', () => {
    const result = validateFullName('Ivan Ivanov', 'Receiver');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when person is empty', () => {
    const result = validateFullName('', 'Receiver', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 13011,
        field: 'Receiver contact name',
        message: 'Enter an organisation contact person',
      });
    }
  });

  it('should return valid false when person exceeds 250 characters', () => {
    const producerContactPerson = faker.string.sample(251);
    const result = validateFullName(producerContactPerson, 'Receiver', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 13012,
        field: 'Receiver contact name',
        message:
          'The organisation contact person can only be 250 characters or less',
      });
    }
  });
});

describe(`Receiver's contact email validation`, () => {
  it('should return valid true when email is valid', () => {
    const result = validateEmailAddress('john@gmail.com', 'Receiver');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when email is empty', () => {
    const result = validateEmailAddress('', 'Receiver', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 13015,
        field: 'Receiver contact email address',
        message: 'Enter an email address',
      });
    }
  });

  it('should return valid false when email is invalid', () => {
    const result = validateEmailAddress('john123', 'Receiver', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 13016,
        field: 'Receiver contact email address',
        message:
          'Enter an email address in the correct format, like name@example.com',
      });
    }
  });

  it('should return valid false when email exceeds 250 characters', () => {
    const producerContactEmail = faker.string.sample(251);
    const result = validateEmailAddress(producerContactEmail, 'Receiver', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 13017,
        field: 'Receiver contact email address',
        message:
          'The organisation contact email can only be 250 characters or less',
      });
    }
  });
});

describe(`Receiver's contact phone validation`, () => {
  it('should return valid true when phone is valid', () => {
    const result = validatePhoneNumber('01903230482', 'Receiver');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when phone is empty', () => {
    const result = validatePhoneNumber('', 'Receiver', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 13013,
        field: 'Receiver contact phone number',
        message: 'Enter a phone number',
      });
    }
  });

  it('should return valid false when phone is invalid', () => {
    const result = validatePhoneNumber('21315', 'Receiver', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 13014,
        field: 'Receiver contact phone number',
        message:
          'Enter a phone number only using numbers, spaces, dashes, pluses and brackets',
      });
    }
  });
});

describe(`Receiver's contact fax validation`, () => {
  it('should return valid true when fax is valid', () => {
    const result = validateFaxNumber('00-44 1234 567890', 'Receiver');
    expect(result.valid).toBe(true);
  });

  it('should return valid false when fax is invalid', () => {
    const result = validateFaxNumber('21315', 'Receiver', {
      locale: 'en',
      context: 'ui',
    });
    expect(result.valid).toBe(false);
    if ('errors' in result) {
      expect(result.errors[0]).toEqual({
        code: 13023,
        field: 'Receiver fax number',
        message:
          'Enter a fax number only using numbers, spaces, dashes, pluses and brackets',
      });
    }
  });
});
