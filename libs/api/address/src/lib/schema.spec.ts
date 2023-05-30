import Ajv from 'ajv/dist/jtd';
import { GetAddressByPostcodeResponse } from './address';
import { getAddressByPostcodeResponse } from './schema';

const ajv = new Ajv();

describe('getAddressByPostcodeResponse', () => {
  const validate = ajv.compile<GetAddressByPostcodeResponse>(
    getAddressByPostcodeResponse
  );

  it('is compatible with success value', () => {
    const value: GetAddressByPostcodeResponse = {
      success: true,
      value: [
        {
          addressLine1:
            'ARMIRA CAPITAL LTD, 110, BISHOPSGATE, LONDON, EC2N 4AY',
          townCity: 'LONDON',
          postcode: 'EC2N 4AY',
          country: 'ENGLAND',
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
