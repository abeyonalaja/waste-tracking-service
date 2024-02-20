import Ajv from 'ajv/dist/jtd';
import {
  GetCountriesResponse,
  GetDisposalCodesResponse,
  GetEWCCodesResponse,
  GetRecoveryCodesResponse,
  GetWasteCodesResponse,
} from './reference-data.dto';
import {
  getCountriesResponse,
  getDisposalCodesResponse,
  getEWCCodesResponse,
  getRecoveryCodesResponse,
  getWasteCodesResponse,
} from './reference-data.schema';

const ajv = new Ajv();

describe('Reference-Data tests', () => {
  describe('GetWasteCodesResponse', () => {
    const validate = ajv.compile<GetWasteCodesResponse>(getWasteCodesResponse);

    it('getWasteCodes is compatible with success value', () => {
      const value: GetWasteCodesResponse = {
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
                    cy: 'The same but in Welsh',
                  },
                },
              },
            ],
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

  describe('GetEWCCodesResponse', () => {
    const validate = ajv.compile<GetEWCCodesResponse>(getEWCCodesResponse);

    it('getEWCCodes is compatible with success value', () => {
      const value: GetEWCCodesResponse = {
        success: true,
        value: [
          {
            code: 'A1010',
            value: {
              description: {
                en: 'Metal and metal-alloy wastes in metallic, non-dispersible form',
                cy: 'The same but in Welsh',
              },
            },
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
    const validate = ajv.compile<GetCountriesResponse>(getCountriesResponse);

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
    const validate = ajv.compile<GetRecoveryCodesResponse>(
      getRecoveryCodesResponse
    );

    it('getRecoveryCodes is compatible with success value', () => {
      const value: GetRecoveryCodesResponse = {
        success: true,
        value: [
          {
            code: 'R12',
            value: {
              description: {
                en: 'Metal and metal-alloy wastes in metallic, non-dispersible form',
                cy: 'The same but in Welsh',
              },
              interim: true,
            },
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
    const validate = ajv.compile<GetDisposalCodesResponse>(
      getDisposalCodesResponse
    );

    it('getDisposalCodes is compatible with success value', () => {
      const value: GetDisposalCodesResponse = {
        success: true,
        value: [
          {
            code: 'D1',
            value: {
              description: {
                en: 'Metal and metal-alloy wastes in metallic, non-dispersible form',
                cy: 'The same but in Welsh',
              },
            },
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
