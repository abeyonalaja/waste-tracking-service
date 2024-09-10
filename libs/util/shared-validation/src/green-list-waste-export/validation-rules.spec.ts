import { faker } from '@faker-js/faker';
import {
  validateCollectionDateType,
  validateEwcCodes,
  validateNationalCode,
  validateUkExitLocation,
  validateWasteCode,
  validateWasteDecription,
  validateImporterDetailAndTransitCountriesCross,
  validateTransitCountries,
  validateOrganisationName,
  validateAddress,
  validateAddressLine1,
  validateAddressLine2,
  validatePostcode,
  validateTownOrCity,
  validateFullName,
  validateEmailAddress,
  validatePhoneNumber,
  validateFaxNumber,
  validateCountry,
  validateCarrierMeansOfTransportDetails,
  validateCarrierMeansOfTransport,
} from './validation-rules';
import { UkExitLocationChar } from './constraints';
import * as errorMessages from './error-messages';
import { submission } from '@wts/api/green-list-waste-export';
import { ImporterDetail } from './model';
import { Section } from './dto';
import { commonConstraints, commonValidationRules } from '../common';

const wasteCodes = [
  {
    type: 'BaselAnnexIX',
    values: [
      {
        code: 'B1010',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'OECD',
    values: [
      {
        code: 'GB040',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'AnnexIIIA',
    values: [
      {
        code: 'B1010 and B1050',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'AnnexIIIB',
    values: [
      {
        code: 'BEU04',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
];

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

const countries = [
  {
    name: 'Afghanistan [AF]',
  },
  {
    name: 'France [FR]',
  },
  {
    name: 'Belgium [BE]',
  },
  {
    name: 'Burkina Faso [BF]',
  },
  {
    name: 'Åland Islands [AX]',
  },
];

const countriesIncludingUk = [
  {
    name: 'Afghanistan [AF]',
  },
  {
    name: 'France [FR]',
  },
  {
    name: 'Belgium [BE]',
  },
  {
    name: 'Burkina Faso [BF]',
  },
  {
    name: 'Åland Islands [AX]',
  },
  {
    name: 'United Kingdom (England) [GB-ENG]',
  },
];

const locale = 'en';
const context = 'api';

describe(validateWasteCode, () => {
  it('passes WasteCode validation', async () => {
    let response = validateWasteCode('B1010', 'BaselAnnexIX', wasteCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        type: 'BaselAnnexIX',
        code: 'B1010',
      });
    }

    response = validateWasteCode('GB040', 'OECD', wasteCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        type: 'OECD',
        code: 'GB040',
      });
    }

    response = validateWasteCode('B1010; B1050', 'AnnexIIIA', wasteCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        type: 'AnnexIIIA',
        code: 'B1010 and B1050',
      });
    }

    response = validateWasteCode('BEU04', 'AnnexIIIB', wasteCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        type: 'AnnexIIIB',
        code: 'BEU04',
      });
    }

    response = validateWasteCode('', 'NotApplicable', []);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        type: 'NotApplicable',
      });
    }
  });

  it('fails WasteCode validation', async () => {
    let type: submission.WasteDescription['wasteCode']['type'] = 'BaselAnnexIX';
    let response = validateWasteCode(
      'B9999',
      type,
      wasteCodes,
      locale,
      context,
    );
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidWasteCode[type][locale][context],
          },
        ],
      });
    }

    type = 'OECD';
    response = validateWasteCode('GB999', type, wasteCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidWasteCode[type][locale][context],
          },
        ],
      });
    }

    type = 'AnnexIIIA';
    response = validateWasteCode('B1010;B9999', type, wasteCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidWasteCode[type][locale][context],
          },
        ],
      });
    }

    response = validateWasteCode('1010;B1050', type, wasteCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidWasteCode[type][locale][context],
          },
        ],
      });
    }

    type = 'AnnexIIIB';
    response = validateWasteCode('BEU99', type, wasteCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidWasteCode[type][locale][context],
          },
        ],
      });
    }
  });
});

describe(validateEwcCodes, () => {
  it('passes EwcCodes validation', async () => {
    let response = validateEwcCodes(['010101'], ewcCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual([
        {
          code: '010101',
        },
      ]);
    }

    response = validateEwcCodes(['010101', '010102'], ewcCodes);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual([
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ]);
    }
  });

  it('fails EwcCodes validation', async () => {
    let response = validateEwcCodes([], ewcCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.emptyEwcCodes[locale][context],
          },
        ],
      });
    }

    response = validateEwcCodes(
      ['010101', '010102', '010101', '010102', '010101', '010102'],
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.tooManyEwcCodes[locale][context],
          },
        ],
      });
    }

    response = validateEwcCodes(['010101', '999999'], ewcCodes);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidEwcCodes[locale][context],
          },
        ],
      });
    }
  });
});

describe(validateNationalCode, () => {
  it('passes NationalCode validation', async () => {
    let response = validateNationalCode('123456');
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        provided: 'Yes',
        value: '123456',
      });
    }

    response = validateNationalCode('');
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        provided: 'No',
      });
    }

    response = validateNationalCode('A-123');
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        provided: 'Yes',
        value: 'A-123',
      });
    }
  });

  it('fails NationalCode validation', async () => {
    const response = validateNationalCode('*****');
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.invalidNationalCode[locale][context],
          },
        ],
      });
    }
  });
});

describe(validateWasteDecription, () => {
  it('passes WasteDescription validation', async () => {
    const response = validateWasteDecription('test');
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual('test');
    }
  });

  it('fails WasteDescription validation', async () => {
    let response = validateWasteDecription(faker.string.sample(120));
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.charTooManyWasteDescription[locale][context],
          },
        ],
      });
    }

    response = validateWasteDecription('');
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.emptyWasteDescription[locale][context],
          },
        ],
      });
    }

    response = validateWasteDecription(' ');
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteDescription',
            message: errorMessages.charTooFewWasteDescription[locale][context],
          },
        ],
      });
    }
  });
});

describe(validateCollectionDateType, () => {
  it.each(['actual', 'estimate'])(
    'should return valid for valid types (%s)',
    (value) => {
      const result = validateCollectionDateType(value);
      expect(result.valid).toBe(true);

      if (result.valid) {
        expect(result.value).toEqual(
          value === 'actual' ? 'ActualDate' : 'EstimateDate',
        );
      }
    },
  );

  it.each(['', '      ', 'abc'])(
    'should return invalid for invalid vlues (%s)',
    (value) => {
      const result = validateCollectionDateType(value);
      expect(result.valid).toBe(false);

      if (!result.valid) {
        expect(result.errors).toEqual(['invalid']);
      }
    },
  );
});

describe(validateOrganisationName, () => {
  it.each([
    {
      organisationName: ' Test organisation 1 ',
      section: 'ExporterDetail' as Section,
    },
    {
      organisationName: 'Test organisation 2',
      section: 'ImporterDetail' as Section,
    },
    {
      organisationName: 'Test organisation 3',
      section: 'CollectionDetail' as Section,
    },
    {
      organisationName: 'Test organisation 4',
      section: 'Carriers' as Section,
      index: 1,
    },
    {
      organisationName: 'Test organisation 5',
      section: 'Carriers' as Section,
      index: 2,
    },
    {
      organisationName: 'Test organisation 6',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      organisationName: 'Test organisation 7',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      organisationName: 'Test organisation 8',
      section: 'RecoveryFacilityDetail' as Section,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      organisationName: 'Test organisation 9',
      section: 'RecoveryFacilityDetail' as Section,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'passes OrganisationName validation (%s)',
    async ({ organisationName, section, index, recoveryFacilityType }) => {
      const response = validateOrganisationName(
        organisationName,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(true);
      if (response.valid) {
        expect(response.value).toEqual(organisationName.trim());
      }
    },
  );

  it.each([
    {
      organisationName: faker.string.sample(251),
      section: 'ExporterDetail' as Section,
    },
    {
      organisationName: '',
      section: 'ImporterDetail' as Section,
    },
    {
      organisationName: '     ',
      section: 'CollectionDetail' as Section,
    },
    {
      organisationName: undefined,
      section: 'Carriers' as Section,
      index: 1,
    },
    {
      organisationName: faker.string.sample(251),
      section: 'Carriers' as Section,
      index: 2,
    },
    {
      organisationName: '',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      organisationName: '     ',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      organisationName: undefined,
      section: 'RecoveryFacilityDetail' as Section,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      organisationName: faker.string.sample(251),
      section: 'RecoveryFacilityDetail' as Section,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'fails OrganisationName validation (%s)',
    async ({ organisationName, section, index, recoveryFacilityType }) => {
      const response = validateOrganisationName(
        organisationName,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        expect(response.errors).toEqual(
          organisationName &&
            organisationName.length > commonConstraints.FreeTextChar.max
            ? {
                fieldFormatErrors: [
                  {
                    field: section,
                    message: errorMessages.charTooManyOrganisationName(
                      section,
                      index,
                      recoveryFacilityType,
                    )[locale][context],
                  },
                ],
              }
            : {
                fieldFormatErrors: [
                  {
                    field: section,
                    message: errorMessages.emptyOrganisationName(
                      section,
                      index,
                      recoveryFacilityType,
                    )[locale][context],
                  },
                ],
              },
        );
      }
    },
  );
});

describe(validateAddress, () => {
  it.each([
    {
      address: ' Test address 1 ',
      section: 'ImporterDetail' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
    },
    {
      address: 'Test address 2',
      section: 'Carriers' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: 1,
    },
    {
      address: 'Test address 3',
      section: 'Carriers' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: 2,
    },
    {
      address: 'Test address 4',
      section: 'RecoveryFacilityDetail' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      address: 'Test address 5',
      section: 'RecoveryFacilityDetail' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      address: 'Test address 6',
      section: 'RecoveryFacilityDetail' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      address: 'Test address 7',
      section: 'RecoveryFacilityDetail' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'passes Address validation (%s)',
    async ({ address, section, index, recoveryFacilityType }) => {
      const response = validateAddress(
        address,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(true);
      if (response.valid) {
        expect(response.value).toEqual(address.trim());
      }
    },
  );

  it.each([
    {
      address: '',
      section: 'ImporterDetail' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
    },
    {
      address: undefined,
      section: 'Carriers' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: 1,
    },
    {
      address: faker.string.sample(251),
      section: 'Carriers' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: 2,
    },
    {
      address: '',
      section: 'RecoveryFacilityDetail' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      address: '     ',
      section: 'RecoveryFacilityDetail' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      address: undefined,
      section: 'RecoveryFacilityDetail' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      address: faker.string.sample(251),
      section: 'RecoveryFacilityDetail' as Exclude<
        Section,
        'ExporterDetail' | 'CollectionDetail'
      >,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'fails Address validation (%s)',
    async ({ address, section, index, recoveryFacilityType }) => {
      const response = validateAddress(
        address,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        expect(response.errors).toEqual(
          address && address.length > commonConstraints.FreeTextChar.max
            ? {
                fieldFormatErrors: [
                  {
                    field: section,
                    message: errorMessages.charTooManyAddress(
                      section,
                      index,
                      recoveryFacilityType,
                    )[locale][context],
                  },
                ],
              }
            : {
                fieldFormatErrors: [
                  {
                    field: section,
                    message: errorMessages.emptyAddress(
                      section,
                      index,
                      recoveryFacilityType,
                    )[locale][context],
                  },
                ],
              },
        );
      }
    },
  );
});

describe(validateAddressLine1, () => {
  it.each([
    {
      addressLine1: ' Test address 1 ',
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      addressLine1: 'Test address 2',
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
  ])(
    'passes AddressLine1 validation (%s)',
    async ({ addressLine1, section }) => {
      const response = validateAddressLine1(
        addressLine1,
        section,
        locale,
        context,
      );
      expect(response.valid).toEqual(true);
      if (response.valid) {
        expect(response.value).toEqual(addressLine1.trim());
      }
    },
  );

  it.each([
    {
      addressLine1: '',
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      addressLine1: undefined,
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      addressLine1: faker.string.sample(251),
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      addressLine1: '     ',
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
  ])(
    'fails AddressLine1 validation (%s)',
    async ({ addressLine1, section }) => {
      const response = validateAddressLine1(
        addressLine1,
        section,
        locale,
        context,
      );
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        expect(response.errors).toEqual(
          addressLine1 &&
            addressLine1.length > commonConstraints.FreeTextChar.max
            ? {
                fieldFormatErrors: [
                  {
                    field: section,
                    message:
                      errorMessages.charTooManyAddressLine1(section)[locale][
                        context
                      ],
                  },
                ],
              }
            : {
                fieldFormatErrors: [
                  {
                    field: section,
                    message:
                      errorMessages.emptyAddressLine1(section)[locale][context],
                  },
                ],
              },
        );
      }
    },
  );
});

describe(validateAddressLine2, () => {
  it.each([
    {
      addressLine2: ' Test address 1 ',
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      addressLine2: 'Test address 2',
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      addressLine2: '',
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      addressLine2: undefined,
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      addressLine2: '     ',
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
  ])(
    'passes AddressLine2 validation (%s)',
    async ({ addressLine2, section }) => {
      const response = validateAddressLine2(
        addressLine2,
        section,
        locale,
        context,
      );
      expect(response.valid).toEqual(true);
      if (response.valid) {
        const trimmedAddressLine2 = addressLine2?.trim();
        expect(response.value).toEqual(
          !trimmedAddressLine2 ? undefined : trimmedAddressLine2,
        );
      }
    },
  );

  it.each([
    {
      addressLine2: faker.string.sample(251),
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      addressLine2: faker.string.sample(251),
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
  ])(
    'fails AddressLine2 validation (%s)',
    async ({ addressLine2, section }) => {
      const response = validateAddressLine2(
        addressLine2,
        section,
        locale,
        context,
      );
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        expect(response.errors).toEqual({
          fieldFormatErrors: [
            {
              field: section,
              message:
                errorMessages.charTooManyAddressLine2(section)[locale][context],
            },
          ],
        });
      }
    },
  );
});

describe(validatePostcode, () => {
  it.each([
    {
      postcode: 'EC2N4AY',
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      postcode: undefined,
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      postcode: 'EC2N 4AY',
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      postcode: '',
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      postcode: '     ',
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
  ])('passes Postcode validation (%s)', async ({ postcode, section }) => {
    const response = validatePostcode(postcode, section, locale, context);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      const trimmedPostcode = postcode?.trim();
      expect(response.value).toEqual(
        !trimmedPostcode ? undefined : trimmedPostcode,
      );
    }
  });

  it.each([
    {
      postcode: faker.string.sample(10),
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      postcode: '123',
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
  ])('fails Postcode validation (%s)', async ({ postcode, section }) => {
    const response = validatePostcode(postcode, section, locale, context);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual({
        fieldFormatErrors: [
          {
            field: section,
            message: errorMessages.invalidPostcode(section)[locale][context],
          },
        ],
      });
    }
  });
});

describe(validateTownOrCity, () => {
  it.each([
    {
      townOrCity: ' Test town ',
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      townOrCity: 'Test city',
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
  ])('passes TownOrCity validation (%s)', async ({ townOrCity, section }) => {
    const response = validateTownOrCity(townOrCity, section, locale, context);
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual(townOrCity.trim());
    }
  });

  it.each([
    {
      townOrCity: '',
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      townOrCity: undefined,
      section: 'ExporterDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      townOrCity: faker.string.sample(251),
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
    {
      townOrCity: '     ',
      section: 'CollectionDetail' as Exclude<
        Section,
        'ImporterDetail' | 'Carriers' | 'RecoveryFacilityDetail'
      >,
    },
  ])('fails TownOrCity validation (%s)', async ({ townOrCity, section }) => {
    const response = validateTownOrCity(townOrCity, section, locale, context);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      expect(response.errors).toEqual(
        townOrCity && townOrCity.length > commonConstraints.FreeTextChar.max
          ? {
              fieldFormatErrors: [
                {
                  field: section,
                  message:
                    errorMessages.charTooManyTownOrCity(section)[locale][
                      context
                    ],
                },
              ],
            }
          : {
              fieldFormatErrors: [
                {
                  field: section,
                  message:
                    errorMessages.emptyTownOrCity(section)[locale][context],
                },
              ],
            },
      );
    }
  });
});

describe(validateCountry, () => {
  it.each([
    {
      country: ' Scotland ',
      section: 'ExporterDetail' as Section,
    },
    {
      country: ' France ',
      section: 'ImporterDetail' as Section,
      countryList: countries,
    },
    {
      country: 'England',
      section: 'CollectionDetail' as Section,
    },
    {
      country: 'England',
      section: 'Carriers' as Section,
      countryList: countriesIncludingUk,
      index: 1,
    },
    {
      country: 'Belgium',
      section: 'Carriers' as Section,
      countryList: countriesIncludingUk,
      index: 2,
    },
    {
      country: 'Burkina Faso',
      section: 'RecoveryFacilityDetail' as Section,
      countryList: countries,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      country: 'Afghanistan',
      section: 'RecoveryFacilityDetail' as Section,
      countryList: countries,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      country: 'Afghanistan',
      section: 'RecoveryFacilityDetail' as Section,
      countryList: countries,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      country: 'France',
      section: 'RecoveryFacilityDetail' as Section,
      countryList: countries,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'passes Country validation (%s)',
    async ({ country, section, countryList, index, recoveryFacilityType }) => {
      const response = validateCountry(
        country,
        section,
        locale,
        context,
        countryList,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(true);
      if (response.valid) {
        expect(response.value).toBeDefined();
      }
    },
  );

  it.each([
    {
      phoneNumber: faker.string.sample(30),
      section: 'ExporterDetail' as Section,
    },
    {
      phoneNumber: '',
      section: 'ImporterDetail' as Section,
      countryList: countries,
    },
    {
      phoneNumber: faker.string.sample(30),
      section: 'CollectionDetail' as Section,
    },
    {
      phoneNumber: undefined,
      section: 'Carriers' as Section,
      countryList: countriesIncludingUk,
      index: 1,
    },
    {
      phoneNumber: 'test',
      section: 'Carriers' as Section,
      countryList: countriesIncludingUk,
      index: 2,
    },
    {
      phoneNumber: '',
      section: 'RecoveryFacilityDetail' as Section,
      countryList: countries,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      phoneNumber: '     ',
      section: 'RecoveryFacilityDetail' as Section,
      countryList: countries,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      phoneNumber: undefined,
      section: 'RecoveryFacilityDetail' as Section,
      countryList: countries,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      phoneNumber: faker.string.sample(30),
      section: 'RecoveryFacilityDetail' as Section,
      countryList: countries,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'fails PhoneNumber validation (%s)',
    async ({
      phoneNumber,
      section,
      countryList,
      index,
      recoveryFacilityType,
    }) => {
      const response = validateCountry(
        phoneNumber,
        section,
        locale,
        context,
        countryList,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        const trimmedPhoneNumber = phoneNumber?.trim();
        expect(response.errors).toEqual(
          !trimmedPhoneNumber
            ? {
                fieldFormatErrors: [
                  {
                    field: section,
                    message: errorMessages.emptyCountry(
                      section,
                      index,
                      recoveryFacilityType,
                    )[locale][context],
                  },
                ],
              }
            : {
                fieldFormatErrors: [
                  {
                    field: section,
                    message: errorMessages.invalidCountry(
                      section,
                      index,
                      recoveryFacilityType,
                    )[locale][context],
                  },
                ],
              },
        );
      }
    },
  );
});

describe(validateFullName, () => {
  it.each([
    {
      fullName: ' Test full contact name 1 ',
      section: 'ExporterDetail' as Section,
    },
    {
      fullName: 'Test full contact name 2',
      section: 'ImporterDetail' as Section,
    },
    {
      fullName: 'Test full contact name 3',
      section: 'CollectionDetail' as Section,
    },
    {
      fullName: 'Test full contact name 4',
      section: 'Carriers' as Section,
      index: 1,
    },
    {
      fullName: 'Test full contact name 5',
      section: 'Carriers' as Section,
      index: 2,
    },
    {
      fullName: 'Test full contact name 6',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      fullName: 'Test full contact name 7',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      fullName: 'Test full contact name 8',
      section: 'RecoveryFacilityDetail' as Section,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      fullName: 'Test full contact name 9',
      section: 'RecoveryFacilityDetail' as Section,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'passes FullName validation (%s)',
    async ({ fullName, section, index, recoveryFacilityType }) => {
      const response = validateFullName(
        fullName,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(true);
      if (response.valid) {
        expect(response.value).toEqual(fullName.trim());
      }
    },
  );

  it.each([
    {
      fullName: faker.string.sample(251),
      section: 'ExporterDetail' as Section,
    },
    {
      fullName: '',
      section: 'ImporterDetail' as Section,
    },
    {
      fullName: '     ',
      section: 'CollectionDetail' as Section,
    },
    {
      fullName: undefined,
      section: 'Carriers' as Section,
      index: 1,
    },
    {
      fullName: faker.string.sample(251),
      section: 'Carriers' as Section,
      index: 2,
    },
    {
      fullName: '',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      fullName: '     ',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      fullName: undefined,
      section: 'RecoveryFacilityDetail' as Section,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      fullName: faker.string.sample(251),
      section: 'RecoveryFacilityDetail' as Section,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'fails FullName validation (%s)',
    async ({ fullName, section, index, recoveryFacilityType }) => {
      const response = validateFullName(
        fullName,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        expect(response.errors).toEqual(
          fullName && fullName.length > commonConstraints.FreeTextChar.max
            ? {
                fieldFormatErrors: [
                  {
                    field: section,
                    message: errorMessages.charTooManyContactFullName(
                      section,
                      index,
                      recoveryFacilityType,
                    )[locale][context],
                  },
                ],
              }
            : {
                fieldFormatErrors: [
                  {
                    field: section,
                    message: errorMessages.emptyContactFullName(
                      section,
                      index,
                      recoveryFacilityType,
                    )[locale][context],
                  },
                ],
              },
        );
      }
    },
  );
});

describe(validateEmailAddress, () => {
  it.each([
    {
      emailAddress: ' test@test.com ',
      section: 'ExporterDetail' as Section,
    },
    {
      emailAddress: 'test@test.bg',
      section: 'ImporterDetail' as Section,
    },
    {
      emailAddress: 'test@example.com',
      section: 'CollectionDetail' as Section,
    },
    {
      emailAddress: 'test@example.com',
      section: 'Carriers' as Section,
      index: 1,
    },
    {
      emailAddress: 'test@example.com',
      section: 'Carriers' as Section,
      index: 2,
    },
    {
      emailAddress: 'test@example.com',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      emailAddress: 'test@example.com',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      emailAddress: 'test@example.com',
      section: 'RecoveryFacilityDetail' as Section,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      emailAddress: 'test@example.com',
      section: 'RecoveryFacilityDetail' as Section,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'passes EmailAddress validation (%s)',
    async ({ emailAddress, section, index, recoveryFacilityType }) => {
      const response = validateEmailAddress(
        emailAddress,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(true);
      if (response.valid) {
        expect(response.value).toEqual(emailAddress.trim());
      }
    },
  );

  it.each([
    {
      emailAddress: faker.string.sample(251),
      section: 'ExporterDetail' as Section,
    },
    {
      emailAddress: '',
      section: 'ImporterDetail' as Section,
    },
    {
      emailAddress: '     ',
      section: 'CollectionDetail' as Section,
    },
    {
      emailAddress: undefined,
      section: 'Carriers' as Section,
      index: 1,
    },
    {
      emailAddress: faker.string.sample(251),
      section: 'Carriers' as Section,
      index: 2,
    },
    {
      emailAddress: 'test',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      emailAddress: 'random@email.a',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      emailAddress: undefined,
      section: 'RecoveryFacilityDetail' as Section,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      emailAddress: faker.string.sample(251),
      section: 'RecoveryFacilityDetail' as Section,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'fails EmailAddress validation (%s)',
    async ({ emailAddress, section, index, recoveryFacilityType }) => {
      const response = validateEmailAddress(
        emailAddress,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        const trimmedEmailAddress = emailAddress?.trim();
        expect(response.errors).toEqual(
          !trimmedEmailAddress
            ? {
                fieldFormatErrors: [
                  {
                    field: section,
                    message: errorMessages.emptyEmail(
                      section,
                      index,
                      recoveryFacilityType,
                    )[locale][context],
                  },
                ],
              }
            : trimmedEmailAddress.length > commonConstraints.FreeTextChar.max
              ? {
                  fieldFormatErrors: [
                    {
                      field: section,
                      message: errorMessages.charTooManyEmail(
                        section,
                        index,
                        recoveryFacilityType,
                      )[locale][context],
                    },
                  ],
                }
              : {
                  fieldFormatErrors: [
                    {
                      field: section,
                      message: errorMessages.invalidEmail(
                        section,
                        index,
                        recoveryFacilityType,
                      )[locale][context],
                    },
                  ],
                },
        );
      }
    },
  );
});

describe(validatePhoneNumber, () => {
  it.each([
    {
      phoneNumber: ' 00-44788-888 8888 ',
      section: 'ExporterDetail' as Section,
    },
    {
      phoneNumber: ' 00447888888888 ',
      section: 'ImporterDetail' as Section,
    },
    {
      phoneNumber: '07888888844',
      section: 'CollectionDetail' as Section,
    },
    {
      phoneNumber: '0033140000000',
      section: 'Carriers' as Section,
      index: 1,
    },
    {
      phoneNumber: '0033140000044',
      section: 'Carriers' as Section,
      index: 2,
    },
    {
      phoneNumber: '00-44788-888 8888',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      phoneNumber: '00447888888888',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      phoneNumber: '0033140000066',
      section: 'RecoveryFacilityDetail' as Section,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      phoneNumber: '00-44788-888 8888',
      section: 'RecoveryFacilityDetail' as Section,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'passes PhoneNumber validation (%s)',
    async ({ phoneNumber, section, index, recoveryFacilityType }) => {
      const response = validatePhoneNumber(
        phoneNumber,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(true);
      if (response.valid) {
        expect(response.value).toEqual(phoneNumber.trim());
      }
    },
  );

  it.each([
    {
      phoneNumber: '0033140000000',
      section: 'ExporterDetail' as Section,
    },
    {
      phoneNumber: '',
      section: 'ImporterDetail' as Section,
    },
    {
      phoneNumber: '0033140000011',
      section: 'CollectionDetail' as Section,
    },
    {
      phoneNumber: undefined,
      section: 'Carriers' as Section,
      index: 1,
    },
    {
      phoneNumber: 'test',
      section: 'Carriers' as Section,
      index: 2,
    },
    {
      phoneNumber: '',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      phoneNumber: '     ',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      phoneNumber: undefined,
      section: 'RecoveryFacilityDetail' as Section,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      phoneNumber: faker.string.sample(30),
      section: 'RecoveryFacilityDetail' as Section,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'fails PhoneNumber validation (%s)',
    async ({ phoneNumber, section, index, recoveryFacilityType }) => {
      const response = validatePhoneNumber(
        phoneNumber,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        const trimmedPhoneNumber = phoneNumber?.trim();
        expect(response.errors).toEqual(
          !trimmedPhoneNumber
            ? {
                fieldFormatErrors: [
                  {
                    field: section,
                    message: errorMessages.emptyPhone(
                      section,
                      index,
                      recoveryFacilityType,
                    )[locale][context],
                  },
                ],
              }
            : {
                fieldFormatErrors: [
                  {
                    field: section,
                    message: errorMessages.invalidPhone(
                      section,
                      index,
                      recoveryFacilityType,
                    )[locale][context],
                  },
                ],
              },
        );
      }
    },
  );
});

describe(validateFaxNumber, () => {
  it.each([
    {
      faxNumber: ' 00-44788-888 8888 ',
      section: 'ExporterDetail' as Section,
    },
    {
      faxNumber: ' 00447888888888 ',
      section: 'ImporterDetail' as Section,
    },
    {
      faxNumber: '07888888844',
      section: 'CollectionDetail' as Section,
    },
    {
      faxNumber: '0033140000000',
      section: 'Carriers' as Section,
      index: 1,
    },
    {
      faxNumber: '0033140000044',
      section: 'Carriers' as Section,
      index: 2,
    },
    {
      faxNumber: '00-44788-888 8888',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      faxNumber: '00447888888888',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      faxNumber: '0033140000066',
      section: 'RecoveryFacilityDetail' as Section,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      faxNumber: '00-44788-888 8888',
      section: 'RecoveryFacilityDetail' as Section,
      index: 2,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      faxNumber: '',
      section: 'ImporterDetail' as Section,
    },
    {
      faxNumber: undefined,
      section: 'Carriers' as Section,
      index: 1,
    },
    {
      faxNumber: '',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'Laboratory' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      faxNumber: '     ',
      section: 'RecoveryFacilityDetail' as Section,
      index: undefined,
      recoveryFacilityType: 'InterimSite' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
    {
      faxNumber: undefined,
      section: 'RecoveryFacilityDetail' as Section,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'passes FaxNumber validation (%s)',
    async ({ faxNumber, section, index, recoveryFacilityType }) => {
      const response = validateFaxNumber(
        faxNumber,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(true);
      if (response.valid) {
        const trimmedFaxNumber = faxNumber?.trim();
        expect(response.value).toEqual(
          !trimmedFaxNumber ? undefined : trimmedFaxNumber,
        );
      }
    },
  );

  it.each([
    {
      faxNumber: '0033140000000',
      section: 'ExporterDetail' as Section,
    },
    {
      faxNumber: '123',
      section: 'ImporterDetail' as Section,
    },
    {
      faxNumber: '0033140000011',
      section: 'CollectionDetail' as Section,
    },
    {
      faxNumber: 'test',
      section: 'Carriers' as Section,
      index: 1,
    },
    {
      faxNumber: faker.string.sample(30),
      section: 'RecoveryFacilityDetail' as Section,
      index: 1,
      recoveryFacilityType: 'RecoveryFacility' as
        | 'Laboratory'
        | 'InterimSite'
        | 'RecoveryFacility',
    },
  ])(
    'fails FaxNumber validation (%s)',
    async ({ faxNumber, section, index, recoveryFacilityType }) => {
      const response = validateFaxNumber(
        faxNumber,
        section,
        locale,
        context,
        index,
        recoveryFacilityType,
      );
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        expect(response.errors).toEqual({
          fieldFormatErrors: [
            {
              field: section,
              message: errorMessages.invalidFax(
                section,
                index,
                recoveryFacilityType,
              )[locale][context],
            },
          ],
        });
      }
    },
  );
});

describe(validateCarrierMeansOfTransport, () => {
  it.each([
    'road',
    'rail',
    'Sea',
    'AIR',
    'inland waterways',
    'InlandWaterways',
  ])('should return valid for valid types (%s)', (value) => {
    const result = validateCarrierMeansOfTransport(value, locale, 'csv', 1);
    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.value).toEqual(
        value !== 'InlandWaterways'
          ? commonValidationRules.titleCase(value).replace(/\s/g, '')
          : value,
      );
    }
  });

  it.each(['', '      ', 'abc'])(
    'should return invalid for invalid vlues (%s)',
    (value) => {
      const result = validateCarrierMeansOfTransport(value, locale, 'csv', 1);
      expect(result.valid).toBe(false);

      if (!result.valid) {
        expect(result.errors.fieldFormatErrors).toEqual([
          {
            field: 'Carriers',
            message: errorMessages.CarrierValidationErrorMessages(
              locale,
              'csv',
              1,
            ).emptyTransport,
          },
        ]);
      }
    },
  );
});

describe(validateCarrierMeansOfTransportDetails, () => {
  it.each([' Test details ', 'Test details', '', undefined, '     '])(
    'passes CarrierMeansOfTransportDetails validation (%s)',
    async (value) => {
      const response = validateCarrierMeansOfTransportDetails(
        locale,
        context,
        value,
        1,
      );
      expect(response.valid).toEqual(true);
      if (response.valid) {
        const trimmedValue = value?.trim();
        expect(response.value).toEqual(
          !trimmedValue ? undefined : trimmedValue,
        );
      }
    },
  );

  it.each([faker.string.sample(251)])(
    'fails CarrierMeansOfTransportDetails validation (%s)',
    async (value) => {
      const response = validateCarrierMeansOfTransportDetails(
        locale,
        context,
        value,
        1,
      );
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        expect(response.errors).toEqual({
          fieldFormatErrors: [
            {
              field: 'Carriers',
              message: errorMessages.CarrierValidationErrorMessages(
                locale,
                context,
                1,
              ).charTooManyTransportDescription,
            },
          ],
        });
      }
    },
  );
});

describe(validateUkExitLocation, () => {
  it.each(['London', 'Sofia ', '02Sofia', '', '  ', undefined])(
    'passes UkExitLocation validation (%s)',
    (value) => {
      const result = validateUkExitLocation(value);
      expect(result.valid).toEqual(true);
      if (result.valid) {
        if (result.value.provided === 'Yes' && value) {
          expect(result.value).toEqual({
            provided: 'Yes',
            value: value.trim(),
          });
        } else {
          expect(result.value).toEqual({
            provided: 'No',
          });
        }
      }
    },
  );

  it.each([
    faker.string.sample(Number(UkExitLocationChar.max + 1)),
    'London>!@>!<@',
    'Sofia>!@.,!<@',
    '02Sofia>!@>!{]s@',
  ])('fails UkExitLocation validation (%s)', (value) => {
    const result = validateUkExitLocation(value);

    expect(result.valid).toEqual(false);
    if (!result.valid) {
      if (value.length > UkExitLocationChar.max) {
        expect(result.errors.fieldFormatErrors).toEqual([
          {
            field: 'UkExitLocation',
            message: errorMessages.charTooManyUkExitLocation[locale][context],
          },
        ]);
      } else {
        expect(result.errors.fieldFormatErrors).toEqual([
          {
            field: 'UkExitLocation',
            message: errorMessages.invalidUkExitLocation[locale][context],
          },
        ]);
      }
    }
  });
});

describe(validateTransitCountries, () => {
  it('should return array of strings in correct format', () => {
    const result = validateTransitCountries(['Belgium', 'France'], countries);
    expect(result.valid).toEqual(true);
    if (result.valid) {
      expect(result.value).toEqual(['Belgium [BE]', 'France [FR]']);
    }
  });

  it('should return invalid error if the provided countries do not exist on the countryList', () => {
    const result = validateTransitCountries(['Bulgaria', 'France'], countries);
    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'TransitCountries',
            message: errorMessages.invalidTransitCountry[locale][context],
          },
        ],
      });
    }
  });
});

describe(validateImporterDetailAndTransitCountriesCross, () => {
  it('should return valid true if the provided transitCountries are not present in the importerDetail object', () => {
    const transitCountries = ['France'];
    const importerDetail: ImporterDetail = {
      importerAddressDetails: {
        organisationName: 'Global Imports Ltd.',
        address: '123 International Way, Suite 400',
        country: 'Belgium',
      },
      importerContactDetails: {
        fullName: 'Ivan Petrov',
        emailAddress: 'ivan.petrov@globalimports.com',
        phoneNumber: '+359 88 123 4567',
        faxNumber: '+359 88 765 4321',
      },
    };
    const result = validateImporterDetailAndTransitCountriesCross(
      importerDetail,
      transitCountries,
    );
    expect(result.valid).toEqual(true);
  });

  it('should return valid false if the provided transitCountries are present in the importerDetail object', () => {
    const transitCountries = ['Portugal'];
    const importerDetail: ImporterDetail = {
      importerAddressDetails: {
        organisationName: 'Global Imports Ltd.',
        address: '123 International Way, Suite 400',
        country: 'Portugal',
      },
      importerContactDetails: {
        fullName: 'Ivan Petrov',
        emailAddress: 'ivan.petrov@globalimports.com',
        phoneNumber: '+359 88 123 4567',
        faxNumber: '+359 88 765 4321',
      },
    };
    const result = validateImporterDetailAndTransitCountriesCross(
      importerDetail,
      transitCountries,
    );
    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        invalidStructureErrors: [
          {
            fields: ['ImporterDetail', 'TransitCountries'],
            message:
              errorMessages.importerDetailInvalidCrossSectionTransitCountries[
                locale
              ][context],
          },
          {
            fields: ['ImporterDetail', 'TransitCountries'],
            message:
              errorMessages.transitCountriesInvalidCrossSectionImporterDetail[
                locale
              ][context],
          },
        ],
        fieldFormatErrors: [],
      });
    }
  });
});
