import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { DaprLimitedAudienceClient } from '@wts/client/limited-audience';
import { LRUCache } from 'lru-cache';
import { LimitedAudienceUserFilter } from './user-filter';

const mockClient = {
  checkParticipation:
    jest.fn<DaprLimitedAudienceClient['checkParticipation']>(),
  redeemInvitation: jest.fn<DaprLimitedAudienceClient['redeemInvitation']>(),
  addParticipant: jest.fn<DaprLimitedAudienceClient['addParticipant']>(),
};

const mockCache = {
  get: jest.fn<(k: string) => boolean | undefined>(),
  set: jest.fn<(k: string, v: boolean) => LRUCache<string, boolean>>,
};

describe(LimitedAudienceUserFilter, () => {
  const subject = new LimitedAudienceUserFilter(
    mockClient as unknown as DaprLimitedAudienceClient,
    mockCache as unknown as LRUCache<string, boolean>
  );

  beforeEach(() => {
    mockClient.checkParticipation.mockClear();
    mockClient.redeemInvitation.mockClear();
    mockClient.addParticipant.mockClear();
    mockCache.get.mockClear();
  });

  it('agrees with backend service if true', async () => {
    mockClient.checkParticipation.mockResolvedValue({
      success: true,
      value: {
        participant: true,
        participantId: faker.datatype.uuid(),
      },
    });

    const cred = { uniqueReference: 'X', dcidSubjectId: faker.datatype.uuid() };
    expect(await subject.filter(cred)).toBe(true);
    expect(mockClient.checkParticipation).toHaveBeenCalledTimes(1);
    expect(mockClient.checkParticipation).toHaveBeenLastCalledWith({
      dcidSubjectId: cred.dcidSubjectId,
      content: 'GLW',
    });
  });

  it('agrees with backend service if false', async () => {
    mockClient.checkParticipation.mockResolvedValue({
      success: true,
      value: {
        participant: false,
      },
    });

    const cred = { uniqueReference: 'X', dcidSubjectId: faker.datatype.uuid() };
    expect(await subject.filter(cred)).toBe(false);
    expect(mockClient.checkParticipation).toHaveBeenCalledTimes(1);
    expect(mockClient.checkParticipation).toHaveBeenLastCalledWith({
      dcidSubjectId: cred.dcidSubjectId,
      content: 'GLW',
    });
  });

  it('does not invoke backend service if cached true', async () => {
    const dcidSubjectId = faker.datatype.uuid();
    mockCache.get.mockReturnValue(true);
    expect(await subject.filter({ uniqueReference: 'X', dcidSubjectId })).toBe(
      true
    );
    expect(mockClient.checkParticipation).not.toHaveBeenCalled();
  });
});
