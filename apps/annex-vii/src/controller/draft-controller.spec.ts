import { expect, jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import winston from 'winston';
import { DraftSubmission, DraftSubmissionSummary } from '../model';
import DraftController from './draft-controller';
import Boom from '@hapi/boom';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockRepository = {
  getDrafts:
    jest.fn<(accountId: string) => Promise<DraftSubmissionSummary[]>>(),
  getDraft:
    jest.fn<(id: string, accountId: string) => Promise<DraftSubmission>>(),
  saveDraft:
    jest.fn<(value: DraftSubmission, accountId: string) => Promise<void>>(),
};

describe(DraftController, () => {
  const subject = new DraftController(mockRepository, new winston.Logger());

  beforeEach(() => {
    mockRepository.getDrafts.mockClear();
    mockRepository.getDraft.mockClear();
    mockRepository.saveDraft.mockClear();
  });

  describe('getDrafts', () => {
    it('forwards thrown Boom errors', async () => {
      const accountId = faker.datatype.uuid();
      mockRepository.getDrafts.mockRejectedValue(Boom.teapot());

      const response = await subject.getDrafts({ accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getDrafts).toBeCalledWith(accountId);
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns values from repository', async () => {
      const accountId = faker.datatype.uuid();
      mockRepository.getDrafts.mockResolvedValue([]);

      const response = await subject.getDrafts({ accountId });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getDrafts).toHaveBeenCalledWith(accountId);
      expect(response.value).toEqual([]);
    });
  });

  describe('getDraftById', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      mockRepository.getDraft.mockRejectedValue(Boom.teapot());

      const response = await subject.getDraftById({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getDraft).toBeCalledWith(id, accountId);
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the repository', async () => {
      const id = faker.datatype.uuid();
      const accountId = faker.datatype.uuid();
      const value: DraftSubmission = {
        id,
        reference: null,
        wasteDescription: { status: 'NotStarted' },
        wasteQuantity: { status: 'CannotStart' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: { status: 'NotStarted' },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      mockRepository.getDraft.mockResolvedValue(value);

      const response = await subject.getDraftById({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getDraft).toHaveBeenCalledWith(id, accountId);
      expect(response.value).toEqual(value);
    });
  });

  describe('createDraft', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.saveDraft.mockRejectedValue(Boom.teapot());
      const response = await subject.createDraft({
        accountId: faker.datatype.uuid(),
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.saveDraft).toBeCalled();
      expect(response.error.statusCode).toBe(418);
    });
  });
});
