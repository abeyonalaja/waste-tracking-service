import { sign } from 'jsonwebtoken';

export interface PrivateKey {
  id: string;
  content: Buffer;
}

export interface Participant {
  id: string;
  cohort: 'GLW' | 'UKWM';
}

export function createToken(
  participant: Participant,
  privateKey: PrivateKey
): string {
  return sign({ cohort: participant.cohort }, privateKey.content, {
    algorithm: 'RS256',
    subject: participant.id,
    noTimestamp: true,
    keyid: privateKey.id,
    allowInsecureKeySizes: true,
    header: {
      alg: 'RS256',
      typ: undefined,
    },
  });
}
