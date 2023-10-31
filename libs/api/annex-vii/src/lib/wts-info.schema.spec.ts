import Ajv from 'ajv/dist/jtd';
import {
  GetCountriesResponse,
  GetDisposalCodesResponse,
  GetEWCCodesResponse,
  GetRecoveryCodesResponse,
  GetWasteCodesResponse,
  WasteCodeType,
} from './wts-info.dto';
import {
  getCountries,
  getDisposalCodes,
  getEWCCodes,
  getRecoveryCodes,
  getWasteCodes,
} from './wts-info.schema';

const ajv = new Ajv();

describe('WTS-Info tests', () => {
  describe('GetWasteCodesResponse', () => {
    const validate = ajv.compile<GetWasteCodesResponse>(getWasteCodes);

    it('getWasteCodes is compatible with success value', () => {
      const value: GetWasteCodesResponse = {
        success: true,
        value: [
          {
            type: 'BaselAnnexIX',
            values: [
              {
                code: 'B1010',
                description:
                  'Metal and metal-alloy wastes in metallic, non-dispersible form',
              },
            ],
          } as unknown as WasteCodeType,
        ],
      };

      expect(validate(value)).toBe(true);
    });

    it('is compatible with error value', () => {
      validate({
        success: false,
        error: {
          statusCode: 400,
          name: 'BadRequest',
          message: 'Bad request',
        },
      });
    });
  });

  describe('GetEWCCodesResponse', () => {
    const validate = ajv.compile<GetEWCCodesResponse>(getEWCCodes);

    it('getEWCCodes is compatible with success value', () => {
      const value: GetEWCCodesResponse = {
        success: true,
        value: [
          {
            code: 'A1010',
            description: 'English description',
          },
        ],
      };

      expect(validate(value)).toBe(true);
    });

    it('is compatible with error value', () => {
      validate({
        success: false,
        error: {
          statusCode: 400,
          name: 'BadRequest',
          message: 'Bad request',
        },
      });
    });
  });

  describe('GetCountriesResponse', () => {
    const validate = ajv.compile<GetCountriesResponse>(getCountries);

    it('getCountries is compatible with success value', () => {
      const value: GetCountriesResponse = {
        success: true,
        value: [
          {
            name: 'Germany(DE)',
          },
        ],
      };

      expect(validate(value)).toBe(true);
    });

    it('is compatible with error value', () => {
      validate({
        success: false,
        error: {
          statusCode: 400,
          name: 'BadRequest',
          message: 'Bad request',
        },
      });
    });
  });

  describe('GetRecoveryCodesResponse', () => {
    const validate = ajv.compile<GetRecoveryCodesResponse>(getRecoveryCodes);

    it('getRecoveryCodes is compatible with success value', () => {
      const value: GetRecoveryCodesResponse = {
        success: true,
        value: [
          {
            code: 'R12',
            description: 'English description',
            interim: true,
          },
        ],
      };

      expect(validate(value)).toBe(true);
    });

    it('is compatible with error value', () => {
      validate({
        success: false,
        error: {
          statusCode: 400,
          name: 'BadRequest',
          message: 'Bad request',
        },
      });
    });
  });

  describe('GetDisposalCodesResponse', () => {
    const validate = ajv.compile<GetDisposalCodesResponse>(getDisposalCodes);

    it('getDisposalCodes is compatible with success value', () => {
      const value: GetDisposalCodesResponse = {
        success: true,
        value: [
          {
            code: 'D1',
            description: 'English description',
          },
        ],
      };

      expect(validate(value)).toBe(true);
    });

    it('is compatible with error value', () => {
      validate({
        success: false,
        error: {
          statusCode: 400,
          name: 'BadRequest',
          message: 'Bad request',
        },
      });
    });
  });
});
