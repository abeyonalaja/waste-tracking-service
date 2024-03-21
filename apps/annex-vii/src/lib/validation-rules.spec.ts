import { WasteDescription, WasteQuantity, validation } from '../model';
import {
  validateCustomerReferenceSection,
  validateExporterDetailSection,
  validateImporterDetailSection,
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

const countries = [
  {
    name: 'Afghanistan [AF]',
  },
  {
    name: 'France [FR]',
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

describe('validateExporterDetailSection', () => {
  it('passes ExporterDetail section validation', async () => {
    let response = validateExporterDetailSection({
      exporterOrganisationName: 'Test organisation 1',
      exporterAddressLine1: '1 Some Street',
      exporterAddressLine2: '',
      exporterTownOrCity: 'London',
      exporterCountry: 'England',
      exporterPostcode: '',
      exporterContactFullname: 'John Smith',
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
      exporterTownOrCity: 'London',
      exporterCountry: 'England',
      exporterPostcode: 'EC2N4AY',
      exporterContactFullname: 'John Smith',
      exporterContactPhoneNumber: "'00447888888888'",
      exporterFaxNumber: "'+ (44)78888-88888'",
      exporterEmailAddress: 'test1@test.com',
    });
    expect(response.valid).toEqual(true);
    expect(response.value).toEqual({
      exporterAddress: {
        addressLine1: '1 Some Street',
        addressLine2: 'Address line',
        townCity: 'London',
        postcode: 'EC2N4AY',
        country: 'England',
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
      exporterContactFullname: '',
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
      exporterContactFullname: '     ',
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
      exporterOrganisationName: faker.datatype.string(251),
      exporterAddressLine1: faker.datatype.string(251),
      exporterAddressLine2: faker.datatype.string(251),
      exporterTownOrCity: faker.datatype.string(251),
      exporterCountry: faker.datatype.string(251),
      exporterPostcode: faker.datatype.string(251),
      exporterContactFullname: faker.datatype.string(251),
      exporterContactPhoneNumber: faker.datatype.string(30),
      exporterFaxNumber: faker.datatype.string(30),
      exporterEmailAddress: faker.datatype.string(30),
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
        message: validation.ExporterDetailValidationErrorMessages.invalidEmail,
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
        importerContactFullname: 'Jane Smith',
        importerContactPhoneNumber: '0033140000000',
        importerFaxNumber: '',
        importerEmailAddress: 'test2@test.com',
      },
      countries
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
      },
    });

    response = validateImporterDetailSection(
      {
        importerOrganisationName: 'Test organisation 2',
        importerAddress: '2 Some Street, Paris, 75002',
        importerCountry: 'France',
        importerContactFullname: 'Jane Smith',
        importerContactPhoneNumber: "'0033140000000'",
        importerFaxNumber: "'0033140000000'",
        importerEmailAddress: 'test2@test.com',
      },
      countries
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
        importerContactFullname: '',
        importerContactPhoneNumber: '',
        importerFaxNumber: '',
        importerEmailAddress: '',
      },
      countries
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
        importerContactFullname: '     ',
        importerContactPhoneNumber: '     ',
        importerFaxNumber: '     ',
        importerEmailAddress: '     ',
      },
      countries
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
        importerOrganisationName: faker.datatype.string(251),
        importerAddress: faker.datatype.string(251),
        importerCountry: faker.datatype.string(251),
        importerContactFullname: faker.datatype.string(251),
        importerContactPhoneNumber: faker.datatype.string(30),
        importerFaxNumber: faker.datatype.string(30),
        importerEmailAddress: faker.datatype.string(30),
      },
      countries
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
        message: validation.ImporterDetailValidationErrorMessages.invalidEmail,
      },
    ]);
  });
});
