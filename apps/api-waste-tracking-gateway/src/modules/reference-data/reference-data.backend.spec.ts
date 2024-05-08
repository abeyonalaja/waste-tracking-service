import { ReferenceDataServiceBackend } from './reference-data.backend';
import { DaprReferenceDataClient } from '@wts/client/reference-data';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import {
  GetCountriesResponse,
  GetDisposalCodesResponse,
  GetEWCCodesResponse,
  GetHazardousCodesResponse,
  GetLocalAuthoritiesResponse,
  GetPopsResponse,
  GetRecoveryCodesResponse,
  GetWasteCodesResponse,
} from '@wts/api/reference-data';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClientReferenceData = {
  getWasteCodes: jest.fn<DaprReferenceDataClient['getWasteCodes']>(),
  getEWCCodes: jest.fn<DaprReferenceDataClient['getEWCCodes']>(),
  getCountries: jest.fn<DaprReferenceDataClient['getCountries']>(),
  getRecoveryCodes: jest.fn<DaprReferenceDataClient['getRecoveryCodes']>(),
  getDisposalCodes: jest.fn<DaprReferenceDataClient['getDisposalCodes']>(),
  getHazardousCodes: jest.fn<DaprReferenceDataClient['getHazardousCodes']>(),
  getPops: jest.fn<DaprReferenceDataClient['getPops']>(),
  getLocalAuthorities:
    jest.fn<DaprReferenceDataClient['getLocalAuthorities']>(),
};

describe('ReferenceDataServiceBackend', () => {
  const subject = new ReferenceDataServiceBackend(
    mockClientReferenceData as unknown as DaprReferenceDataClient,
    new Logger()
  );

  beforeEach(() => {
    mockClientReferenceData.getWasteCodes.mockClear();
    mockClientReferenceData.getEWCCodes.mockClear();
    mockClientReferenceData.getCountries.mockClear();
    mockClientReferenceData.getRecoveryCodes.mockClear();
    mockClientReferenceData.getDisposalCodes.mockClear();
    mockClientReferenceData.getHazardousCodes.mockClear();
    mockClientReferenceData.getPops.mockClear();
  });

  it('should return waste codes when response is successful', async () => {
    const mockResponse: GetWasteCodesResponse = {
      success: true,
      value: [
        {
          type: 'BaselAnnexIX',
          values: [
            {
              code: 'B1010',
              value: {
                description: {
                  en: 'Metal and metal-alloy wastes in metallic, non-dispersible form',
                  cy: "Gwastraff metel a metel-aloi ar ffurf fetelaidd, nad yw'n wasgaredig",
                },
              },
            },
          ],
        },
      ],
    };

    mockClientReferenceData.getWasteCodes.mockResolvedValue(mockResponse);

    const result = await subject.listWasteCodes();

    expect(result).toEqual(mockResponse.value);
    expect(mockClientReferenceData.getWasteCodes).toHaveBeenCalled();
  });

  it('should throw an error when listWasteCodes response is not successful', async () => {
    const mockResponse: GetWasteCodesResponse = {
      success: false,
      error: {
        message: 'Error message',
        statusCode: 500,
        name: '',
      },
    };

    mockClientReferenceData.getWasteCodes.mockResolvedValue(mockResponse);

    await expect(subject.listWasteCodes()).rejects.toThrow();
    expect(mockClientReferenceData.getWasteCodes).toHaveBeenCalled();
  });

  it('should return EWC codes when response is successful', async () => {
    const mockResponse: GetEWCCodesResponse = {
      success: true,
      value: [
        {
          code: '010101',
          value: {
            description: {
              en: 'wastes from mineral metalliferous excavation',
              cy: 'gwastraff o gloddio metelaidd mwynol',
            },
          },
        },
      ],
    };

    mockClientReferenceData.getEWCCodes.mockResolvedValue(mockResponse);

    const result = await subject.listEWCCodes();

    expect(result).toEqual(mockResponse.value);
    expect(mockClientReferenceData.getEWCCodes).toHaveBeenCalled();
  });

  it('should throw an error when listEWCCodes response is not successful', async () => {
    const mockResponse: GetEWCCodesResponse = {
      success: false,
      error: {
        message: 'Error message',
        statusCode: 500,
        name: '',
      },
    };

    mockClientReferenceData.getEWCCodes.mockResolvedValue(mockResponse);

    await expect(subject.listEWCCodes()).rejects.toThrow();
    expect(mockClientReferenceData.getEWCCodes).toHaveBeenCalled();
  });

  it('should return countries when response is successful', async () => {
    const mockResponse: GetCountriesResponse = {
      success: true,
      value: [
        {
          name: 'Afghanistan [AF]',
        },
      ],
    };

    mockClientReferenceData.getCountries.mockResolvedValue(mockResponse);

    const result = await subject.listCountries();

    expect(result).toEqual(mockResponse.value);
    expect(mockClientReferenceData.getCountries).toHaveBeenCalled();
  });

  it('should throw an error when listCountries response is not successful', async () => {
    const mockResponse: GetCountriesResponse = {
      success: false,
      error: {
        message: 'Error message',
        statusCode: 500,
        name: '',
      },
    };

    mockClientReferenceData.getCountries.mockResolvedValue(mockResponse);

    await expect(subject.listCountries()).rejects.toThrow();
    expect(mockClientReferenceData.getCountries).toHaveBeenCalled();
  });

  it('should return recovery codes when response is successful', async () => {
    const mockResponse: GetRecoveryCodesResponse = {
      success: true,
      value: [
        {
          code: 'R1',
          value: {
            description: {
              en: 'Use principally as a fuel or other means to generate energy',
              cy: 'Defnyddiwch yn bennaf fel tanwydd neu ddulliau eraill i gynhyrchu ynni',
            },
            interim: false,
          },
        },
      ],
    };

    mockClientReferenceData.getRecoveryCodes.mockResolvedValue(mockResponse);

    const result = await subject.listRecoveryCodes();

    expect(result).toEqual(mockResponse.value);
    expect(mockClientReferenceData.getRecoveryCodes).toHaveBeenCalled();
  });

  it('should throw an error when listRecoveryCodes response is not successful', async () => {
    const mockResponse: GetRecoveryCodesResponse = {
      success: false,
      error: {
        message: 'Error message',
        statusCode: 500,
        name: '',
      },
    };

    mockClientReferenceData.getRecoveryCodes.mockResolvedValue(mockResponse);

    await expect(subject.listRecoveryCodes()).rejects.toThrow();
    expect(mockClientReferenceData.getRecoveryCodes).toHaveBeenCalled();
  });

  it('should return disposal codes when response is successful', async () => {
    const mockResponse: GetDisposalCodesResponse = {
      success: true,
      value: [
        {
          code: 'D1',
          value: {
            description: {
              en: 'Deposit into or onto land',
              cy: 'Adneuo i mewn neu ymlaen i dir',
            },
          },
        },
      ],
    };

    mockClientReferenceData.getDisposalCodes.mockResolvedValue(mockResponse);

    const result = await subject.listDisposalCodes();

    expect(result).toEqual(mockResponse.value);
    expect(mockClientReferenceData.getDisposalCodes).toHaveBeenCalled();
  });

  it('should throw an error when listDisposalCodes response is not successful', async () => {
    const mockResponse: GetDisposalCodesResponse = {
      success: false,
      error: {
        message: 'Error message',
        statusCode: 500,
        name: '',
      },
    };

    mockClientReferenceData.getDisposalCodes.mockResolvedValue(mockResponse);

    await expect(subject.listDisposalCodes()).rejects.toThrow();
    expect(mockClientReferenceData.getDisposalCodes).toHaveBeenCalled();
  });

  it('should return hazardous codes when response is successful', async () => {
    const mockResponse: GetHazardousCodesResponse = {
      success: true,
      value: [
        {
          code: 'HP1',
          value: {
            description: {
              en: 'Explosive',
              cy: 'Ffrwydron',
            },
          },
        },
      ],
    };

    mockClientReferenceData.getHazardousCodes.mockResolvedValue(mockResponse);

    const result = await subject.listHazardousCodes();

    expect(result).toEqual(mockResponse.value);
    expect(mockClientReferenceData.getHazardousCodes).toHaveBeenCalled();
  });

  it('should throw an error when listHazardousCodes response is not successful', async () => {
    const mockResponse: GetHazardousCodesResponse = {
      success: false,
      error: {
        message: 'Error message',
        statusCode: 500,
        name: '',
      },
    };

    mockClientReferenceData.getHazardousCodes.mockResolvedValue(mockResponse);

    await expect(subject.listHazardousCodes()).rejects.toThrow();
    expect(mockClientReferenceData.getHazardousCodes).toHaveBeenCalled();
  });

  it('should return pops when response is successful', async () => {
    const mockResponse: GetPopsResponse = {
      success: true,
      value: [
        {
          name: {
            en: 'Endosulfan',
            cy: 'Endosulfan',
          },
        },
      ],
    };

    mockClientReferenceData.getPops.mockResolvedValue(mockResponse);

    const result = await subject.listPops();

    expect(result).toEqual(mockResponse.value);
    expect(mockClientReferenceData.getPops).toHaveBeenCalled();
  });

  it('should throw an error when listPops response is not successful', async () => {
    const mockResponse: GetPopsResponse = {
      success: false,
      error: {
        message: 'Error message',
        statusCode: 500,
        name: '',
      },
    };

    mockClientReferenceData.getPops.mockResolvedValue(mockResponse);

    await expect(subject.listPops()).rejects.toThrow();
    expect(mockClientReferenceData.getPops).toHaveBeenCalled();
  });

  it('should return local authorities when response is successful', async () => {
    const mockResponse: GetLocalAuthoritiesResponse = {
      success: true,
      value: [
        {
          name: {
            en: 'Hartlepool',
            cy: 'Hartlepool',
          },
          country: {
            en: 'England',
            cy: 'Lloegr',
          },
        },
      ],
    };

    mockClientReferenceData.getLocalAuthorities.mockResolvedValue(mockResponse);

    const result = await subject.listLocalAuthorities();

    expect(result).toEqual(mockResponse.value);
    expect(mockClientReferenceData.getLocalAuthorities).toHaveBeenCalled();
  });

  it('should throw an error when listLocalAuthorities response is not successful', async () => {
    const mockResponse: GetLocalAuthoritiesResponse = {
      success: false,
      error: {
        message: 'Error message',
        statusCode: 500,
        name: '',
      },
    };

    mockClientReferenceData.getLocalAuthorities.mockResolvedValue(mockResponse);

    await expect(subject.listLocalAuthorities()).rejects.toThrow();
    expect(mockClientReferenceData.getLocalAuthorities).toHaveBeenCalled();
  });
});
