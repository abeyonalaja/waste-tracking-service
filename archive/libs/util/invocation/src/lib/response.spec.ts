import { teapot } from '@hapi/boom';
import { fromBoom, success } from './response';

describe('success', () => {
  it('just wraps provided value', () => {
    const result = success('sut');

    expect(result.success).toBe(true);
    if (!result.success) {
      return;
    }

    expect(result.value).toBe('sut');
  });
});

describe('fromBoom', () => {
  it('obtains status-code from Boom', () => {
    const result = fromBoom(teapot());

    expect(result.success).toBe(false);
    if (result.success) {
      return;
    }

    expect(result.error.statusCode).toBe(418);
  });
});
