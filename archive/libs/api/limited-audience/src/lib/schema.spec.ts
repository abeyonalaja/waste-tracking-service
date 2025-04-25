import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import { checkParticipationRequest, redeemInvitationRequest } from './schema';
import { CheckParticipationRequest, RedeemInvitationRequest } from './dto';

const ajv = new Ajv();

describe('checkParticipationRequest', () => {
  const validate = ajv.compile(checkParticipationRequest);

  it('is comatible with dto values', () => {
    const value: CheckParticipationRequest = {
      dcidSubjectId: faker.string.uuid(),
      content: 'GLW',
    };

    expect(validate(value)).toBe(true);
  });

  it('rejects empty value', () => {
    expect(validate({})).toBe(false);
  });

  it('rejects unrelated value', () => {
    expect(validate({ x: 'y' })).toBe(false);
  });
});

describe('redeemInvitationRequest', () => {
  const validate = ajv.compile(redeemInvitationRequest);

  it('is comatible with dto values', () => {
    const value: RedeemInvitationRequest = {
      dcidSubjectId: faker.string.uuid(),
      invitationToken: 'YQ==',
    };

    expect(validate(value)).toBe(true);
  });

  it('rejects empty value', () => {
    expect(validate({})).toBe(false);
  });

  it('rejects unrelated value', () => {
    expect(validate({ x: 'y' })).toBe(false);
  });
});
