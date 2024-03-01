import { WasteDescription, WasteQuantity, validation } from '../model';
import {
  validateCustomerReferenceSection,
  validateWasteDescriptionAndQuantityCrossSection,
  validateWasteDescriptionSection,
  validateWasteQuantitySection,
} from './validation-rules';
import { faker } from '@faker-js/faker';

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
      reference: faker.datatype.string(120),
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
      ewcCodes
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
      ewcCodes
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
        annexIIIACode: 'B1010;B1050',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes
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
      ewcCodes
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
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes
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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.BaselAnnexIXCodeValidationErrorMessages.invalid,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.OECDCodeValidationErrorMessages.invalid,
    });

    response = validateWasteDescriptionSection(
      {
        baselAnnexIXCode: '',
        oecdCode: '',
        annexIIIACode: 'B9999;B9999',
        annexIIIBCode: '',
        laboratory: '',
        ewcCodes: '010101;010102',
        nationalCode: '',
        wasteDescription: 'test',
      },
      wasteCodes,
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.AnnexIIIACodeValidationErrorMessages.invalid,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.AnnexIIIBCodeValidationErrorMessages.invalid,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.LaboratoryValidationErrorMessages.invalid,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.empty,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.tooMany,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.laboratory,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.laboratory,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.laboratory,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteCodeValidationErrorMessages.laboratory,
    });
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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.EWCCodeErrorMessages.empty,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.EWCCodeErrorMessages.tooMany,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.EWCCodeErrorMessages.invalid,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.NationalCodeValidationErrorMessages.invalid,
    });
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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.NationalCodeValidationErrorMessages.invalid,
    });
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
        wasteDescription: faker.datatype.string(120),
      },
      wasteCodes,
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteDescriptionValidationErrorMessages.charTooMany,
    });

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
      ewcCodes
    );
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteDescription',
      message: validation.WasteDescriptionValidationErrorMessages.charTooFew,
    });
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
  });

  it('fails WasteQuantity section validation', async () => {
    let response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.empty,
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '1',
      wasteQuantityCubicMetres: '2',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.tooMany,
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '1',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '2',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.tooMany,
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '1',
      wasteQuantityKilograms: '2',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.tooMany,
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '2',
      estimatedOrActualWasteQuantity: '',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.missingType,
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '2',
      estimatedOrActualWasteQuantity: 'Actuals',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.missingType,
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: 'test',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.invalid,
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '0',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.BulkWasteQuantityValidationErrorMessages.invalid,
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: 'test',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.invalid,
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '0',
      wasteQuantityKilograms: '',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.BulkWasteQuantityValidationErrorMessages.invalid,
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '2.123',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.WasteQuantityValidationErrorMessages.invalid,
    });

    response = validateWasteQuantitySection({
      wasteQuantityTonnes: '',
      wasteQuantityCubicMetres: '',
      wasteQuantityKilograms: '26',
      estimatedOrActualWasteQuantity: 'Actual',
    });
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      field: 'WasteQuantity',
      message: validation.SmallWasteQuantityValidationErrorMessages.invalid,
    });
  });
});

describe('validateWasteDescriptionAndQuantityCrossSection', () => {
  it('passes WasteDescriptionAndQuantity cross section validation', async () => {
    const wasteDescription: WasteDescription = {
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
    let response = validateWasteDescriptionAndQuantityCrossSection(
      wasteDescription,
      wasteQuantity
    );
    expect(response.valid).toEqual(true);

    wasteDescription.wasteCode.type = 'OECD';
    response = validateWasteDescriptionAndQuantityCrossSection(
      wasteDescription,
      wasteQuantity
    );
    expect(response.valid).toEqual(true);

    wasteDescription.wasteCode.type = 'AnnexIIIA';
    response = validateWasteDescriptionAndQuantityCrossSection(
      wasteDescription,
      wasteQuantity
    );
    expect(response.valid).toEqual(true);

    wasteDescription.wasteCode.type = 'AnnexIIIB';
    response = validateWasteDescriptionAndQuantityCrossSection(
      wasteDescription,
      wasteQuantity
    );
    expect(response.valid).toEqual(true);

    wasteDescription.wasteCode.type = 'NotApplicable';
    wasteQuantity.actualData.unit = 'Kilogram';
    response = validateWasteDescriptionAndQuantityCrossSection(
      wasteDescription,
      wasteQuantity
    );
    expect(response.valid).toEqual(true);
  });

  it('fails WasteDescriptionAndQuantity cross section validation', async () => {
    const wasteDescription: WasteDescription = {
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
    let response = validateWasteDescriptionAndQuantityCrossSection(
      wasteDescription,
      wasteQuantity
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      fields: ['WasteDescription', 'WasteQuantity'],
      message: validation.WasteQuantityValidationErrorMessages.laboratory,
    });

    wasteDescription.wasteCode.type = 'OECD';
    response = validateWasteDescriptionAndQuantityCrossSection(
      wasteDescription,
      wasteQuantity
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      fields: ['WasteDescription', 'WasteQuantity'],
      message: validation.WasteQuantityValidationErrorMessages.laboratory,
    });

    wasteDescription.wasteCode.type = 'OECD';
    response = validateWasteDescriptionAndQuantityCrossSection(
      wasteDescription,
      wasteQuantity
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      fields: ['WasteDescription', 'WasteQuantity'],
      message: validation.WasteQuantityValidationErrorMessages.laboratory,
    });

    wasteDescription.wasteCode.type = 'AnnexIIIA';
    response = validateWasteDescriptionAndQuantityCrossSection(
      wasteDescription,
      wasteQuantity
    );
    if (response.valid) {
      return;
    }
    expect(response.valid).toEqual(false);
    expect(response.value).toEqual({
      fields: ['WasteDescription', 'WasteQuantity'],
      message: validation.WasteQuantityValidationErrorMessages.laboratory,
    });

    wasteDescription.wasteCode.type = 'AnnexIIIB';
    response = validateWasteDescriptionAndQuantityCrossSection(
      wasteDescription,
      wasteQuantity
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
});
