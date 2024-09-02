import {
  ImporterDetail,
  TransitCountries,
  WasteDescription,
  WasteQuantity,
  validation,
} from '../model';
import {
  validateCarriersSection,
  validateCollectionDateSection,
  validateCollectionDetailSection,
  validateCustomerReferenceSection,
  validateExporterDetailSection,
  validateImporterDetailAndTransitCountriesCrossSection,
  validateImporterDetailSection,
  validateRecoveryFacilityDetailSection,
  validateTransitCountriesSection,
  validateUkExitLocationSection,
  validateWasteCodeSubSection,
  validateWasteCodeSubSectionAndQuantityCrossSection,
  validateWasteCodeSubSectionAndCarriersCrossSection,
  validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection,
  validateWasteDescriptionSection,
  validateWasteDescriptionSubSection,
  validateWasteQuantitySection,
} from './validation-rules';
import { faker } from '@faker-js/faker';

import { common as commonValidation } from '@wts/util/shared-validation';
import { glwe } from '@wts/util/shared-validation';

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

const recoveryCodes = [
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

const disposalCodes = [
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

describe('validateCustomerReferenceSection', () => {
  it('passes CustomerReference section validation', async () => {
    const response = validateCustomerReferenceSection({
      reference: 'testRef',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual('testRef');
  });

  it('fails CustomerReference section validation', async () => {
    let response = validateCustomerReferenceSection({
      reference: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'CustomerReference',
      message: validation.ReferenceValidationErrorMessages.empty,
    });

    response = validateCustomerReferenceSection({
      reference: '1',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'CustomerReference',
      message: validation.ReferenceValidationErrorMessages.charTooFew,
    });

    response = validateCustomerReferenceSection({
      reference: faker.string.sample(120),
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'CustomerReference',
      message: validation.ReferenceValidationErrorMessages.charTooMany,
    });

    response = validateCustomerReferenceSection({
      reference: 'test-ref_',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'CustomerReference',
      message: validation.ReferenceValidationErrorMessages.invalid,
    });
  });
});

describe('validateWasteCodeSubSection', () => {
  it('passes WasteCode sub section validation', async () => {
    let response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: 'B1010',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'BaselAnnexIX',
      code: 'B1010',
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: 'GB040',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'OECD',
      code: 'GB040',
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: 'B1010; B1050',
        annexIIIBCode: '',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'AnnexIIIA',
      code: 'B1010 and B1050',
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'AnnexIIIB',
      code: 'BEU04',
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'NotApplicable',
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'NotApplicable',
    });
  });

  it('fails WasteCode sub section validation', async () => {
    let response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: 'B9999',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.BaselAnnexIXCodeValidationErrorMessages.invalid,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: 'GB999',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.OECDCodeValidationErrorMessages.invalid,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: 'B1010;B9999',
        annexIIIBCode: '',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.AnnexIIIACodeValidationErrorMessages.invalid,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '1010;B1050',
        annexIIIBCode: '',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.AnnexIIIACodeValidationErrorMessages.invalid,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU99',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.AnnexIIIBCodeValidationErrorMessages.invalid,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yessss',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.UnlistedValidationErrorMessages.invalid,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.empty,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: 'B1010',
        oecdCode: 'GB040',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: 'B1010',
        oecdCode: '',
        annexIIIACode: 'B1010;B1050',
        annexIIIBCode: '',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: 'B1010',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: 'GB040',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: 'B1010;B1050',
        annexIIIBCode: 'BEU04',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: 'GB040',
        annexIIIACode: 'B1010;B1050',
        annexIIIBCode: '',
        laboratory: '',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: 'B1010',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.laboratory,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: 'GB040',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.laboratory,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: 'B1010;B1050',
        annexIIIBCode: '',
        laboratory: 'Yes',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.laboratory,
    });

    response = validateWasteCodeSubSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: 'Yes',
      },
      wasteCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.laboratory,
    });
  });
});

describe('validateWasteDescriptionSubSection', () => {
  it('passes WasteDescription sub section validation', async () => {
    let response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101;010102',
        nationalCode: '123456',
        wasteDescription: 'test',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'Yes',
        value: '123456',
      },
      description: 'test',
    });

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'No',
      },
      description: 'test',
    });

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101; 010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'No',
      },
      description: 'test',
    });

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'No',
      },
      description: 'test',
    });

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101;010102',
        nationalCode: 'A-123',
        wasteDescription: 'test',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'Yes',
        value: 'A-123',
      },
      description: 'test',
    });

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'No',
      },
      description: 'test',
    });
  });

  it('fails WasteDescription sub section validation on EWC codes', async () => {
    let response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '',
        nationalCode: '',
        wasteDescription: 'test',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101;999999',
        nationalCode: '',
        wasteDescription: 'test',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101',
        nationalCode: '*****',
        wasteDescription: 'test',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
    ]);
  });

  it('fails WasteDescription sub section validation on national code', async () => {
    const response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101',
        nationalCode: '*****',
        wasteDescription: 'test',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
    ]);
  });

  it('fails WasteDescription sub section validation on waste description', async () => {
    let response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101',
        nationalCode: '',
        wasteDescription: faker.string.sample(120),
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101',
        nationalCode: '',
        wasteDescription: ' ',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);
  });

  it('fails WasteDescription sub section validation on all fields', async () => {
    let response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription: '',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription: '',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription: '',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSubSection(
      {
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);
  });
});

describe('validateWasteDescriptionSection', () => {
  it('passes WasteDescription section validation', async () => {
    let response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1010',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '123456',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      wasteCode: {
        type: 'BaselAnnexIX',
        code: 'B1010',
      },
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'Yes',
        value: '123456',
      },
      description: 'test',
    });

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: 'GB040',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      wasteCode: {
        type: 'OECD',
        code: 'GB040',
      },
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'No',
      },
      description: 'test',
    });

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: 'B1010; B1050',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101; 010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      wasteCode: {
        type: 'AnnexIIIA',
        code: 'B1010 and B1050',
      },
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'No',
      },
      description: 'test',
    });

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      wasteCode: {
        type: 'AnnexIIIB',
        code: 'BEU04',
      },
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'No',
      },
      description: 'test',
    });

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '010101;010102',
        nationalCode: 'A-123',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      wasteCode: {
        type: 'NotApplicable',
      },
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'Yes',
        value: 'A-123',
      },
      description: 'test',
    });

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      wasteCode: {
        type: 'NotApplicable',
      },
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'No',
      },
      description: 'test',
    });
  });

  it('fails WasteDescription section validation on waste codes', async () => {
    let response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B9999',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '123456',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.BaselAnnexIXCodeValidationErrorMessages.invalid,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: 'GB999',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.OECDCodeValidationErrorMessages.invalid,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: 'B1010;B9999',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.AnnexIIIACodeValidationErrorMessages.invalid,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU99',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.AnnexIIIBCodeValidationErrorMessages.invalid,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yessss',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.UnlistedValidationErrorMessages.invalid,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1010',
        oecdCode: 'GB040',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1010',
        oecdCode: '',
        annexIIIACode: 'B1010;B1050',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1010',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: 'GB040',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: 'B1010;B1050',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: 'GB040',
        annexIIIACode: 'B1010;B1050',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1010',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: 'GB040',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: 'B1010;B1050',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: 'Yes',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
    ]);
  });

  it('fails WasteDescription section validation on EWC codes', async () => {
    let response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101;999999',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101',
        nationalCode: '*****',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
    ]);
  });

  it('fails WasteDescription section validation on national code', async () => {
    const response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101',
        nationalCode: '*****',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
    ]);
  });

  it('fails WasteDescription section validation on waste description', async () => {
    let response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101',
        nationalCode: '',
        wasteDescription: faker.string.sample(120),
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101',
        nationalCode: '',
        wasteDescription: ' ',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);
  });

  it('fails WasteDescription section validation on waste code,ewc code,national code and waste description', async () => {
    let response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription: '',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription: '',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription: '',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: 'GB040',
        annexIIIACode: 'B3040;B3080',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription: '',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: 'GB040',
        annexIIIACode: 'B3040;B3080',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: 'GB040',
        annexIIIACode: 'B3040;B3080',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: 'GB040',
        annexIIIACode: 'B3040;B3080',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription: '',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: 'GB040',
        annexIIIACode: 'B3040;B3080',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: 'GB040',
        annexIIIACode: 'B3040;B3080',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: 'GB040',
        annexIIIACode: 'B3040;B3080',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription: '',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: 'GB040',
        annexIIIACode: 'B3040;B3080',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: 'GB040',
        annexIIIACode: 'B3040;B3080',
        annexIIIBCode: 'BEU04',
        laboratory: '',
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);
    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription: '',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.empty,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription: '',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '010107',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription: '',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription: ' ',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
      },
    ]);

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: 'B1050',
        oecdCode: '',
        annexIIIACode: '',
        annexIIIBCode: '',
        laboratory: 'Yes',
        ewcCodes: '010101;010102;010101;010102;010101;010102',
        nationalCode: '*****',
        wasteDescription:
          'thisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlthisistenlm',
      },
      wasteCodes,
      ewcCodes,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteDescription',
        message: validation.WasteCodeValidationErrorMessages.laboratory,
      },
      {
        field: 'WasteDescription',
        message: validation.EWCCodeErrorMessages.tooMany,
      },
      {
        field: 'WasteDescription',
        message: validation.NationalCodeValidationErrorMessages.invalid,
      },
      {
        field: 'WasteDescription',
        message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
      },
    ]);
  });
});

describe('validateWasteQuantitySection', () => {
  it('passes WasteQuantity section validation', async () => {
    let response = validateWasteQuantitySection({
      wasteQuantityTonnes: '002.01',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'ActualData',
      estimateData: {},
      actualData: {
        quantityType: 'Weight',
        unit: 'Tonne',
        value: 2.01,
      },
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '0.2',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'ActualData',
      estimateData: {},
      actualData: {
        quantityType: 'Volume',
        unit: 'Cubic Metre',
        value: 0.2,
      },
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '2.0',
      estimatedOrActualWasteQuantity: 'Estimate',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'EstimateData',
      estimateData: {
        quantityType: 'Weight',
        unit: 'Kilogram',
        value: 2,
      },
      actualData: {},
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '2.347899',
      estimatedOrActualWasteQuantity: 'Estimate',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'EstimateData',
      estimateData: {
        quantityType: 'Weight',
        unit: 'Kilogram',
        value: 2.35,
      },
      actualData: {},
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '56.347899',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Estimate',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'EstimateData',
      estimateData: {
        quantityType: 'Volume',
        unit: 'Cubic Metre',
        value: 56.35,
      },
      actualData: {},
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '56.347899',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Estimate',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'EstimateData',
      estimateData: {
        quantityType: 'Weight',
        unit: 'Tonne',
        value: 56.35,
      },
      actualData: {},
    });
  });

  it('fails WasteQuantity section validation', async () => {
    let response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.empty,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '1',
      wasteQuantityCubicMetres: '2',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.tooMany,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '1',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '2',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.tooMany,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '1',
      wasteQuantityKilograms: '2',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.tooMany,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '2',
      estimatedOrActualWasteQuantity: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.missingType,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '2',
      estimatedOrActualWasteQuantity: 'Actuals',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.missingType,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: 'test',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.invalid,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '0',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.BulkWasteQuantityValidationErrorMessages.invalid,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: 'test',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.invalid,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '0',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.BulkWasteQuantityValidationErrorMessages.invalid,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '2.12379070970',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.invalid,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '26',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.SmallWasteQuantityValidationErrorMessages.invalid,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.empty,
      },
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.missingType,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '34,6789',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.invalid,
      },
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.missingType,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '34,6789',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.invalid,
      },
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.missingType,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '34,6789',
      estimatedOrActualWasteQuantity: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.invalid,
      },
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.missingType,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '34.6789',
      wasteQuantityCubicMetres: '34.6789',
      wasteQuantityKilograms: '34.6789',
      estimatedOrActualWasteQuantity: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.tooMany,
      },
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.missingType,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '0',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.BulkWasteQuantityValidationErrorMessages.invalid,
      },
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.missingType,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '0',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.BulkWasteQuantityValidationErrorMessages.invalid,
      },
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.missingType,
      },
    ]);

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '26',
      estimatedOrActualWasteQuantity: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'WasteQuantity',
        message: validation.SmallWasteQuantityValidationErrorMessages.invalid,
      },
      {
        field: 'WasteQuantity',
        message: validation.WasteQuantityValidationErrorMessages.missingType,
      },
    ]);
  });
});

describe('validateWasteCodeSubSectionAndQuantityCrossSection', () => {
  it('passes WasteCodeSubSectionAndQuantity cross section validation', async () => {
    let wasteCodeSubSection: WasteDescription['wasteCode'] = {
      type: 'BaselAnnexIX',
      code: 'B1010',
    };
    const wasteQuantity: WasteQuantity = {
      type: 'ActualData',
      estimateData: {},
      actualData: {
        quantityType: 'Volume',
        unit: 'Cubic Metre',
        value: 0.2,
      },
    };
    let response = validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
    );
    expect(response.valid).toEqual(true);

    wasteCodeSubSection.type = 'OECD';
    response = validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
    );
    expect(response.valid).toEqual(true);

    wasteCodeSubSection.type = 'AnnexIIIA';
    response = validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
    );
    expect(response.valid).toEqual(true);

    wasteCodeSubSection.type = 'AnnexIIIB';
    response = validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
    );
    expect(response.valid).toEqual(true);

    wasteCodeSubSection = { type: 'NotApplicable' };
    wasteQuantity.actualData.unit = 'Kilogram';
    response = validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
    );
    expect(response.valid).toEqual(true);
  });

  it('fails WasteCodeSubSectionAndQuantity cross section validation for bulk waste', async () => {
    const wasteCodeSubSection: WasteDescription['wasteCode'] = {
      type: 'BaselAnnexIX',
      code: 'B1010',
    };
    const wasteQuantity: WasteQuantity = {
      type: 'ActualData',
      estimateData: {},
      actualData: {
        quantityType: 'Weight',
        unit: 'Kilogram',
        value: 0.2,
      },
    };

    let response = validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      fields: ['WasteDescription', 'WasteQuantity'],
      message: validation.WasteQuantityValidationErrorMessages.laboratory,
    });

    wasteCodeSubSection.type = 'OECD';
    response = validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      fields: ['WasteDescription', 'WasteQuantity'],
      message: validation.WasteQuantityValidationErrorMessages.laboratory,
    });

    wasteCodeSubSection.type = 'AnnexIIIA';
    response = validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      fields: ['WasteDescription', 'WasteQuantity'],
      message: validation.WasteQuantityValidationErrorMessages.laboratory,
    });

    wasteCodeSubSection.type = 'AnnexIIIB';
    response = validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      fields: ['WasteDescription', 'WasteQuantity'],
      message: validation.WasteQuantityValidationErrorMessages.laboratory,
    });
  });

  it('fails WasteCodeSubSectionAndQuantity cross section validation for NotApplicable wasteCode and Cubic Metre unit', () => {
    const wasteCodeSubSection: WasteDescription['wasteCode'] = {
      type: 'NotApplicable',
    };
    const wasteQuantity: WasteQuantity = {
      type: 'ActualData',
      estimateData: {},
      actualData: {
        unit: 'Cubic Metre',
        value: 0.2,
      },
    };

    const response = validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      fields: ['WasteDescription', 'WasteQuantity'],
      message: validation.WasteQuantityValidationErrorMessages.smallNonKg,
    });
  });

  it('fails WasteCodeSubSectionAndQuantity cross section validation for NotApplicable wasteCode and Tonne unit', () => {
    const wasteCodeSubSection: WasteDescription['wasteCode'] = {
      type: 'NotApplicable',
    };
    const wasteQuantity: WasteQuantity = {
      type: 'ActualData',
      estimateData: {},
      actualData: {
        unit: 'Tonne',
        value: 0.2,
      },
    };

    const response = validateWasteCodeSubSectionAndQuantityCrossSection(
      wasteCodeSubSection,
      wasteQuantity,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      fields: ['WasteDescription', 'WasteQuantity'],
      message: validation.WasteQuantityValidationErrorMessages.smallNonKg,
    });
  });
});

describe('validateExporterDetailSection', () => {
  it('passes ExporterDetail section validation', async () => {
    let response = validateExporterDetailSection({
      exporterOrganisationName: 'Test organisation 1',
      exporterAddressLine1: '1 Some Street',
      exporterAddressLine2: '',
      exporterTownOrCity: 'London',
      exporterCountry: 'England',
      exporterPostcode: '',
      exporterContactFullName: 'John Smith',
      exporterContactPhoneNumber: '00-44788-888 8888',
      exporterFaxNumber: '',
      exporterEmailAddress: 'test1@test.com',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      exporterAddress: {
        addressLine1: '1 Some Street',
        townCity: 'London',
        country: 'England',
      },
      exporterContactDetails: {
        organisationName: 'Test organisation 1',
        fullName: 'John Smith',
        emailAddress: 'test1@test.com',
        phoneNumber: '00-44788-888 8888',
      },
    });

    response = validateExporterDetailSection({
      exporterOrganisationName: 'Test organisation 1',
      exporterAddressLine1: '1 Some Street',
      exporterAddressLine2: 'Address line',
      exporterTownOrCity: 'Belfast',
      exporterCountry: 'northern ireland',
      exporterPostcode: 'EC2N4AY',
      exporterContactFullName: 'John Smith',
      exporterContactPhoneNumber: "'00447888888888'",
      exporterFaxNumber: "'+ (44)78888-88888'",
      exporterEmailAddress: 'test1@test.com',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      exporterAddress: {
        addressLine1: '1 Some Street',
        addressLine2: 'Address line',
        townCity: 'Belfast',
        postcode: 'EC2N4AY',
        country: 'Northern Ireland',
      },
      exporterContactDetails: {
        organisationName: 'Test organisation 1',
        fullName: 'John Smith',
        emailAddress: 'test1@test.com',
        phoneNumber: '00447888888888',
        faxNumber: '+ (44)78888-88888',
      },
    });
  });

  it('fails ExporterDetail section validation', async () => {
    let response = validateExporterDetailSection({
      exporterOrganisationName: '',
      exporterAddressLine1: '',
      exporterAddressLine2: '',
      exporterTownOrCity: '',
      exporterCountry: '',
      exporterPostcode: '',
      exporterContactFullName: '',
      exporterContactPhoneNumber: '',
      exporterFaxNumber: '',
      exporterEmailAddress: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages
            .emptyOrganisationName,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.emptyAddressLine1,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.emptyTownOrCity,
      },
      {
        field: 'ExporterDetail',
        message: validation.ExporterDetailValidationErrorMessages.emptyCountry,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.emptyContactFullName,
      },
      {
        field: 'ExporterDetail',
        message: validation.ExporterDetailValidationErrorMessages.emptyPhone,
      },
      {
        field: 'ExporterDetail',
        message: validation.ExporterDetailValidationErrorMessages.emptyEmail,
      },
    ]);

    response = validateExporterDetailSection({
      exporterOrganisationName: '     ',
      exporterAddressLine1: '     ',
      exporterAddressLine2: '     ',
      exporterTownOrCity: '     ',
      exporterCountry: '     ',
      exporterPostcode: '     ',
      exporterContactFullName: '     ',
      exporterContactPhoneNumber: '+34556757895678',
      exporterFaxNumber: '     ',
      exporterEmailAddress: '     ',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages
            .emptyOrganisationName,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.emptyAddressLine1,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.emptyTownOrCity,
      },
      {
        field: 'ExporterDetail',
        message: validation.ExporterDetailValidationErrorMessages.emptyCountry,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.invalidPostcode,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.emptyContactFullName,
      },
      {
        field: 'ExporterDetail',
        message: validation.ExporterDetailValidationErrorMessages.invalidPhone,
      },
      {
        field: 'ExporterDetail',
        message: validation.ExporterDetailValidationErrorMessages.invalidFax,
      },
      {
        field: 'ExporterDetail',
        message: validation.ExporterDetailValidationErrorMessages.invalidEmail,
      },
    ]);

    response = validateExporterDetailSection({
      exporterOrganisationName: faker.string.sample(251),
      exporterAddressLine1: faker.string.sample(251),
      exporterAddressLine2: faker.string.sample(251),
      exporterTownOrCity: faker.string.sample(251),
      exporterCountry: faker.string.sample(251),
      exporterPostcode: faker.string.sample(251),
      exporterContactFullName: faker.string.sample(251),
      exporterContactPhoneNumber: faker.string.sample(30),
      exporterFaxNumber: faker.string.sample(30),
      exporterEmailAddress: faker.string.sample(251),
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages
            .charTooManyOrganisationName,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages
            .charTooManyAddressLine1,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages
            .charTooManyAddressLine2,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages
            .charTooManyTownOrCity,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.invalidCountry,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.invalidPostcode,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages
            .charTooManyContactFullName,
      },
      {
        field: 'ExporterDetail',
        message: validation.ExporterDetailValidationErrorMessages.invalidPhone,
      },
      {
        field: 'ExporterDetail',
        message: validation.ExporterDetailValidationErrorMessages.invalidFax,
      },
      {
        field: 'ExporterDetail',
        message:
          validation.ExporterDetailValidationErrorMessages.charTooManyEmail,
      },
    ]);
  });
});

describe('validateImporterDetailSection', () => {
  it('passes ImporterDetail section validation', async () => {
    let response = validateImporterDetailSection(
      {
        importerOrganisationName: 'Test organisation 2',
        importerAddress: '2 Some Street, Paris, 75002',
        importerCountry: 'France',
        importerContactFullName: 'Jane Smith',
        importerContactPhoneNumber: '00-44788-888 8888',
        importerFaxNumber: '',
        importerEmailAddress: 'test2@test.com',
      },
      countries,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      importerAddressDetails: {
        organisationName: 'Test organisation 2',
        address: '2 Some Street, Paris, 75002',
        country: 'France [FR]',
      },
      importerContactDetails: {
        fullName: 'Jane Smith',
        emailAddress: 'test2@test.com',
        phoneNumber: '00-44788-888 8888',
      },
    });

    response = validateImporterDetailSection(
      {
        importerOrganisationName: 'Test organisation 2',
        importerAddress: '2 Some Street, Paris, 75002',
        importerCountry: 'France',
        importerContactFullName: 'Jane Smith',
        importerContactPhoneNumber: "'0033140000000'",
        importerFaxNumber: "'0033140000000'",
        importerEmailAddress: 'test2@test.com',
      },
      countries,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      importerAddressDetails: {
        organisationName: 'Test organisation 2',
        address: '2 Some Street, Paris, 75002',
        country: 'France [FR]',
      },
      importerContactDetails: {
        fullName: 'Jane Smith',
        emailAddress: 'test2@test.com',
        phoneNumber: '0033140000000',
        faxNumber: '0033140000000',
      },
    });
  });

  it('fails ImporterDetail section validation', async () => {
    let response = validateImporterDetailSection(
      {
        importerOrganisationName: '',
        importerAddress: '',
        importerCountry: '',
        importerContactFullName: '',
        importerContactPhoneNumber: '',
        importerFaxNumber: '',
        importerEmailAddress: '',
      },
      countries,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages
            .emptyOrganisationName,
      },
      {
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.emptyAddress,
      },
      {
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.emptyCountry,
      },
      {
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages.emptyContactFullName,
      },
      {
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.emptyPhone,
      },
      {
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.emptyEmail,
      },
    ]);

    response = validateImporterDetailSection(
      {
        importerOrganisationName: '     ',
        importerAddress: '     ',
        importerCountry: '     ',
        importerContactFullName: '     ',
        importerContactPhoneNumber: '     ',
        importerFaxNumber: '     ',
        importerEmailAddress: '     ',
      },
      countries,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages
            .emptyOrganisationName,
      },
      {
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.emptyAddress,
      },
      {
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages.invalidCountry,
      },
      {
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages.emptyContactFullName,
      },
      {
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.invalidPhone,
      },
      {
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.invalidFax,
      },
      {
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.invalidEmail,
      },
    ]);

    response = validateImporterDetailSection(
      {
        importerOrganisationName: faker.string.sample(251),
        importerAddress: faker.string.sample(251),
        importerCountry: faker.string.sample(251),
        importerContactFullName: faker.string.sample(251),
        importerContactPhoneNumber: faker.string.sample(30),
        importerFaxNumber: faker.string.sample(30),
        importerEmailAddress: faker.string.sample(251),
      },
      countries,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages
            .charTooManyOrganisationName,
      },
      {
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages.charTooManyAddress,
      },
      {
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages.invalidCountry,
      },
      {
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages
            .charTooManyContactFullName,
      },
      {
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.invalidPhone,
      },
      {
        field: 'ImporterDetail',
        message: validation.ImporterDetailValidationErrorMessages.invalidFax,
      },
      {
        field: 'ImporterDetail',
        message:
          validation.ImporterDetailValidationErrorMessages.charTooManyEmail,
      },
    ]);
  });
});

describe('validateCollectionDateSection', () => {
  it('passes CollectionDate section validation', async () => {
    const futureDate = '15/01/3000';
    const futureDateArr = futureDate.split('/');
    let response = validateCollectionDateSection({
      wasteCollectionDate: futureDate,
      estimatedOrActualCollectionDate: 'Actual',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'ActualDate',
      estimateDate: {},
      actualDate: {
        day: futureDateArr[0],
        month: futureDateArr[1],
        year: futureDateArr[2],
      },
    });

    response = validateCollectionDateSection({
      wasteCollectionDate: futureDate.replace(/\//g, '-'),
      estimatedOrActualCollectionDate: 'estimate',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      type: 'EstimateDate',
      estimateDate: {
        day: futureDateArr[0],
        month: futureDateArr[1],
        year: futureDateArr[2],
      },
      actualDate: {},
    });
  });

  it('fails CollectionDate section validation', async () => {
    let response = validateCollectionDateSection({
      wasteCollectionDate: '',
      estimatedOrActualCollectionDate: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'CollectionDate',
        message:
          commonValidation.commonErrorMessages.emptyCollectionDate.en.csv,
      },
    ]);

    response = validateCollectionDateSection({
      wasteCollectionDate: 'date',
      estimatedOrActualCollectionDate: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'CollectionDate',
        message:
          commonValidation.commonErrorMessages.emptyCollectionDate.en.csv,
      },
    ]);

    response = validateCollectionDateSection({
      wasteCollectionDate: '15/15/3000',
      estimatedOrActualCollectionDate: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'CollectionDate',
        message:
          commonValidation.commonErrorMessages.emptyCollectionDate.en.csv,
      },
    ]);

    response = validateCollectionDateSection({
      wasteCollectionDate: '01/01/2023',
      estimatedOrActualCollectionDate: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'CollectionDate',
        message:
          commonValidation.commonErrorMessages.invalidCollectionDate.en.csv,
      },
    ]);

    response = validateCollectionDateSection({
      wasteCollectionDate: '',
      estimatedOrActualCollectionDate: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'CollectionDate',
        message:
          commonValidation.commonErrorMessages.emptyCollectionDate.en.csv,
      },
      {
        field: 'CollectionDate',
        message: glwe.errorMessages.missingTypeCollectionDate.en.csv,
      },
    ]);

    response = validateCollectionDateSection({
      wasteCollectionDate: '01/01/3000',
      estimatedOrActualCollectionDate: 'type',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'CollectionDate',
        message: glwe.errorMessages.missingTypeCollectionDate.en.csv,
      },
    ]);
  });
});

describe('validateCarriersSection', () => {
  it('passes Carriers section validation', async () => {
    let response = validateCarriersSection(
      {
        firstCarrierOrganisationName: 'Test organisation 3',
        firstCarrierAddress: 'Some address, London, EC2N4AY',
        firstCarrierCountry: 'England',
        firstCarrierContactFullName: 'John Doe',
        firstCarrierContactPhoneNumber: '07888888844',
        firstCarrierFaxNumber: '07888888844',
        firstCarrierEmailAddress: 'test3@test.com',
        firstCarrierMeansOfTransport: 'inland waterways',
        firstCarrierMeansOfTransportDetails: 'details',
        secondCarrierOrganisationName: 'Test organisation 4',
        secondCarrierAddress: '3 Some Street, Paris, 75002',
        secondCarrierCountry: 'England',
        secondCarrierContactFullName: 'Jane Doe',
        secondCarrierContactPhoneNumber: '0033140000044',
        secondCarrierFaxNumber: '',
        secondCarrierEmailAddress: 'test4@test.com',
        secondCarrierMeansOfTransport: 'Road',
        secondCarrierMeansOfTransportDetails: '',
        thirdCarrierOrganisationName: '',
        thirdCarrierAddress: '',
        thirdCarrierCountry: '',
        thirdCarrierContactFullName: '',
        thirdCarrierContactPhoneNumber: '',
        thirdCarrierFaxNumber: '',
        thirdCarrierEmailAddress: '',
        thirdCarrierMeansOfTransport: '',
        thirdCarrierMeansOfTransportDetails: '',
        fourthCarrierOrganisationName: '',
        fourthCarrierAddress: '',
        fourthCarrierCountry: '',
        fourthCarrierContactFullName: '',
        fourthCarrierContactPhoneNumber: '',
        fourthCarrierFaxNumber: '',
        fourthCarrierEmailAddress: '',
        fourthCarrierMeansOfTransport: '',
        fourthCarrierMeansOfTransportDetails: '',
        fifthCarrierOrganisationName: '',
        fifthCarrierAddress: '',
        fifthCarrierCountry: '',
        fifthCarrierContactFullName: '',
        fifthCarrierContactPhoneNumber: '',
        fifthCarrierFaxNumber: '',
        fifthCarrierEmailAddress: '',
        fifthCarrierMeansOfTransport: '',
        fifthCarrierMeansOfTransportDetails: '',
      },
      true,
      countriesIncludingUk,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual([
      {
        addressDetails: {
          organisationName: 'Test organisation 3',
          address: 'Some address, London, EC2N4AY',
          country: 'United Kingdom (England) [GB-ENG]',
        },
        contactDetails: {
          fullName: 'John Doe',
          emailAddress: 'test3@test.com',
          phoneNumber: '07888888844',
          faxNumber: '07888888844',
        },
        transportDetails: {
          type: 'InlandWaterways',
          description: 'details',
        },
      },
      {
        addressDetails: {
          organisationName: 'Test organisation 4',
          address: '3 Some Street, Paris, 75002',
          country: 'United Kingdom (England) [GB-ENG]',
        },
        contactDetails: {
          fullName: 'Jane Doe',
          emailAddress: 'test4@test.com',
          phoneNumber: '0033140000044',
        },
        transportDetails: {
          type: 'Road',
        },
      },
    ]);

    response = validateCarriersSection(
      {
        firstCarrierOrganisationName: 'Test organisation 3',
        firstCarrierAddress: 'Some address, London, EC2N4AY',
        firstCarrierCountry: 'England',
        firstCarrierContactFullName: 'John Doe',
        firstCarrierContactPhoneNumber: '07888888844',
        firstCarrierFaxNumber: '07888888844',
        firstCarrierEmailAddress: 'test3@test.com',
        firstCarrierMeansOfTransport: '',
        firstCarrierMeansOfTransportDetails: '',
        secondCarrierOrganisationName: 'Test organisation 4',
        secondCarrierAddress: '3 Some Street, Paris, 75002',
        secondCarrierCountry: 'France',
        secondCarrierContactFullName: 'Jane Doe',
        secondCarrierContactPhoneNumber: '0033140000044',
        secondCarrierFaxNumber: '',
        secondCarrierEmailAddress: 'test4@test.com',
        secondCarrierMeansOfTransport: '',
        secondCarrierMeansOfTransportDetails: '',
        thirdCarrierOrganisationName: '',
        thirdCarrierAddress: '',
        thirdCarrierCountry: '',
        thirdCarrierContactFullName: '',
        thirdCarrierContactPhoneNumber: '',
        thirdCarrierFaxNumber: '',
        thirdCarrierEmailAddress: '',
        thirdCarrierMeansOfTransport: '',
        thirdCarrierMeansOfTransportDetails: '',
        fourthCarrierOrganisationName: '',
        fourthCarrierAddress: '',
        fourthCarrierCountry: '',
        fourthCarrierContactFullName: '',
        fourthCarrierContactPhoneNumber: '',
        fourthCarrierFaxNumber: '',
        fourthCarrierEmailAddress: '',
        fourthCarrierMeansOfTransport: '',
        fourthCarrierMeansOfTransportDetails: '',
        fifthCarrierOrganisationName: '',
        fifthCarrierAddress: '',
        fifthCarrierCountry: '',
        fifthCarrierContactFullName: '',
        fifthCarrierContactPhoneNumber: '',
        fifthCarrierFaxNumber: '',
        fifthCarrierEmailAddress: '',
        fifthCarrierMeansOfTransport: '',
        fifthCarrierMeansOfTransportDetails: '',
      },
      false,
      countriesIncludingUk,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual([
      {
        addressDetails: {
          organisationName: 'Test organisation 3',
          address: 'Some address, London, EC2N4AY',
          country: 'United Kingdom (England) [GB-ENG]',
        },
        contactDetails: {
          fullName: 'John Doe',
          emailAddress: 'test3@test.com',
          phoneNumber: '07888888844',
          faxNumber: '07888888844',
        },
      },
      {
        addressDetails: {
          organisationName: 'Test organisation 4',
          address: '3 Some Street, Paris, 75002',
          country: 'France [FR]',
        },
        contactDetails: {
          fullName: 'Jane Doe',
          emailAddress: 'test4@test.com',
          phoneNumber: '0033140000044',
        },
      },
    ]);
  });

  const firstCarrierErrorMessages =
    validation.CarrierValidationErrorMessages(1);
  const secondCarrierErrorMessages =
    validation.CarrierValidationErrorMessages(2);
  const thirdCarrierErrorMessages =
    validation.CarrierValidationErrorMessages(3);

  it('fails Carriers section validation', async () => {
    let response = validateCarriersSection(
      {
        firstCarrierOrganisationName: '',
        firstCarrierAddress: '',
        firstCarrierCountry: '',
        firstCarrierContactFullName: '',
        firstCarrierContactPhoneNumber: '',
        firstCarrierFaxNumber: '',
        firstCarrierEmailAddress: '',
        firstCarrierMeansOfTransport: '',
        firstCarrierMeansOfTransportDetails: '',
        secondCarrierOrganisationName: '',
        secondCarrierAddress: '',
        secondCarrierCountry: '',
        secondCarrierContactFullName: '',
        secondCarrierContactPhoneNumber: '',
        secondCarrierFaxNumber: '',
        secondCarrierEmailAddress: '',
        secondCarrierMeansOfTransport: '',
        secondCarrierMeansOfTransportDetails: '',
        thirdCarrierOrganisationName: '',
        thirdCarrierAddress: '',
        thirdCarrierCountry: '',
        thirdCarrierContactFullName: '',
        thirdCarrierContactPhoneNumber: '',
        thirdCarrierFaxNumber: '',
        thirdCarrierEmailAddress: '',
        thirdCarrierMeansOfTransport: '',
        thirdCarrierMeansOfTransportDetails: '',
        fourthCarrierOrganisationName: '',
        fourthCarrierAddress: '',
        fourthCarrierCountry: '',
        fourthCarrierContactFullName: '',
        fourthCarrierContactPhoneNumber: '',
        fourthCarrierFaxNumber: '',
        fourthCarrierEmailAddress: '',
        fourthCarrierMeansOfTransport: '',
        fourthCarrierMeansOfTransportDetails: '',
        fifthCarrierOrganisationName: '',
        fifthCarrierAddress: '',
        fifthCarrierCountry: '',
        fifthCarrierContactFullName: '',
        fifthCarrierContactPhoneNumber: '',
        fifthCarrierFaxNumber: '',
        fifthCarrierEmailAddress: '',
        fifthCarrierMeansOfTransport: '',
        fifthCarrierMeansOfTransportDetails: '',
      },
      true,
      countriesIncludingUk,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.emptyOrganisationName,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.emptyAddress,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.emptyCountry,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.emptyContactFullName,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.emptyPhone,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.emptyEmail,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.emptyTransport,
      },
    ]);

    response = validateCarriersSection(
      {
        firstCarrierOrganisationName: faker.string.sample(251),
        firstCarrierAddress: faker.string.sample(251),
        firstCarrierCountry: faker.string.sample(50),
        firstCarrierContactFullName: faker.string.sample(251),
        firstCarrierContactPhoneNumber: faker.string.sample(50),
        firstCarrierFaxNumber: faker.string.sample(50),
        firstCarrierEmailAddress: faker.string.sample(50),
        firstCarrierMeansOfTransport: faker.string.sample(50),
        firstCarrierMeansOfTransportDetails: faker.string.sample(201),
        secondCarrierOrganisationName: '',
        secondCarrierAddress: '',
        secondCarrierCountry: '',
        secondCarrierContactFullName: '',
        secondCarrierContactPhoneNumber: '',
        secondCarrierFaxNumber: '',
        secondCarrierEmailAddress: '',
        secondCarrierMeansOfTransport: '',
        secondCarrierMeansOfTransportDetails: '',
        thirdCarrierOrganisationName: '',
        thirdCarrierAddress: '',
        thirdCarrierCountry: '',
        thirdCarrierContactFullName: '',
        thirdCarrierContactPhoneNumber: '',
        thirdCarrierFaxNumber: '',
        thirdCarrierEmailAddress: '',
        thirdCarrierMeansOfTransport: '',
        thirdCarrierMeansOfTransportDetails: '',
        fourthCarrierOrganisationName: '',
        fourthCarrierAddress: '',
        fourthCarrierCountry: '',
        fourthCarrierContactFullName: '',
        fourthCarrierContactPhoneNumber: '',
        fourthCarrierFaxNumber: '',
        fourthCarrierEmailAddress: '',
        fourthCarrierMeansOfTransport: '',
        fourthCarrierMeansOfTransportDetails: '',
        fifthCarrierOrganisationName: '',
        fifthCarrierAddress: '',
        fifthCarrierCountry: '',
        fifthCarrierContactFullName: '',
        fifthCarrierContactPhoneNumber: '',
        fifthCarrierFaxNumber: '',
        fifthCarrierEmailAddress: '',
        fifthCarrierMeansOfTransport: '',
        fifthCarrierMeansOfTransportDetails: '',
      },
      true,
      countriesIncludingUk,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.charTooManyOrganisationName,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.charTooManyAddress,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.invalidCountry,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.charTooManyContactFullName,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.invalidPhone,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.invalidFax,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.invalidEmail,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.emptyTransport,
      },
      {
        field: 'Carriers',
        message: firstCarrierErrorMessages.charTooManyTransportDescription,
      },
    ]);

    response = validateCarriersSection(
      {
        firstCarrierOrganisationName: 'Test organisation 3',
        firstCarrierAddress: 'Some address, London, EC2N4AY',
        firstCarrierCountry: 'England',
        firstCarrierContactFullName: 'John Doe',
        firstCarrierContactPhoneNumber: '07888888844',
        firstCarrierFaxNumber: '07888888844',
        firstCarrierEmailAddress: 'test3@test.com',
        firstCarrierMeansOfTransport: 'inland waterways',
        firstCarrierMeansOfTransportDetails: 'details',
        secondCarrierOrganisationName: 'Test organisation 4',
        secondCarrierAddress: '3 Some Street, Paris, 75002',
        secondCarrierCountry: 'France',
        secondCarrierContactFullName: 'Jane Doe',
        secondCarrierContactPhoneNumber: '0033140000044',
        secondCarrierFaxNumber: '',
        secondCarrierEmailAddress: 'test4@test.com',
        secondCarrierMeansOfTransport: 'Road',
        secondCarrierMeansOfTransportDetails: '',
        thirdCarrierOrganisationName: 'Incomplete',
        thirdCarrierAddress: '',
        thirdCarrierCountry: '',
        thirdCarrierContactFullName: '',
        thirdCarrierContactPhoneNumber: '',
        thirdCarrierFaxNumber: '',
        thirdCarrierEmailAddress: '',
        thirdCarrierMeansOfTransport: '',
        thirdCarrierMeansOfTransportDetails: '',
        fourthCarrierOrganisationName: '',
        fourthCarrierAddress: '',
        fourthCarrierCountry: '',
        fourthCarrierContactFullName: '',
        fourthCarrierContactPhoneNumber: '',
        fourthCarrierFaxNumber: '',
        fourthCarrierEmailAddress: '',
        fourthCarrierMeansOfTransport: '',
        fourthCarrierMeansOfTransportDetails: '',
        fifthCarrierOrganisationName: '',
        fifthCarrierAddress: '',
        fifthCarrierCountry: '',
        fifthCarrierContactFullName: '',
        fifthCarrierContactPhoneNumber: '',
        fifthCarrierFaxNumber: '',
        fifthCarrierEmailAddress: '',
        fifthCarrierMeansOfTransport: '',
        fifthCarrierMeansOfTransportDetails: '',
      },
      true,
      countriesIncludingUk,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'Carriers',
        message: thirdCarrierErrorMessages.emptyAddress,
      },
      {
        field: 'Carriers',
        message: thirdCarrierErrorMessages.emptyCountry,
      },
      {
        field: 'Carriers',
        message: thirdCarrierErrorMessages.emptyContactFullName,
      },
      {
        field: 'Carriers',
        message: thirdCarrierErrorMessages.emptyPhone,
      },
      {
        field: 'Carriers',
        message: thirdCarrierErrorMessages.emptyEmail,
      },
      {
        field: 'Carriers',
        message: thirdCarrierErrorMessages.emptyTransport,
      },
    ]);

    response = validateCarriersSection(
      {
        firstCarrierOrganisationName: 'Test organisation 3',
        firstCarrierAddress: 'Some address, London, EC2N4AY',
        firstCarrierCountry: 'England',
        firstCarrierContactFullName: 'John Doe',
        firstCarrierContactPhoneNumber: '07888888844',
        firstCarrierFaxNumber: '07888888844',
        firstCarrierEmailAddress: 'test3@test.com',
        firstCarrierMeansOfTransport: 'inland waterways',
        firstCarrierMeansOfTransportDetails: 'details',
        secondCarrierOrganisationName: 'Test organisation 4',
        secondCarrierAddress: '3 Some Street, Paris, 75002',
        secondCarrierCountry: 'England',
        secondCarrierContactFullName: 'Jane Doe',
        secondCarrierContactPhoneNumber: '0033140000044',
        secondCarrierFaxNumber: '',
        secondCarrierEmailAddress: 'test4@test.com',
        secondCarrierMeansOfTransport: 'Road',
        secondCarrierMeansOfTransportDetails: '',
        thirdCarrierOrganisationName: '',
        thirdCarrierAddress: '',
        thirdCarrierCountry: '',
        thirdCarrierContactFullName: '',
        thirdCarrierContactPhoneNumber: '',
        thirdCarrierFaxNumber: '',
        thirdCarrierEmailAddress: '',
        thirdCarrierMeansOfTransport: '',
        thirdCarrierMeansOfTransportDetails: '',
        fourthCarrierOrganisationName: '',
        fourthCarrierAddress: '',
        fourthCarrierCountry: '',
        fourthCarrierContactFullName: '',
        fourthCarrierContactPhoneNumber: '',
        fourthCarrierFaxNumber: '',
        fourthCarrierEmailAddress: '',
        fourthCarrierMeansOfTransport: '',
        fourthCarrierMeansOfTransportDetails: '',
        fifthCarrierOrganisationName: '',
        fifthCarrierAddress: '',
        fifthCarrierCountry: '',
        fifthCarrierContactFullName: '',
        fifthCarrierContactPhoneNumber: '',
        fifthCarrierFaxNumber: '',
        fifthCarrierEmailAddress: '',
        fifthCarrierMeansOfTransport: '',
        fifthCarrierMeansOfTransportDetails: '',
      },
      false,
      countriesIncludingUk,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'Carriers',
        message: secondCarrierErrorMessages.invalidCountry,
      },
    ]);
  });
});

describe('validateWasteCodeSubSectionAndCarriersCrossSection', () => {
  it('passes WasteCodeSubSectionAndCarriers cross section validation', async () => {
    let wasteCodeSubSection: WasteDescription['wasteCode'] = {
      type: 'BaselAnnexIX',
      code: 'B1010',
    };
    let response = validateWasteCodeSubSectionAndCarriersCrossSection(
      wasteCodeSubSection,
      {
        firstCarrierOrganisationName: 'Test organisation 3',
        firstCarrierAddress: 'Some address, London, EC2N4AY',
        firstCarrierCountry: 'England',
        firstCarrierContactFullName: 'John Doe',
        firstCarrierContactPhoneNumber: '07888888844',
        firstCarrierFaxNumber: '07888888844',
        firstCarrierEmailAddress: 'test3@test.com',
        firstCarrierMeansOfTransport: 'inland waterways',
        firstCarrierMeansOfTransportDetails: 'details',
        secondCarrierOrganisationName: 'Test organisation 4',
        secondCarrierAddress: '3 Some Street, Paris, 75002',
        secondCarrierCountry: 'France',
        secondCarrierContactFullName: 'Jane Doe',
        secondCarrierContactPhoneNumber: '0033140000044',
        secondCarrierFaxNumber: '',
        secondCarrierEmailAddress: 'test4@test.com',
        secondCarrierMeansOfTransport: 'Road',
        secondCarrierMeansOfTransportDetails: '',
        thirdCarrierOrganisationName: '',
        thirdCarrierAddress: '',
        thirdCarrierCountry: '',
        thirdCarrierContactFullName: '',
        thirdCarrierContactPhoneNumber: '',
        thirdCarrierFaxNumber: '',
        thirdCarrierEmailAddress: '',
        thirdCarrierMeansOfTransport: '',
        thirdCarrierMeansOfTransportDetails: '',
        fourthCarrierOrganisationName: '',
        fourthCarrierAddress: '',
        fourthCarrierCountry: '',
        fourthCarrierContactFullName: '',
        fourthCarrierContactPhoneNumber: '',
        fourthCarrierFaxNumber: '',
        fourthCarrierEmailAddress: '',
        fourthCarrierMeansOfTransport: '',
        fourthCarrierMeansOfTransportDetails: '',
        fifthCarrierOrganisationName: '',
        fifthCarrierAddress: '',
        fifthCarrierCountry: '',
        fifthCarrierContactFullName: '',
        fifthCarrierContactPhoneNumber: '',
        fifthCarrierFaxNumber: '',
        fifthCarrierEmailAddress: '',
        fifthCarrierMeansOfTransport: '',
        fifthCarrierMeansOfTransportDetails: '',
      },
    );
    expect(response.valid).toEqual(true);

    wasteCodeSubSection = { type: 'NotApplicable' };
    response = validateWasteCodeSubSectionAndCarriersCrossSection(
      wasteCodeSubSection,
      {
        firstCarrierOrganisationName: 'Test organisation 3',
        firstCarrierAddress: 'Some address, London, EC2N4AY',
        firstCarrierCountry: 'England',
        firstCarrierContactFullName: 'John Doe',
        firstCarrierContactPhoneNumber: '07888888844',
        firstCarrierFaxNumber: '07888888844',
        firstCarrierEmailAddress: 'test3@test.com',
        firstCarrierMeansOfTransport: '',
        firstCarrierMeansOfTransportDetails: '',
        secondCarrierOrganisationName: 'Test organisation 4',
        secondCarrierAddress: '3 Some Street, Paris, 75002',
        secondCarrierCountry: 'France',
        secondCarrierContactFullName: 'Jane Doe',
        secondCarrierContactPhoneNumber: '0033140000044',
        secondCarrierFaxNumber: '',
        secondCarrierEmailAddress: 'test4@test.com',
        secondCarrierMeansOfTransport: '',
        secondCarrierMeansOfTransportDetails: '',
        thirdCarrierOrganisationName: '',
        thirdCarrierAddress: '',
        thirdCarrierCountry: '',
        thirdCarrierContactFullName: '',
        thirdCarrierContactPhoneNumber: '',
        thirdCarrierFaxNumber: '',
        thirdCarrierEmailAddress: '',
        thirdCarrierMeansOfTransport: '',
        thirdCarrierMeansOfTransportDetails: '',
        fourthCarrierOrganisationName: '',
        fourthCarrierAddress: '',
        fourthCarrierCountry: '',
        fourthCarrierContactFullName: '',
        fourthCarrierContactPhoneNumber: '',
        fourthCarrierFaxNumber: '',
        fourthCarrierEmailAddress: '',
        fourthCarrierMeansOfTransport: '',
        fourthCarrierMeansOfTransportDetails: '',
        fifthCarrierOrganisationName: '',
        fifthCarrierAddress: '',
        fifthCarrierCountry: '',
        fifthCarrierContactFullName: '',
        fifthCarrierContactPhoneNumber: '',
        fifthCarrierFaxNumber: '',
        fifthCarrierEmailAddress: '',
        fifthCarrierMeansOfTransport: '',
        fifthCarrierMeansOfTransportDetails: '',
      },
    );
    expect(response.valid).toEqual(true);
  });

  it('fails WasteCodeSubSectionAndCarriers cross section validation', async () => {
    const wasteCodeSubSection: WasteDescription['wasteCode'] = {
      type: 'NotApplicable',
    };
    const response = validateWasteCodeSubSectionAndCarriersCrossSection(
      wasteCodeSubSection,
      {
        firstCarrierOrganisationName: 'Test organisation 3',
        firstCarrierAddress: 'Some address, London, EC2N4AY',
        firstCarrierCountry: 'England',
        firstCarrierContactFullName: 'John Doe',
        firstCarrierContactPhoneNumber: '07888888844',
        firstCarrierFaxNumber: '07888888844',
        firstCarrierEmailAddress: 'test3@test.com',
        firstCarrierMeansOfTransport: 'inland waterways',
        firstCarrierMeansOfTransportDetails: 'details',
        secondCarrierOrganisationName: 'Test organisation 4',
        secondCarrierAddress: '3 Some Street, Paris, 75002',
        secondCarrierCountry: 'France',
        secondCarrierContactFullName: 'Jane Doe',
        secondCarrierContactPhoneNumber: '0033140000044',
        secondCarrierFaxNumber: '',
        secondCarrierEmailAddress: 'test4@test.com',
        secondCarrierMeansOfTransport: 'Road',
        secondCarrierMeansOfTransportDetails: '',
        thirdCarrierOrganisationName: '',
        thirdCarrierAddress: '',
        thirdCarrierCountry: '',
        thirdCarrierContactFullName: '',
        thirdCarrierContactPhoneNumber: '',
        thirdCarrierFaxNumber: '',
        thirdCarrierEmailAddress: '',
        thirdCarrierMeansOfTransport: '',
        thirdCarrierMeansOfTransportDetails: '',
        fourthCarrierOrganisationName: '',
        fourthCarrierAddress: '',
        fourthCarrierCountry: '',
        fourthCarrierContactFullName: '',
        fourthCarrierContactPhoneNumber: '',
        fourthCarrierFaxNumber: '',
        fourthCarrierEmailAddress: '',
        fourthCarrierMeansOfTransport: '',
        fourthCarrierMeansOfTransportDetails: '',
        fifthCarrierOrganisationName: '',
        fifthCarrierAddress: '',
        fifthCarrierCountry: '',
        fifthCarrierContactFullName: '',
        fifthCarrierContactPhoneNumber: '',
        fifthCarrierFaxNumber: '',
        fifthCarrierEmailAddress: '',
        fifthCarrierMeansOfTransport: '',
        fifthCarrierMeansOfTransportDetails: '',
      },
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        fields: ['WasteDescription', 'Carriers'],
        message:
          validation.CarriersCrossSectionValidationErrorMessages
            .invalidTransport,
      },
      {
        fields: ['WasteDescription', 'Carriers'],
        message:
          validation.CarriersCrossSectionValidationErrorMessages
            .invalidTransportDescription,
      },
    ]);
  });
});

describe('validateCollectionDetailSection', () => {
  it('passes CollectionDetail section validation', async () => {
    let response = validateCollectionDetailSection({
      wasteCollectionOrganisationName: 'Test organisation 1',
      wasteCollectionAddressLine1: '1 Some Street',
      wasteCollectionAddressLine2: '',
      wasteCollectionTownOrCity: 'London',
      wasteCollectionCountry: 'England',
      wasteCollectionPostcode: '',
      wasteCollectionContactFullName: 'John Smith',
      wasteCollectionContactPhoneNumber: '00-44788-888 8888',
      wasteCollectionFaxNumber: '',
      wasteCollectionEmailAddress: 'test1@test.com',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      address: {
        addressLine1: '1 Some Street',
        townCity: 'London',
        country: 'England',
      },
      contactDetails: {
        organisationName: 'Test organisation 1',
        fullName: 'John Smith',
        emailAddress: 'test1@test.com',
        phoneNumber: '00-44788-888 8888',
      },
    });

    response = validateCollectionDetailSection({
      wasteCollectionOrganisationName: 'Test organisation 1',
      wasteCollectionAddressLine1: '1 Some Street',
      wasteCollectionAddressLine2: 'Address line',
      wasteCollectionTownOrCity: 'Belfast',
      wasteCollectionCountry: 'northern ireland',
      wasteCollectionPostcode: 'EC2N4AY',
      wasteCollectionContactFullName: 'John Smith',
      wasteCollectionContactPhoneNumber: "'00447888888888'",
      wasteCollectionFaxNumber: "'+ (44)78888-88888'",
      wasteCollectionEmailAddress: 'test1@test.com',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      address: {
        addressLine1: '1 Some Street',
        addressLine2: 'Address line',
        townCity: 'Belfast',
        postcode: 'EC2N4AY',
        country: 'Northern Ireland',
      },
      contactDetails: {
        organisationName: 'Test organisation 1',
        fullName: 'John Smith',
        emailAddress: 'test1@test.com',
        phoneNumber: '00447888888888',
        faxNumber: '+ (44)78888-88888',
      },
    });
  });

  it('fails CollectionDetail section validation', async () => {
    let response = validateCollectionDetailSection({
      wasteCollectionOrganisationName: '',
      wasteCollectionAddressLine1: '',
      wasteCollectionAddressLine2: '',
      wasteCollectionTownOrCity: '',
      wasteCollectionCountry: '',
      wasteCollectionPostcode: '',
      wasteCollectionContactFullName: '',
      wasteCollectionContactPhoneNumber: '',
      wasteCollectionFaxNumber: '',
      wasteCollectionEmailAddress: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .emptyOrganisationName,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.emptyAddressLine1,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.emptyTownOrCity,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.emptyCountry,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .emptyContactFullName,
      },
      {
        field: 'CollectionDetail',
        message: validation.CollectionDetailValidationErrorMessages.emptyPhone,
      },
      {
        field: 'CollectionDetail',
        message: validation.CollectionDetailValidationErrorMessages.emptyEmail,
      },
    ]);

    response = validateCollectionDetailSection({
      wasteCollectionOrganisationName: '     ',
      wasteCollectionAddressLine1: '     ',
      wasteCollectionAddressLine2: '     ',
      wasteCollectionTownOrCity: '     ',
      wasteCollectionCountry: '     ',
      wasteCollectionPostcode: '     ',
      wasteCollectionContactFullName: '     ',
      wasteCollectionContactPhoneNumber: '+34556757895678',
      wasteCollectionFaxNumber: '     ',
      wasteCollectionEmailAddress: '     ',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .emptyOrganisationName,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.emptyAddressLine1,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.emptyTownOrCity,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.emptyCountry,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.invalidPostcode,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .emptyContactFullName,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.invalidPhone,
      },
      {
        field: 'CollectionDetail',
        message: validation.CollectionDetailValidationErrorMessages.invalidFax,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.invalidEmail,
      },
    ]);

    response = validateCollectionDetailSection({
      wasteCollectionOrganisationName: faker.string.sample(251),
      wasteCollectionAddressLine1: faker.string.sample(251),
      wasteCollectionAddressLine2: faker.string.sample(251),
      wasteCollectionTownOrCity: faker.string.sample(251),
      wasteCollectionCountry: faker.string.sample(251),
      wasteCollectionPostcode: faker.string.sample(251),
      wasteCollectionContactFullName: faker.string.sample(251),
      wasteCollectionContactPhoneNumber: faker.string.sample(30),
      wasteCollectionFaxNumber: faker.string.sample(30),
      wasteCollectionEmailAddress: faker.string.sample(251),
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .charTooManyOrganisationName,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .charTooManyAddressLine1,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .charTooManyAddressLine2,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .charTooManyTownOrCity,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.invalidCountry,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.invalidPostcode,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages
            .charTooManyContactFullName,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.invalidPhone,
      },
      {
        field: 'CollectionDetail',
        message: validation.CollectionDetailValidationErrorMessages.invalidFax,
      },
      {
        field: 'CollectionDetail',
        message:
          validation.CollectionDetailValidationErrorMessages.charTooManyEmail,
      },
    ]);
  });
});

describe('validateUkExitLocationSection', () => {
  it('passes UkExitLocation section validation', async () => {
    let response = validateUkExitLocationSection({
      whereWasteLeavesUk: '',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({ provided: 'No' });

    response = validateUkExitLocationSection({
      whereWasteLeavesUk: 'Dover',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({ provided: 'Yes', value: 'Dover' });

    response = validateUkExitLocationSection({
      whereWasteLeavesUk: "some-value.-,'",
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      provided: 'Yes',
      value: "some-value.-,'",
    });
  });

  it('fails UkExitLocation section validation', async () => {
    let response = validateUkExitLocationSection({
      whereWasteLeavesUk: faker.string.sample(51),
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'UkExitLocation',
      message: validation.UkExitLocationValidationErrorMessages.charTooMany,
    });

    response = validateUkExitLocationSection({
      whereWasteLeavesUk: 'some_value',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'UkExitLocation',
      message: validation.UkExitLocationValidationErrorMessages.invalid,
    });
  });
});

describe('validateTransitCountriesSection', () => {
  it('passes TransitCountries section validation', async () => {
    let response = validateTransitCountriesSection(
      {
        transitCountries: '',
      },
      countries,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual([]);

    response = validateTransitCountriesSection(
      {
        transitCountries: 'france',
      },
      countries,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual(['France [FR]']);

    response = validateTransitCountriesSection(
      {
        transitCountries: 'France;france',
      },
      countries,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual(['France [FR]']);

    response = validateTransitCountriesSection(
      {
        transitCountries: 'France ; Belgium;Burkina Faso',
      },
      countries,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual([
      'France [FR]',
      'Belgium [BE]',
      'Burkina Faso [BF]',
    ]);
  });

  it('fails TransitCountries section validation', async () => {
    let response = validateTransitCountriesSection(
      {
        transitCountries: 'some_value',
      },
      countries,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'TransitCountries',
      message: validation.TransitCountriesValidationErrorMessages.invalid,
    });

    response = validateTransitCountriesSection(
      {
        transitCountries: 'France;some_value',
      },
      countries,
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'TransitCountries',
      message: validation.TransitCountriesValidationErrorMessages.invalid,
    });
  });
});

describe('validateImporterDetailAndTransitCountriesCrossSection', () => {
  it('passes ImporterDetailAndTransitCountries cross section validation', async () => {
    const importerDetail: ImporterDetail = {
      importerAddressDetails: {
        organisationName: 'Test organisation 2',
        address: '2 Some Street, Paris, 75002',
        country: 'France [FR]',
      },
      importerContactDetails: {
        fullName: 'Jane Smith',
        emailAddress: 'test2@test.com',
        phoneNumber: '0033140000000',
      },
    };
    let transitCountries: TransitCountries = [];
    let response = validateImporterDetailAndTransitCountriesCrossSection(
      importerDetail,
      transitCountries,
    );
    expect(response.valid).toEqual(true);

    transitCountries = ['Belgium [BE]', 'Burkina Faso [BF]'];
    response = validateImporterDetailAndTransitCountriesCrossSection(
      importerDetail,
      transitCountries,
    );
    expect(response.valid).toEqual(true);
  });

  it('fails ImporterDetailAndTransitCountries cross section validation', async () => {
    const importerDetail: ImporterDetail = {
      importerAddressDetails: {
        organisationName: 'Test organisation 2',
        address: '2 Some Street, Paris, 75002',
        country: 'France [FR]',
      },
      importerContactDetails: {
        fullName: 'Jane Smith',
        emailAddress: 'test2@test.com',
        phoneNumber: '0033140000000',
      },
    };

    const transitCountries = [
      'France [FR]',
      'Belgium [BE]',
      'Burkina Faso [BF]',
    ];
    const response = validateImporterDetailAndTransitCountriesCrossSection(
      importerDetail,
      transitCountries,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        fields: ['ImporterDetail', 'TransitCountries'],
        message:
          validation.ImporterDetailValidationErrorMessages
            .invalidCrossSectionCountry,
      },
      {
        fields: ['ImporterDetail', 'TransitCountries'],
        message:
          validation.TransitCountriesValidationErrorMessages
            .invalidCrossSection,
      },
    ]);
  });
});

describe('validateRecoveryFacilityDetailSection', () => {
  it('passes RecoveryFacilityDetail section validation', async () => {
    let response = validateRecoveryFacilityDetailSection(
      {
        interimSiteOrganisationName: '',
        interimSiteAddress: '',
        interimSiteCountry: '',
        interimSiteContactFullName: '',
        interimSiteContactPhoneNumber: '',
        interimSiteFaxNumber: '',
        interimSiteEmailAddress: '',
        interimSiteRecoveryCode: '',
        laboratoryOrganisationName: '',
        laboratoryAddress: '',
        laboratoryCountry: '',
        laboratoryContactFullName: '',
        laboratoryContactPhoneNumber: '',
        laboratoryFaxNumber: '',
        laboratoryEmailAddress: '',
        laboratoryDisposalCode: '',
        firstRecoveryFacilityOrganisationName: 'Test organisation 6',
        firstRecoveryFacilityAddress: '4 Some Street, Paris, 75002',
        firstRecoveryFacilityCountry: 'France',
        firstRecoveryFacilityContactFullName: 'Jean Philip',
        firstRecoveryFacilityContactPhoneNumber: '0033140000066',
        firstRecoveryFacilityFaxNumber: '',
        firstRecoveryFacilityEmailAddress: 'test6@test.com',
        firstRecoveryFacilityRecoveryCode: 'r1',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
      false,
      countries,
      recoveryCodes,
      disposalCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual([
      {
        addressDetails: {
          name: 'Test organisation 6',
          address: '4 Some Street, Paris, 75002',
          country: 'France [FR]',
        },
        contactDetails: {
          fullName: 'Jean Philip',
          emailAddress: 'test6@test.com',
          phoneNumber: '0033140000066',
        },
        recoveryFacilityType: {
          type: 'RecoveryFacility',
          recoveryCode: 'R1',
        },
      },
    ]);

    response = validateRecoveryFacilityDetailSection(
      {
        interimSiteOrganisationName: 'Test organisation 7',
        interimSiteAddress: '5 Some Street, Paris, 75002',
        interimSiteCountry: 'France',
        interimSiteContactFullName: 'Jean Luc',
        interimSiteContactPhoneNumber: '0033140000077',
        interimSiteFaxNumber: '0033140000077',
        interimSiteEmailAddress: 'test7@test.com',
        interimSiteRecoveryCode: 'R13',
        laboratoryOrganisationName: '',
        laboratoryAddress: '',
        laboratoryCountry: '',
        laboratoryContactFullName: '',
        laboratoryContactPhoneNumber: '',
        laboratoryFaxNumber: '',
        laboratoryEmailAddress: '',
        laboratoryDisposalCode: '',
        firstRecoveryFacilityOrganisationName: 'Test organisation 6',
        firstRecoveryFacilityAddress: '4 Some Street, Paris, 75002',
        firstRecoveryFacilityCountry: 'France',
        firstRecoveryFacilityContactFullName: 'Jean Philip',
        firstRecoveryFacilityContactPhoneNumber: '0033140000066',
        firstRecoveryFacilityFaxNumber: '',
        firstRecoveryFacilityEmailAddress: 'test6@test.com',
        firstRecoveryFacilityRecoveryCode: 'r1',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
      false,
      countries,
      recoveryCodes,
      disposalCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual([
      {
        addressDetails: {
          name: 'Test organisation 7',
          address: '5 Some Street, Paris, 75002',
          country: 'France [FR]',
        },
        contactDetails: {
          fullName: 'Jean Luc',
          emailAddress: 'test7@test.com',
          phoneNumber: '0033140000077',
          faxNumber: '0033140000077',
        },
        recoveryFacilityType: {
          type: 'InterimSite',
          recoveryCode: 'R13',
        },
      },
      {
        addressDetails: {
          name: 'Test organisation 6',
          address: '4 Some Street, Paris, 75002',
          country: 'France [FR]',
        },
        contactDetails: {
          fullName: 'Jean Philip',
          emailAddress: 'test6@test.com',
          phoneNumber: '0033140000066',
        },
        recoveryFacilityType: {
          type: 'RecoveryFacility',
          recoveryCode: 'R1',
        },
      },
    ]);

    response = validateRecoveryFacilityDetailSection(
      {
        interimSiteOrganisationName: '',
        interimSiteAddress: '',
        interimSiteCountry: '',
        interimSiteContactFullName: '',
        interimSiteContactPhoneNumber: '',
        interimSiteFaxNumber: '',
        interimSiteEmailAddress: '',
        interimSiteRecoveryCode: '',
        laboratoryOrganisationName: 'Test organisation 6',
        laboratoryAddress: '4 Some Street, Paris, 75002',
        laboratoryCountry: 'France',
        laboratoryContactFullName: 'Jean Philip',
        laboratoryContactPhoneNumber: '0033140000066',
        laboratoryFaxNumber: '',
        laboratoryEmailAddress: 'test6@test.com',
        laboratoryDisposalCode: 'd1',
        firstRecoveryFacilityOrganisationName: '',
        firstRecoveryFacilityAddress: '',
        firstRecoveryFacilityCountry: '',
        firstRecoveryFacilityContactFullName: '',
        firstRecoveryFacilityContactPhoneNumber: '',
        firstRecoveryFacilityFaxNumber: '',
        firstRecoveryFacilityEmailAddress: '',
        firstRecoveryFacilityRecoveryCode: '',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
      true,
      countries,
      recoveryCodes,
      disposalCodes,
    );
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual([
      {
        addressDetails: {
          name: 'Test organisation 6',
          address: '4 Some Street, Paris, 75002',
          country: 'France [FR]',
        },
        contactDetails: {
          fullName: 'Jean Philip',
          emailAddress: 'test6@test.com',
          phoneNumber: '0033140000066',
        },
        recoveryFacilityType: {
          type: 'Laboratory',
          disposalCode: 'D1',
        },
      },
    ]);
  });

  const interimSiteErrorMessages =
    validation.RecoveryFacilityDetailValidationErrorMessages('InterimSite', 1);
  const laboratoryErrorMessages =
    validation.RecoveryFacilityDetailValidationErrorMessages('Laboratory', 1);
  const firstRecoveryFacilityErrorMessages =
    validation.RecoveryFacilityDetailValidationErrorMessages(
      'RecoveryFacility',
      1,
    );

  it('fails RecoveryFacilityDetail section validation', async () => {
    let response = validateRecoveryFacilityDetailSection(
      {
        interimSiteOrganisationName: '     ',
        interimSiteAddress: '     ',
        interimSiteCountry: '     ',
        interimSiteContactFullName: '     ',
        interimSiteContactPhoneNumber: '      ',
        interimSiteFaxNumber: '     ',
        interimSiteEmailAddress: '     ',
        interimSiteRecoveryCode: '     ',
        laboratoryOrganisationName: '',
        laboratoryAddress: '',
        laboratoryCountry: '',
        laboratoryContactFullName: '',
        laboratoryContactPhoneNumber: '',
        laboratoryFaxNumber: '',
        laboratoryEmailAddress: '',
        laboratoryDisposalCode: '',
        firstRecoveryFacilityOrganisationName: '     ',
        firstRecoveryFacilityAddress: '     ',
        firstRecoveryFacilityCountry: '     ',
        firstRecoveryFacilityContactFullName: '     ',
        firstRecoveryFacilityContactPhoneNumber: '     ',
        firstRecoveryFacilityFaxNumber: '     ',
        firstRecoveryFacilityEmailAddress: '     ',
        firstRecoveryFacilityRecoveryCode: '     ',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
      false,
      countries,
      recoveryCodes,
      disposalCodes,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.emptyOrganisationName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.emptyAddress,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.invalidCountry,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.emptyContactFullName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.invalidPhone,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.invalidFax,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.invalidEmail,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.invalidCode,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.emptyOrganisationName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.emptyAddress,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.invalidCountry,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.emptyContactFullName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.invalidPhone,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.invalidFax,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.invalidEmail,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.invalidCode,
      },
    ]);

    response = validateRecoveryFacilityDetailSection(
      {
        interimSiteOrganisationName: faker.string.sample(251),
        interimSiteAddress: faker.string.sample(251),
        interimSiteCountry: faker.string.sample(50),
        interimSiteContactFullName: faker.string.sample(251),
        interimSiteContactPhoneNumber: faker.string.sample(50),
        interimSiteFaxNumber: faker.string.sample(50),
        interimSiteEmailAddress: faker.string.sample(50),
        interimSiteRecoveryCode: faker.string.sample(50),
        laboratoryOrganisationName: '',
        laboratoryAddress: '',
        laboratoryCountry: '',
        laboratoryContactFullName: '',
        laboratoryContactPhoneNumber: '',
        laboratoryFaxNumber: '',
        laboratoryEmailAddress: '',
        laboratoryDisposalCode: '',
        firstRecoveryFacilityOrganisationName: faker.string.sample(251),
        firstRecoveryFacilityAddress: faker.string.sample(251),
        firstRecoveryFacilityCountry: faker.string.sample(50),
        firstRecoveryFacilityContactFullName: faker.string.sample(251),
        firstRecoveryFacilityContactPhoneNumber: faker.string.sample(50),
        firstRecoveryFacilityFaxNumber: faker.string.sample(50),
        firstRecoveryFacilityEmailAddress: faker.string.sample(50),
        firstRecoveryFacilityRecoveryCode: faker.string.sample(50),
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
      false,
      countries,
      recoveryCodes,
      disposalCodes,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.charTooManyOrganisationName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.charTooManyAddress,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.invalidCountry,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.charTooManyContactFullName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.invalidPhone,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.invalidFax,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.invalidEmail,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: interimSiteErrorMessages.invalidCode,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.charTooManyOrganisationName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.charTooManyAddress,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.invalidCountry,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.charTooManyContactFullName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.invalidPhone,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.invalidFax,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.invalidEmail,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: firstRecoveryFacilityErrorMessages.invalidCode,
      },
    ]);

    response = validateRecoveryFacilityDetailSection(
      {
        interimSiteOrganisationName: '',
        interimSiteAddress: '',
        interimSiteCountry: '',
        interimSiteContactFullName: '',
        interimSiteContactPhoneNumber: '',
        interimSiteFaxNumber: '',
        interimSiteEmailAddress: '',
        interimSiteRecoveryCode: '',
        laboratoryOrganisationName: '     ',
        laboratoryAddress: '     ',
        laboratoryCountry: '     ',
        laboratoryContactFullName: '     ',
        laboratoryContactPhoneNumber: '     ',
        laboratoryFaxNumber: '     ',
        laboratoryEmailAddress: '     ',
        laboratoryDisposalCode: '     ',
        firstRecoveryFacilityOrganisationName: '',
        firstRecoveryFacilityAddress: '',
        firstRecoveryFacilityCountry: '',
        firstRecoveryFacilityContactFullName: '',
        firstRecoveryFacilityContactPhoneNumber: '',
        firstRecoveryFacilityFaxNumber: '',
        firstRecoveryFacilityEmailAddress: '',
        firstRecoveryFacilityRecoveryCode: '',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
      true,
      countries,
      recoveryCodes,
      disposalCodes,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.emptyOrganisationName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.emptyAddress,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.invalidCountry,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.emptyContactFullName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.invalidPhone,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.invalidFax,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.invalidEmail,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.invalidCode,
      },
    ]);

    response = validateRecoveryFacilityDetailSection(
      {
        interimSiteOrganisationName: '',
        interimSiteAddress: '',
        interimSiteCountry: '',
        interimSiteContactFullName: '',
        interimSiteContactPhoneNumber: '',
        interimSiteFaxNumber: '',
        interimSiteEmailAddress: '',
        interimSiteRecoveryCode: '',
        laboratoryOrganisationName: faker.string.sample(251),
        laboratoryAddress: faker.string.sample(251),
        laboratoryCountry: faker.string.sample(50),
        laboratoryContactFullName: faker.string.sample(251),
        laboratoryContactPhoneNumber: faker.string.sample(50),
        laboratoryFaxNumber: faker.string.sample(50),
        laboratoryEmailAddress: faker.string.sample(50),
        laboratoryDisposalCode: faker.string.sample(50),
        firstRecoveryFacilityOrganisationName: '',
        firstRecoveryFacilityAddress: '',
        firstRecoveryFacilityCountry: '',
        firstRecoveryFacilityContactFullName: '',
        firstRecoveryFacilityContactPhoneNumber: '',
        firstRecoveryFacilityFaxNumber: '',
        firstRecoveryFacilityEmailAddress: '',
        firstRecoveryFacilityRecoveryCode: '',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
      true,
      countries,
      recoveryCodes,
      disposalCodes,
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.charTooManyOrganisationName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.charTooManyAddress,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.invalidCountry,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.charTooManyContactFullName,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.invalidPhone,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.invalidFax,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.invalidEmail,
      },
      {
        field: 'RecoveryFacilityDetail',
        message: laboratoryErrorMessages.invalidCode,
      },
    ]);
  });
});

describe('validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection', () => {
  it('passes WasteCodeSubSectionAndRecoveryFacilityDetail cross section validation', async () => {
    let wasteCodeSubSection: WasteDescription['wasteCode'] = {
      type: 'BaselAnnexIX',
      code: 'B1010',
    };
    let response =
      validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        wasteCodeSubSection,
        {
          interimSiteOrganisationName: '',
          interimSiteAddress: '',
          interimSiteCountry: '',
          interimSiteContactFullName: '',
          interimSiteContactPhoneNumber: '',
          interimSiteFaxNumber: '',
          interimSiteEmailAddress: '',
          interimSiteRecoveryCode: '',
          laboratoryOrganisationName: '',
          laboratoryAddress: '',
          laboratoryCountry: '',
          laboratoryContactFullName: '',
          laboratoryContactPhoneNumber: '',
          laboratoryFaxNumber: '',
          laboratoryEmailAddress: '',
          laboratoryDisposalCode: '',
          firstRecoveryFacilityOrganisationName: 'Test organisation 6',
          firstRecoveryFacilityAddress: '4 Some Street, Paris, 75002',
          firstRecoveryFacilityCountry: 'France',
          firstRecoveryFacilityContactFullName: 'Jean Philip',
          firstRecoveryFacilityContactPhoneNumber: '0033140000066',
          firstRecoveryFacilityFaxNumber: '',
          firstRecoveryFacilityEmailAddress: 'test6@test.com',
          firstRecoveryFacilityRecoveryCode: 'r1',
          secondRecoveryFacilityOrganisationName: '',
          secondRecoveryFacilityAddress: '',
          secondRecoveryFacilityCountry: '',
          secondRecoveryFacilityContactFullName: '',
          secondRecoveryFacilityContactPhoneNumber: '',
          secondRecoveryFacilityFaxNumber: '',
          secondRecoveryFacilityEmailAddress: '',
          secondRecoveryFacilityRecoveryCode: '',
          thirdRecoveryFacilityOrganisationName: '',
          thirdRecoveryFacilityAddress: '',
          thirdRecoveryFacilityCountry: '',
          thirdRecoveryFacilityContactFullName: '',
          thirdRecoveryFacilityContactPhoneNumber: '',
          thirdRecoveryFacilityFaxNumber: '',
          thirdRecoveryFacilityEmailAddress: '',
          thirdRecoveryFacilityRecoveryCode: '',
          fourthRecoveryFacilityOrganisationName: '',
          fourthRecoveryFacilityAddress: '',
          fourthRecoveryFacilityCountry: '',
          fourthRecoveryFacilityContactFullName: '',
          fourthRecoveryFacilityContactPhoneNumber: '',
          fourthRecoveryFacilityFaxNumber: '',
          fourthRecoveryFacilityEmailAddress: '',
          fourthRecoveryFacilityRecoveryCode: '',
          fifthRecoveryFacilityOrganisationName: '',
          fifthRecoveryFacilityAddress: '',
          fifthRecoveryFacilityCountry: '',
          fifthRecoveryFacilityContactFullName: '',
          fifthRecoveryFacilityContactPhoneNumber: '',
          fifthRecoveryFacilityFaxNumber: '',
          fifthRecoveryFacilityEmailAddress: '',
          fifthRecoveryFacilityRecoveryCode: '',
        },
      );
    expect(response.valid).toEqual(true);

    response = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
      wasteCodeSubSection,
      {
        interimSiteOrganisationName: 'Test organisation 7',
        interimSiteAddress: '5 Some Street, Paris, 75002',
        interimSiteCountry: 'France',
        interimSiteContactFullName: 'Jean Luc',
        interimSiteContactPhoneNumber: '0033140000077',
        interimSiteFaxNumber: '0033140000077',
        interimSiteEmailAddress: 'test7@test.com',
        interimSiteRecoveryCode: 'R13',
        laboratoryOrganisationName: '',
        laboratoryAddress: '',
        laboratoryCountry: '',
        laboratoryContactFullName: '',
        laboratoryContactPhoneNumber: '',
        laboratoryFaxNumber: '',
        laboratoryEmailAddress: '',
        laboratoryDisposalCode: '',
        firstRecoveryFacilityOrganisationName: 'Test organisation 6',
        firstRecoveryFacilityAddress: '4 Some Street, Paris, 75002',
        firstRecoveryFacilityCountry: 'France',
        firstRecoveryFacilityContactFullName: 'Jean Philip',
        firstRecoveryFacilityContactPhoneNumber: '0033140000066',
        firstRecoveryFacilityFaxNumber: '',
        firstRecoveryFacilityEmailAddress: 'test6@test.com',
        firstRecoveryFacilityRecoveryCode: 'r1',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
    );
    expect(response.valid).toEqual(true);

    wasteCodeSubSection = { type: 'NotApplicable' };
    response = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
      wasteCodeSubSection,
      {
        interimSiteOrganisationName: '',
        interimSiteAddress: '',
        interimSiteCountry: '',
        interimSiteContactFullName: '',
        interimSiteContactPhoneNumber: '',
        interimSiteFaxNumber: '',
        interimSiteEmailAddress: '',
        interimSiteRecoveryCode: '',
        laboratoryOrganisationName: 'Test organisation 6',
        laboratoryAddress: '4 Some Street, Paris, 75002',
        laboratoryCountry: 'France',
        laboratoryContactFullName: 'Jean Philip',
        laboratoryContactPhoneNumber: '0033140000066',
        laboratoryFaxNumber: '',
        laboratoryEmailAddress: 'test6@test.com',
        laboratoryDisposalCode: 'd1',
        firstRecoveryFacilityOrganisationName: '',
        firstRecoveryFacilityAddress: '',
        firstRecoveryFacilityCountry: '',
        firstRecoveryFacilityContactFullName: '',
        firstRecoveryFacilityContactPhoneNumber: '',
        firstRecoveryFacilityFaxNumber: '',
        firstRecoveryFacilityEmailAddress: '',
        firstRecoveryFacilityRecoveryCode: '',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
    );
    expect(response.valid).toEqual(true);
  });

  it('fails WasteCodeSubSectionAndRecoveryFacilityDetail cross section validation', async () => {
    let wasteCodeSubSection: WasteDescription['wasteCode'] = {
      type: 'BaselAnnexIX',
      code: 'B1010',
    };
    let response =
      validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
        wasteCodeSubSection,
        {
          interimSiteOrganisationName: '',
          interimSiteAddress: '',
          interimSiteCountry: '',
          interimSiteContactFullName: '',
          interimSiteContactPhoneNumber: '',
          interimSiteFaxNumber: '',
          interimSiteEmailAddress: '',
          interimSiteRecoveryCode: '',
          laboratoryOrganisationName: 'Invalid',
          laboratoryAddress: '',
          laboratoryCountry: '',
          laboratoryContactFullName: '',
          laboratoryContactPhoneNumber: '',
          laboratoryFaxNumber: '',
          laboratoryEmailAddress: '',
          laboratoryDisposalCode: '',
          firstRecoveryFacilityOrganisationName: 'Test organisation 6',
          firstRecoveryFacilityAddress: '4 Some Street, Paris, 75002',
          firstRecoveryFacilityCountry: 'France',
          firstRecoveryFacilityContactFullName: 'Jean Philip',
          firstRecoveryFacilityContactPhoneNumber: '0033140000066',
          firstRecoveryFacilityFaxNumber: '',
          firstRecoveryFacilityEmailAddress: 'test6@test.com',
          firstRecoveryFacilityRecoveryCode: 'r1',
          secondRecoveryFacilityOrganisationName: '',
          secondRecoveryFacilityAddress: '',
          secondRecoveryFacilityCountry: '',
          secondRecoveryFacilityContactFullName: '',
          secondRecoveryFacilityContactPhoneNumber: '',
          secondRecoveryFacilityFaxNumber: '',
          secondRecoveryFacilityEmailAddress: '',
          secondRecoveryFacilityRecoveryCode: '',
          thirdRecoveryFacilityOrganisationName: '',
          thirdRecoveryFacilityAddress: '',
          thirdRecoveryFacilityCountry: '',
          thirdRecoveryFacilityContactFullName: '',
          thirdRecoveryFacilityContactPhoneNumber: '',
          thirdRecoveryFacilityFaxNumber: '',
          thirdRecoveryFacilityEmailAddress: '',
          thirdRecoveryFacilityRecoveryCode: '',
          fourthRecoveryFacilityOrganisationName: '',
          fourthRecoveryFacilityAddress: '',
          fourthRecoveryFacilityCountry: '',
          fourthRecoveryFacilityContactFullName: '',
          fourthRecoveryFacilityContactPhoneNumber: '',
          fourthRecoveryFacilityFaxNumber: '',
          fourthRecoveryFacilityEmailAddress: '',
          fourthRecoveryFacilityRecoveryCode: '',
          fifthRecoveryFacilityOrganisationName: '',
          fifthRecoveryFacilityAddress: '',
          fifthRecoveryFacilityCountry: '',
          fifthRecoveryFacilityContactFullName: '',
          fifthRecoveryFacilityContactPhoneNumber: '',
          fifthRecoveryFacilityFaxNumber: '',
          fifthRecoveryFacilityEmailAddress: '',
          fifthRecoveryFacilityRecoveryCode: '',
        },
      );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        fields: ['WasteDescription', 'RecoveryFacilityDetail'],
        message:
          validation.RecoveryFacilityDetailCrossSectionValidationErrorMessages
            .invalidLaboratory,
      },
    ]);

    response = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
      wasteCodeSubSection,
      {
        interimSiteOrganisationName: 'Test organisation 7',
        interimSiteAddress: '5 Some Street, Paris, 75002',
        interimSiteCountry: 'France',
        interimSiteContactFullName: 'Jean Luc',
        interimSiteContactPhoneNumber: '0033140000077',
        interimSiteFaxNumber: '0033140000077',
        interimSiteEmailAddress: 'test7@test.com',
        interimSiteRecoveryCode: 'R13',
        laboratoryOrganisationName: 'Invalid',
        laboratoryAddress: '',
        laboratoryCountry: '',
        laboratoryContactFullName: '',
        laboratoryContactPhoneNumber: '',
        laboratoryFaxNumber: '',
        laboratoryEmailAddress: '',
        laboratoryDisposalCode: '',
        firstRecoveryFacilityOrganisationName: 'Test organisation 6',
        firstRecoveryFacilityAddress: '4 Some Street, Paris, 75002',
        firstRecoveryFacilityCountry: 'France',
        firstRecoveryFacilityContactFullName: 'Jean Philip',
        firstRecoveryFacilityContactPhoneNumber: '0033140000066',
        firstRecoveryFacilityFaxNumber: '',
        firstRecoveryFacilityEmailAddress: 'test6@test.com',
        firstRecoveryFacilityRecoveryCode: 'r1',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        fields: ['WasteDescription', 'RecoveryFacilityDetail'],
        message:
          validation.RecoveryFacilityDetailCrossSectionValidationErrorMessages
            .invalidLaboratory,
      },
    ]);

    wasteCodeSubSection = { type: 'NotApplicable' };
    response = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
      wasteCodeSubSection,
      {
        interimSiteOrganisationName: 'Invalid',
        interimSiteAddress: '',
        interimSiteCountry: '',
        interimSiteContactFullName: '',
        interimSiteContactPhoneNumber: '',
        interimSiteFaxNumber: '',
        interimSiteEmailAddress: '',
        interimSiteRecoveryCode: '',
        laboratoryOrganisationName: 'Test organisation 6',
        laboratoryAddress: '4 Some Street, Paris, 75002',
        laboratoryCountry: 'France',
        laboratoryContactFullName: 'Jean Philip',
        laboratoryContactPhoneNumber: '0033140000066',
        laboratoryFaxNumber: '',
        laboratoryEmailAddress: 'test6@test.com',
        laboratoryDisposalCode: 'd1',
        firstRecoveryFacilityOrganisationName: '',
        firstRecoveryFacilityAddress: '',
        firstRecoveryFacilityCountry: '',
        firstRecoveryFacilityContactFullName: '',
        firstRecoveryFacilityContactPhoneNumber: '',
        firstRecoveryFacilityFaxNumber: '',
        firstRecoveryFacilityEmailAddress: '',
        firstRecoveryFacilityRecoveryCode: '',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        fields: ['WasteDescription', 'RecoveryFacilityDetail'],
        message:
          validation.RecoveryFacilityDetailCrossSectionValidationErrorMessages
            .invalidInterimSite,
      },
    ]);

    response = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
      wasteCodeSubSection,
      {
        interimSiteOrganisationName: '',
        interimSiteAddress: '',
        interimSiteCountry: '',
        interimSiteContactFullName: '',
        interimSiteContactPhoneNumber: '',
        interimSiteFaxNumber: '',
        interimSiteEmailAddress: '',
        interimSiteRecoveryCode: '',
        laboratoryOrganisationName: 'Test organisation 6',
        laboratoryAddress: '4 Some Street, Paris, 75002',
        laboratoryCountry: 'France',
        laboratoryContactFullName: 'Jean Philip',
        laboratoryContactPhoneNumber: '0033140000066',
        laboratoryFaxNumber: '',
        laboratoryEmailAddress: 'test6@test.com',
        laboratoryDisposalCode: 'd1',
        firstRecoveryFacilityOrganisationName: 'Invalid',
        firstRecoveryFacilityAddress: '',
        firstRecoveryFacilityCountry: '',
        firstRecoveryFacilityContactFullName: '',
        firstRecoveryFacilityContactPhoneNumber: '',
        firstRecoveryFacilityFaxNumber: '',
        firstRecoveryFacilityEmailAddress: '',
        firstRecoveryFacilityRecoveryCode: '',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        fields: ['WasteDescription', 'RecoveryFacilityDetail'],
        message:
          validation.RecoveryFacilityDetailCrossSectionValidationErrorMessages
            .invalidRecoveryFacility,
      },
    ]);

    response = validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
      wasteCodeSubSection,
      {
        interimSiteOrganisationName: 'Invalid',
        interimSiteAddress: '',
        interimSiteCountry: '',
        interimSiteContactFullName: '',
        interimSiteContactPhoneNumber: '',
        interimSiteFaxNumber: '',
        interimSiteEmailAddress: '',
        interimSiteRecoveryCode: '',
        laboratoryOrganisationName: 'Test organisation 6',
        laboratoryAddress: '4 Some Street, Paris, 75002',
        laboratoryCountry: 'France',
        laboratoryContactFullName: 'Jean Philip',
        laboratoryContactPhoneNumber: '0033140000066',
        laboratoryFaxNumber: '',
        laboratoryEmailAddress: 'test6@test.com',
        laboratoryDisposalCode: 'd1',
        firstRecoveryFacilityOrganisationName: 'Invalid',
        firstRecoveryFacilityAddress: '',
        firstRecoveryFacilityCountry: '',
        firstRecoveryFacilityContactFullName: '',
        firstRecoveryFacilityContactPhoneNumber: '',
        firstRecoveryFacilityFaxNumber: '',
        firstRecoveryFacilityEmailAddress: '',
        firstRecoveryFacilityRecoveryCode: '',
        secondRecoveryFacilityOrganisationName: '',
        secondRecoveryFacilityAddress: '',
        secondRecoveryFacilityCountry: '',
        secondRecoveryFacilityContactFullName: '',
        secondRecoveryFacilityContactPhoneNumber: '',
        secondRecoveryFacilityFaxNumber: '',
        secondRecoveryFacilityEmailAddress: '',
        secondRecoveryFacilityRecoveryCode: '',
        thirdRecoveryFacilityOrganisationName: '',
        thirdRecoveryFacilityAddress: '',
        thirdRecoveryFacilityCountry: '',
        thirdRecoveryFacilityContactFullName: '',
        thirdRecoveryFacilityContactPhoneNumber: '',
        thirdRecoveryFacilityFaxNumber: '',
        thirdRecoveryFacilityEmailAddress: '',
        thirdRecoveryFacilityRecoveryCode: '',
        fourthRecoveryFacilityOrganisationName: '',
        fourthRecoveryFacilityAddress: '',
        fourthRecoveryFacilityCountry: '',
        fourthRecoveryFacilityContactFullName: '',
        fourthRecoveryFacilityContactPhoneNumber: '',
        fourthRecoveryFacilityFaxNumber: '',
        fourthRecoveryFacilityEmailAddress: '',
        fourthRecoveryFacilityRecoveryCode: '',
        fifthRecoveryFacilityOrganisationName: '',
        fifthRecoveryFacilityAddress: '',
        fifthRecoveryFacilityCountry: '',
        fifthRecoveryFacilityContactFullName: '',
        fifthRecoveryFacilityContactPhoneNumber: '',
        fifthRecoveryFacilityFaxNumber: '',
        fifthRecoveryFacilityEmailAddress: '',
        fifthRecoveryFacilityRecoveryCode: '',
      },
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual([
      {
        fields: ['WasteDescription', 'RecoveryFacilityDetail'],
        message:
          validation.RecoveryFacilityDetailCrossSectionValidationErrorMessages
            .invalidInterimSite,
      },
      {
        fields: ['WasteDescription', 'RecoveryFacilityDetail'],
        message:
          validation.RecoveryFacilityDetailCrossSectionValidationErrorMessages
            .invalidRecoveryFacility,
      },
    ]);
  });
});
