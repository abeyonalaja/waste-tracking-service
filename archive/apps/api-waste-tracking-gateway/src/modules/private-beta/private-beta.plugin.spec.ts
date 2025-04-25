import { faker } from '@faker-js/faker';
import { jest } from '@jest/globals';
import { DaprLimitedAudienceClient } from '@wts/client/limited-audience';
import { LRUCache } from 'lru-cache';
import { Logger } from 'winston';
import { PrivateAudienceServiceBackend } from './private-beta.plugin';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

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

describe(PrivateAudienceServiceBackend, () => {
  const subject = new PrivateAudienceServiceBackend(
    mockClient as unknown as DaprLimitedAudienceClient,
    mockCache as unknown as LRUCache<string, boolean>,
    new Logger(),
  );

  beforeEach(() => {
    mockClient.checkParticipation.mockClear();
    mockClient.redeemInvitation.mockClear();
    mockClient.addParticipant.mockClear();
    mockCache.get.mockClear();
  });

  describe('userFilter', () => {
    it('agrees with backend service if true', async () => {
      mockClient.checkParticipation.mockResolvedValue({
        success: true,
        value: {
          participant: true,
          participantId: faker.string.uuid(),
        },
      });

      const cred = {
        uniqueReference: 'X',
        dcidSubjectId: faker.string.uuid(),
      };
      expect(await subject.userFilter(cred)).toBe(true);
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

      const cred = {
        uniqueReference: 'X',
        dcidSubjectId: faker.string.uuid(),
      };
      expect(await subject.userFilter(cred)).toBe(false);
      expect(mockClient.checkParticipation).toHaveBeenCalledTimes(1);
      expect(mockClient.checkParticipation).toHaveBeenLastCalledWith({
        dcidSubjectId: cred.dcidSubjectId,
        content: 'GLW',
      });
    });

    it('does not invoke backend service if cached true', async () => {
      const dcidSubjectId = faker.string.uuid();
      mockCache.get.mockReturnValue(true);
      expect(
        await subject.userFilter({ uniqueReference: 'X', dcidSubjectId }),
      ).toBe(true);
      expect(mockClient.checkParticipation).not.toHaveBeenCalled();
    });
  });
});
