import Ajv from 'ajv/dist/jtd';
import { PingRequest, PingResponse } from './dto';
import { pingRequest, pingResponse } from './schema';

const ajv = new Ajv();

describe('pingRequest', () => {
  const validate = ajv.compile<PingRequest>(pingRequest);

  it('is compatible with dto values', () => {
    const value: PingRequest = {
      message: 'hello',
    };

    expect(validate(value)).toBe(true);
  });
});

describe('pingResponse', () => {
  const validate = ajv.compile<PingResponse>(pingResponse);

  it('is compatible with dto values', () => {
    const value: PingResponse = {
      success: true,
      value: {
        message: 'hello',
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error values', () => {
    const value: PingResponse = {
      success: false,
      error: {
        message: '',
        name: '',
        statusCode: 0,
      },
    };

    expect(validate(value)).toBe(true);
  });
});
