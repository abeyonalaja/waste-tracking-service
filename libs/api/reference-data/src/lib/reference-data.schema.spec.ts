import Ajv from 'ajv/dist/jtd';
import {
  GetCountriesRequest,
  GetCountriesResponse,
  GetDisposalCodesResponse,
  GetEWCCodesResponse,
  GetHazardousCodesResponse,
  GetLocalAuthoritiesResponse,
  GetPopsResponse,
  GetRecoveryCodesResponse,
  GetWasteCodesResponse,
} from './reference-data.dto';
import {
  getCountriesRequest,
  getCountriesResponse,
  getDisposalCodesResponse,
  getEWCCodesResponse,
  getHazardousCodesResponse,
  getLocalAuthoritiesResponse,
  getPopsResponse,
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

  describe('GetCountriesRequest', () => {
    const validate = ajv.compile<GetCountriesRequest>(getCountriesRequest);

    it('is compatible with dto values', () => {
      let value: GetCountriesRequest = {
        includeUk: true,
      };

      expect(validate(value)).toBe(true);

      value = {
        includeUk: false,
      };

      expect(validate(value)).toBe(true);

      value = {
        includeUk: undefined,
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

  describe('GetHazardousCodesResponse', () => {
    const validate = ajv.compile<GetHazardousCodesResponse>(
      getHazardousCodesResponse
    );

    it('getHazardousCodes is compatible with success value', () => {
      const value: GetHazardousCodesResponse = {
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

  describe('GetPopsResponse', () => {
    const validate = ajv.compile<GetPopsResponse>(getPopsResponse);

    it('getPops is compatible with success value', () => {
      const value: GetPopsResponse = {
        success: true,
        value: [
          {
            name: {
              en: 'Pentabromodiphenyl ether',
              cy: 'Ether Pentabromodiphenyl',
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

  describe('GetLocalAuthoritiesResponse', () => {
    const validate = ajv.compile<GetLocalAuthoritiesResponse>(
      getLocalAuthoritiesResponse
    );

    it('getLocalAuthorities is compatible with success value', () => {
      const value: GetLocalAuthoritiesResponse = {
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
