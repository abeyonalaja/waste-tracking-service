import { expect } from '@jest/globals';
import { JwtTokenValidator } from './tokens';

const publicKey = `
-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANRS9Nfj8z7FYnl+zlxCk1LKUHce6xAl
98eJ4kcF+XsQueRZ0+LcMXKym7MEs5Ii5a7pKNTYcMCGlBm1HqHcPvsCAwEAAQ==
-----END PUBLIC KEY-----
`;

const token =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjY5ZmVkNzg0LTNmNTgtNDUzMS1hNjdmL\
WJhZjJlZjk1Y2JhNyJ9.eyJjb2hvcnQiOiJVS1dNIiwic3ViIjoiM2YwZjU0NjEt\
MjM0ZC00OWE4LWIxN2YtNGRlNTdiMzgwZDkxIn0.nmg-YrL5F9ryOt0BHrjJPEWf\
5DEZh5TTcccrg-I1_qkBZLsrMzXFTFneChbc1OSdpq5u5Kp7hSUUXIGbJBMXTA';

const tokenWithInvalidSignature =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQzZWI2ZjNlLTA5MmUtNDY0MC1iNGYzL\
WVlMDczN2E3MmY3YSJ9.eyJjb2hvcnQiOiJHTFciLCJzdWIiOiI2YjZmNzdjZS1j\
ODExLTQzMGYtYTE3OS01YmI3ZGNiOGJlNjcifQ.iX7An2DpFhtZSRvmk1j5OsJ0N\
PyKSYEwCH-AsstR1PzKdVggD8lfG3lsuMhQPDy8G67V0mxp7JYlDfkbOToa_Q';

describe(JwtTokenValidator, () => {
  const subject = new JwtTokenValidator(publicKey);

  it('should extract payload from valid token', async () => {
    const result = await subject.validate(token);
    expect(result.valid).toBe(true);
    if (!result.valid) {
      return;
    }

    expect(result.payload.content).toBe('UKWM');
    expect(result.payload.participantId).toBe(
      '3f0f5461-234d-49a8-b17f-4de57b380d91'
    );
  });

  it('handles token signed with invalid signature', async () => {
    const result = await subject.validate(tokenWithInvalidSignature);
    expect(result.valid).toBe(false);
    if (result.valid) {
      return;
    }

    expect(result.error).toBe('invalid signature');
  });
});
