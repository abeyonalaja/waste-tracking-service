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
  validateWasteQuantityType,
  validateWasteQuantity,
  validateWasteCodeSubSectionAndQuantityCrossSection,
  validateDisposalOrRecoveryCode,
  validateWasteCodeSubSectionAndCarriersCrossSection,
  validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection,
  validateReference,
  validateCollectionDate,
} from './validation-rules';
import { UkExitLocationChar } from './constraints';
import * as errorMessages from './error-messages';
import { submission } from '@wts/api/green-list-waste-export';
import {
  Country,
  ImporterDetail,
  RecoveryCode,
  RecoveryFacilityDetail,
  WasteCode,
  WasteCodeType,
} from './model';
import { Section } from './dto';
import {
  commonConstraints,
  commonErrorMessages,
  commonValidationRules,
} from '../common';
import { isValid, parse } from 'date-fns';

const wasteCodes: WasteCodeType[] = [
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

const ewcCodes: WasteCode[] = [
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

const countries: Country[] = [
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

const countriesIncludingUk: Country[] = [
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

const recoveryCodes: RecoveryCode[] = [
  {
    code: 'R1',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
      interim: false,
    },
  },
  {
    code: 'R13',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
      interim: true,
    },
  },
];

const disposalCodes: WasteCode[] = [
  {
    code: 'D1',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
];

const locale = 'en';
const context = 'api';

describe(validateReference, () => {
  it.each(['ref', '  ref', 'ref  ', 'test-ref_', 'test-ref_/\\'])(
    'passes Reference validation (%s)',
    async (value) => {
      const response = validateReference(value, locale, context);
      expect(response.valid).toEqual(true);
      if (response.valid) {
        expect(response.value).toEqual(value.trim());
      }
    },
  );

  it.each(['', '     ', '##]sda]', '123456789123456789123456789'])(
    'fails Reference validation (%s)',
    async (value) => {
      const response = validateReference(value, locale, context);
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        const trimmedValue = value?.trim();
        expect(response.errors).toEqual(
          !trimmedValue
            ? {
                fieldFormatErrors: [
                  {
                    field: 'CustomerReference',
                    message:
                      commonErrorMessages.emptyReference[locale][context],
                  },
                ],
              }
            : trimmedValue.length > commonConstraints.ReferenceChar.max
              ? {
                  fieldFormatErrors: [
                    {
                      field: 'CustomerReference',
                      message:
                        commonErrorMessages.charTooManyReference[locale][
                          context
                        ],
                    },
                  ],
                }
              : {
                  fieldFormatErrors: [
                    {
                      field: 'CustomerReference',
                      message:
                        commonErrorMessages.invalidReference[locale][context],
                    },
                  ],
                },
        );
      }
    },
  );
});

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

describe(validateWasteQuantity, () => {
  it('passes WasteQuantity validation, given valid values', () => {
    let result = validateWasteQuantity('Volume', 'Cubic Metre', 100);

    expect(result.valid).toEqual(true);
    result = validateWasteQuantity('Volume', 'Kilogram', '20');

    expect(result.valid).toEqual(true);
  });

  it('fails WasteQuantity validation, given invalid values', () => {
    let result = validateWasteQuantity('Volume', 'Cubic Metre', '');

    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteQuantity',
            message: errorMessages.emptyWasteQuantity[locale][context],
          },
        ],
      });
    }

    result = validateWasteQuantity('Volume', 'Kilogram', 'abc');

    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteQuantity',
            message: errorMessages.invalidWasteQuantity[locale][context],
          },
        ],
      });
    }

    result = validateWasteQuantity('Volume', 'Kilogram', 0);
    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteQuantity',
            message: errorMessages.invalidSmallWasteQuantity[locale][context],
          },
        ],
      });
    }

    result = validateWasteQuantity('Volume', 'Kilogram', 26);
    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteQuantity',
            message: errorMessages.invalidSmallWasteQuantity[locale][context],
          },
        ],
      });
    }

    result = validateWasteQuantity('Volume', 'Tonne', 1000000);
    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteQuantity',
            message: errorMessages.invalidBulkWasteQuantity[locale][context],
          },
        ],
      });
    }

    result = validateWasteQuantity('Volume', 'Tonne', 0);
    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        fieldFormatErrors: [
          {
            field: 'WasteQuantity',
            message: errorMessages.invalidBulkWasteQuantity[locale][context],
          },
        ],
      });
    }
  });
});

describe(validateWasteQuantityType, () => {
  it.each([
    ['actual', 'ActualData'],
    ['estimate', 'EstimateData'],
  ])('should return valid for valid types (%s, %s)', (value, expected) => {
    const result = validateWasteQuantityType(value);
    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.value).toBe(expected);
    }
  });

  it.each(['', '      ', undefined, 'abc'])(
    'should return invalid for invalid values (%s)',
    () => {
      const result = validateWasteQuantityType('actual');
      expect(result.valid).toBe(true);

      if (result.valid) {
        expect(result.value).toBe('ActualData');
      }
    },
  );
});

describe(validateWasteCodeSubSectionAndQuantityCrossSection, () => {
  it('passes validation given valid data', () => {
    let result = validateWasteCodeSubSectionAndQuantityCrossSection(
      {
        type: 'BaselAnnexIX',
      },
      {
        type: 'ActualData',
        actualData: {
          quantityType: 'Volume',
          unit: 'Cubic Metre',
          value: 100,
        },
      },
    );
    expect(result.valid).toEqual(true);

    result = validateWasteCodeSubSectionAndQuantityCrossSection(
      {
        type: 'NotApplicable',
      },
      {
        type: 'ActualData',
        actualData: {
          quantityType: 'Weight',
          unit: 'Kilogram',
          value: 20,
        },
      },
    );
    expect(result.valid).toEqual(true);
  });

  it('fails validation given invalid data, given large units are passed for code not applicable', () => {
    let result = validateWasteCodeSubSectionAndQuantityCrossSection(
      {
        type: 'NotApplicable',
      },
      {
        type: 'ActualData',
        actualData: {
          quantityType: 'Volume',
          unit: 'Cubic Metre',
          value: 100,
        },
      },
    );

    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        invalidStructureErrors: [
          {
            fields: ['WasteDescription', 'WasteQuantity'],
            message: errorMessages.smallNonKgWasteQuantity[locale][context],
          },
        ],
        fieldFormatErrors: [],
      });
    }

    result = validateWasteCodeSubSectionAndQuantityCrossSection(
      {
        type: 'NotApplicable',
      },
      {
        type: 'ActualData',
        actualData: {
          quantityType: 'Weight',
          unit: 'Tonne',
          value: 100,
        },
      },
    );

    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        invalidStructureErrors: [
          {
            fields: ['WasteDescription', 'WasteQuantity'],
            message: errorMessages.smallNonKgWasteQuantity[locale][context],
          },
        ],
        fieldFormatErrors: [],
      });
    }
  });

  it.each(['BaselAnnexIX', 'OECD', 'AnnexIIIA', 'AnnexIIIB'])(
    'fails validation given invalid data, given small units are passed for non small code (%s)',
    (code) => {
      const result = validateWasteCodeSubSectionAndQuantityCrossSection(
        {
          type: code as 'BaselAnnexIX' | 'OECD' | 'AnnexIIIA' | 'AnnexIIIB',
        },
        {
          type: 'ActualData',
          actualData: {
            quantityType: 'Weight',
            unit: 'Kilogram',
            value: 20,
          },
        },
      );

      expect(result.valid).toEqual(false);
      if (!result.valid) {
        expect(result.errors).toEqual({
          invalidStructureErrors: [
            {
              fields: ['WasteDescription', 'WasteQuantity'],
              message: errorMessages.laboratoryWasteQuantity[locale][context],
            },
          ],
          fieldFormatErrors: [],
        });
      }
    },
  );
});

describe(validateCollectionDate, () => {
  it('passes CollectionDate validation', async () => {
    const now = new Date();
    now.setDate(now.getDate() + 7);

    const response = validateCollectionDate(
      now.getDate(),
      now.getMonth() + 1,
      now.getFullYear(),
      locale,
      context,
    );
    expect(response.valid).toEqual(true);
    if (response.valid) {
      expect(response.value).toEqual({
        day: now.getDate().toString().padStart(2, '0'),
        month: (now.getMonth() + 1).toString().padStart(2, '0'),
        year: now.getFullYear().toString(),
      });
    }
  });

  it.each([
    [30, 2, 2024],
    [1, 13, 2024],
    [32, 1, 2024],
    ['', '', ''],
  ])('fails CollectionDate validation (%i-%i-%i)', async (day, month, year) => {
    const response = validateCollectionDate(day, month, year, locale, context);
    expect(response.valid).toEqual(false);
    if (!response.valid) {
      const parsedDate = parse(
        `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        'yyyy-MM-dd',
        new Date(),
      );
      expect(response.errors).toEqual(
        !day || !month || !year || !isValid(parsedDate)
          ? {
              fieldFormatErrors: [
                {
                  field: 'CollectionDate',
                  message:
                    commonErrorMessages.emptyCollectionDate[locale][context],
                },
              ],
            }
          : {
              fieldFormatErrors: [
                {
                  field: 'CollectionDate',
                  message:
                    commonErrorMessages.invalidCollectionDate[locale][context],
                },
              ],
            },
      );
    }
  });
});

describe(validateCollectionDateType, () => {
  it.each([
    ['actual', 'ActualDate'],
    ['estimate', 'EstimateDate'],
  ])('should return valid for valid types (%s, %s)', (value, expected) => {
    const result = validateCollectionDateType(value);
    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.value).toBe(expected);
    }
  });

  it.each(['', '      ', 'abc'])(
    'should return invalid for invalid values (%s)',
    (value) => {
      const result = validateCollectionDateType(value);
      expect(result.valid).toBe(false);

      if (!result.valid) {
        expect(result.errors).toEqual({
          fieldFormatErrors: [
            {
              field: 'CollectionDate',
              message:
                "Enter if this is an 'estimate' or 'actual' collection date",
            },
          ],
        });
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

describe(validateWasteCodeSubSectionAndCarriersCrossSection, () => {
  it('passes validation given valid data', () => {
    let result = validateWasteCodeSubSectionAndCarriersCrossSection(
      {
        type: 'BaselAnnexIX',
      },
      [
        {
          type: 'Air',
          description: 'test',
        },
      ],
    );
    expect(result.valid).toEqual(true);

    result = validateWasteCodeSubSectionAndCarriersCrossSection(
      {
        type: 'NotApplicable',
      },
      [],
    );
    expect(result.valid).toEqual(true);
  });

  it('fails validation given invalid data, given transport details for small waste', () => {
    let result = validateWasteCodeSubSectionAndCarriersCrossSection(
      {
        type: 'NotApplicable',
      },
      [
        {
          type: 'Air',
          description: 'test',
        },
      ],
    );

    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        invalidStructureErrors: [
          {
            fields: ['WasteDescription', 'Carriers'],
            message:
              errorMessages.invalidTransportCarriersCrossSection[locale][
                context
              ],
          },
          {
            fields: ['WasteDescription', 'Carriers'],
            message:
              errorMessages.invalidTransportDescriptionCarriersCrossSection[
                locale
              ][context],
          },
        ],
        fieldFormatErrors: [],
      });
    }

    result = validateWasteCodeSubSectionAndCarriersCrossSection(
      {
        type: 'NotApplicable',
      },
      [
        {
          type: 'Rail',
        },
      ],
    );

    expect(result.valid).toEqual(false);
    if (!result.valid) {
      expect(result.errors).toEqual({
        invalidStructureErrors: [
          {
            fields: ['WasteDescription', 'Carriers'],
            message:
              errorMessages.invalidTransportCarriersCrossSection[locale][
                context
              ],
          },
        ],
        fieldFormatErrors: [],
      });
    }
  });
});

describe(validateDisposalOrRecoveryCode, () => {
  it.each([
    {
      value: 'D1',
      codeRef: {
        type: 'Laboratory' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'InterimSite' | 'RecoveryFacility'
        >,
        codeList: disposalCodes,
      },
    },
    {
      value: 'r13 ',
      codeRef: {
        type: 'InterimSite' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'Laboratory'
        >,
        codeList: recoveryCodes,
      },
    },
    {
      value: 'R 1',
      codeRef: {
        type: 'RecoveryFacility' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'Laboratory'
        >,
        codeList: recoveryCodes,
      },
    },
  ])(
    'passes DisposalOrRecoveryCode validation (%s)',
    async ({ value, codeRef }) => {
      const response = validateDisposalOrRecoveryCode(
        value,
        codeRef,
        locale,
        context,
      );
      expect(response.valid).toEqual(true);
      if (response.valid) {
        expect(response.value).toEqual(value.replace(/\s/g, '').toUpperCase());
      }
    },
  );

  it.each([
    {
      value: '',
      codeRef: {
        type: 'Laboratory' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'InterimSite' | 'RecoveryFacility'
        >,
        codeList: disposalCodes,
      },
    },
    {
      value: '',
      codeRef: {
        type: 'InterimSite' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'Laboratory'
        >,
        codeList: recoveryCodes,
      },
    },
    {
      value: '',
      codeRef: {
        type: 'RecoveryFacility' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'Laboratory'
        >,
        codeList: recoveryCodes,
      },
    },
    {
      value: '   ',
      codeRef: {
        type: 'Laboratory' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'InterimSite' | 'RecoveryFacility'
        >,
        codeList: disposalCodes,
      },
    },
    {
      value: '   ',
      codeRef: {
        type: 'InterimSite' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'Laboratory'
        >,
        codeList: recoveryCodes,
      },
    },
    {
      value: '   ',
      codeRef: {
        type: 'RecoveryFacility' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'Laboratory'
        >,
        codeList: recoveryCodes,
      },
    },
    {
      value: undefined,
      codeRef: {
        type: 'Laboratory' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'InterimSite' | 'RecoveryFacility'
        >,
        codeList: disposalCodes,
      },
    },
    {
      value: undefined,
      codeRef: {
        type: 'InterimSite' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'Laboratory'
        >,
        codeList: recoveryCodes,
      },
    },
    {
      value: undefined,
      codeRef: {
        type: 'RecoveryFacility' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'Laboratory'
        >,
        codeList: recoveryCodes,
      },
    },
    {
      value: 'test',
      codeRef: {
        type: 'Laboratory' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'InterimSite' | 'RecoveryFacility'
        >,
        codeList: disposalCodes,
      },
    },
    {
      value: 'test',
      codeRef: {
        type: 'InterimSite' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'Laboratory'
        >,
        codeList: recoveryCodes,
      },
    },
    {
      value: 'test',
      codeRef: {
        type: 'RecoveryFacility' as Exclude<
          RecoveryFacilityDetail['recoveryFacilityType']['type'],
          'Laboratory'
        >,
        codeList: recoveryCodes,
      },
    },
  ])(
    'fails DisposalOrRecoveryCode validation (%s)',
    async ({ value, codeRef }) => {
      const response = validateDisposalOrRecoveryCode(
        value,
        codeRef,
        locale,
        context,
      );
      expect(response.valid).toEqual(false);
      if (!response.valid) {
        expect(response.errors).toEqual(
          !value?.trim()
            ? {
                fieldFormatErrors: [
                  {
                    field: 'RecoveryFacilityDetail',
                    message:
                      errorMessages.RecoveryFacilityDetailValidationErrorMessages(
                        locale,
                        context,
                        codeRef.type,
                      ).emptyCode,
                  },
                ],
              }
            : {
                fieldFormatErrors: [
                  {
                    field: 'RecoveryFacilityDetail',
                    message:
                      errorMessages.RecoveryFacilityDetailValidationErrorMessages(
                        locale,
                        context,
                        codeRef.type,
                      ).invalidCode,
                  },
                ],
              },
        );
      }
    },
  );
});

describe(
  validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection,
  () => {
    it('passes validation given valid data', () => {
      let result =
        validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
          {
            type: 'BaselAnnexIX',
          },
          [],
        );
      expect(result.valid).toEqual(true);

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'OECD',
        },
        ['InterimSite'],
      );
      expect(result.valid).toEqual(true);

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'AnnexIIIA',
        },
        ['RecoveryFacility'],
      );
      expect(result.valid).toEqual(true);

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'AnnexIIIB',
        },
        ['InterimSite', 'RecoveryFacility'],
      );
      expect(result.valid).toEqual(true);

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'NotApplicable',
        },
        [],
      );
      expect(result.valid).toEqual(true);

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'NotApplicable',
        },
        ['Laboratory'],
      );
      expect(result.valid).toEqual(true);
    });

    it('fails validation given invalid data, given transport details for small waste', () => {
      let result =
        validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
          {
            type: 'NotApplicable',
          },
          ['InterimSite'],
        );

      expect(result.valid).toEqual(false);
      if (!result.valid) {
        expect(result.errors).toEqual({
          invalidStructureErrors: [
            {
              fields: ['WasteDescription', 'RecoveryFacilityDetail'],
              message:
                errorMessages
                  .invalidInterimSiteRecoveryFacilityDetailCrossSection[locale][
                  context
                ],
            },
          ],
          fieldFormatErrors: [],
        });
      }

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'NotApplicable',
        },
        ['RecoveryFacility'],
      );

      expect(result.valid).toEqual(false);
      if (!result.valid) {
        expect(result.errors).toEqual({
          invalidStructureErrors: [
            {
              fields: ['WasteDescription', 'RecoveryFacilityDetail'],
              message:
                errorMessages
                  .invalidRecoveryFacilityRecoveryFacilityDetailCrossSection[
                  locale
                ][context],
            },
          ],
          fieldFormatErrors: [],
        });
      }

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'NotApplicable',
        },
        ['InterimSite', 'RecoveryFacility'],
      );

      expect(result.valid).toEqual(false);
      if (!result.valid) {
        expect(result.errors).toEqual({
          invalidStructureErrors: [
            {
              fields: ['WasteDescription', 'RecoveryFacilityDetail'],
              message:
                errorMessages
                  .invalidInterimSiteRecoveryFacilityDetailCrossSection[locale][
                  context
                ],
            },
            {
              fields: ['WasteDescription', 'RecoveryFacilityDetail'],
              message:
                errorMessages
                  .invalidRecoveryFacilityRecoveryFacilityDetailCrossSection[
                  locale
                ][context],
            },
          ],
          fieldFormatErrors: [],
        });
      }

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'NotApplicable',
        },
        ['Laboratory', 'InterimSite', 'RecoveryFacility'],
      );

      expect(result.valid).toEqual(false);
      if (!result.valid) {
        expect(result.errors).toEqual({
          invalidStructureErrors: [
            {
              fields: ['WasteDescription', 'RecoveryFacilityDetail'],
              message:
                errorMessages
                  .invalidInterimSiteRecoveryFacilityDetailCrossSection[locale][
                  context
                ],
            },
            {
              fields: ['WasteDescription', 'RecoveryFacilityDetail'],
              message:
                errorMessages
                  .invalidRecoveryFacilityRecoveryFacilityDetailCrossSection[
                  locale
                ][context],
            },
          ],
          fieldFormatErrors: [],
        });
      }

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'BaselAnnexIX',
        },
        ['Laboratory'],
      );

      expect(result.valid).toEqual(false);
      if (!result.valid) {
        expect(result.errors).toEqual({
          invalidStructureErrors: [
            {
              fields: ['WasteDescription', 'RecoveryFacilityDetail'],
              message:
                errorMessages
                  .invalidLaboratoryRecoveryFacilityDetailCrossSection[locale][
                  context
                ],
            },
          ],
          fieldFormatErrors: [],
        });
      }

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'OECD',
        },
        ['Laboratory'],
      );

      expect(result.valid).toEqual(false);
      if (!result.valid) {
        expect(result.errors).toEqual({
          invalidStructureErrors: [
            {
              fields: ['WasteDescription', 'RecoveryFacilityDetail'],
              message:
                errorMessages
                  .invalidLaboratoryRecoveryFacilityDetailCrossSection[locale][
                  context
                ],
            },
          ],
          fieldFormatErrors: [],
        });
      }

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'AnnexIIIA',
        },
        ['Laboratory', 'InterimSite'],
      );

      expect(result.valid).toEqual(false);
      if (!result.valid) {
        expect(result.errors).toEqual({
          invalidStructureErrors: [
            {
              fields: ['WasteDescription', 'RecoveryFacilityDetail'],
              message:
                errorMessages
                  .invalidLaboratoryRecoveryFacilityDetailCrossSection[locale][
                  context
                ],
            },
          ],
          fieldFormatErrors: [],
        });
      }

      result = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        {
          type: 'AnnexIIIB',
        },
        ['Laboratory', 'InterimSite', 'RecoveryFacility'],
      );

      expect(result.valid).toEqual(false);
      if (!result.valid) {
        expect(result.errors).toEqual({
          invalidStructureErrors: [
            {
              fields: ['WasteDescription', 'RecoveryFacilityDetail'],
              message:
                errorMessages
                  .invalidLaboratoryRecoveryFacilityDetailCrossSection[locale][
                  context
                ],
            },
          ],
          fieldFormatErrors: [],
        });
      }
    });
  },
);
