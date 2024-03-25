import { faker } from '@faker-js/faker';
import { expect } from '@jest/globals';
import { createPublicKey } from 'crypto';
import { verify } from 'jsonwebtoken';
import { Participant, PrivateKey, createToken } from './tokens';

const privateKey = Buffer.from(
  `
-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBANRS9Nfj8z7FYnl+zlxCk1LKUHce6xAl98eJ4kcF+XsQueRZ0+Lc
MXKym7MEs5Ii5a7pKNTYcMCGlBm1HqHcPvsCAwEAAQJAL8OFrvdppgpTT8+V7q1P
ZQV8On/rE1PnPK0pCR8v813zpv+Hb+A8Dz/ftavXCT2uv/0fifVagvG10/zTDDnj
cQIhAPy5GUS/di93W0ETMigqVIbb+RKyNPmtV3FiHPqdsi2JAiEA1xPBW+gsyz3U
bcjuZto9rMcHOUdq78SkYekfeffRy2MCIGINIrukmSMTaOlXnEcvHTpxkDJrx9fz
JBEOovWtR1sZAiBZm9B+40/uaddc2k+BqMHzf4Th94B1Xz+Bz6geoALXswIhAPd9
vs+sxctdA0YlHdwaKK4h6XQC5mtkAV+h2V/1yhpM
-----END RSA PRIVATE KEY-----
  `
);

const publicKey = Buffer.from(
  createPublicKey(privateKey).export({ type: 'spki', format: 'pem' })
);

describe(createToken, () => {
  it('signs tokens with the provided key', () => {
    const token = createToken(
      { id: faker.datatype.uuid(), cohort: 'GLW' },
      { id: faker.datatype.uuid(), content: privateKey }
    );

    expect(() => verify(token, publicKey)).not.toThrow();
  });

  it('includes provided properties in payload', () => {
    const participant: Participant = {
      id: faker.datatype.uuid(),
      cohort: 'UKWM',
    };
    const key: PrivateKey = {
      id: faker.datatype.uuid(),
      content: privateKey,
    };

    const token = createToken(participant, key);

    const { header, payload } = verify(token, publicKey, { complete: true });
    expect(header.kid).toBe(key.id);
    expect(payload.sub).toBe(participant.id);
    expect(payload).toHaveProperty('cohort', participant.cohort);
  });
});
