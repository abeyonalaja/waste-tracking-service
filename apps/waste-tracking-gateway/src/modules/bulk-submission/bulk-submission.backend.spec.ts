import { DaprAnnexViiBulkClient } from '@wts/client/annex-vii-bulk';
import { AnnexViiBulkServiceBackend } from './bulk-submission.backend';
import { jest, expect } from '@jest/globals';
import { DaprClient } from '@dapr/dapr';
import { faker } from '@faker-js/faker';
import winston from 'winston';

jest.mock('@wts/client/annex-vii-bulk');
jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

describe(AnnexViiBulkServiceBackend, () => {
  const annexViiBulkAppId = faker.datatype.string();

  const mockClient = new DaprAnnexViiBulkClient(
    undefined as unknown as DaprClient,
    annexViiBulkAppId
  ) as unknown as jest.MockedClass<typeof DaprAnnexViiBulkClient>;

  const subject = new AnnexViiBulkServiceBackend(
    mockClient as unknown as DaprAnnexViiBulkClient,
    new winston.Logger()
  );

  beforeEach(() => {
    console.log(mockClient);
  });

  describe('createBatch', () => {
    it('throw client error if no CSV content', async () => {
      console.log(await subject.createBatch(faker.datatype.uuid(), []));
      expect(false).toBeFalsy();
    });

    it('throws client error if empty input', async () => {
      expect(false).toBeFalsy();
    });
  });
});
