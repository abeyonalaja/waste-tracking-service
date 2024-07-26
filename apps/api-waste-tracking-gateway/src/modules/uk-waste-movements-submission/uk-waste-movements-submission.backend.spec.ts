import { DaprUkWasteMovementsClient } from '@wts/client/uk-waste-movements';
import { expect, jest } from '@jest/globals';
import { ServiceUkWasteMovementsSubmissionBackend } from './uk-waste-movements-submission.backend';
import { Logger } from 'winston';
import { faker } from '@faker-js/faker';
import {
  GetDraftResponse,
  GetDraftsResponse,
} from '@wts/api/uk-waste-movements';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClient = {
  getDraft: jest.fn<DaprUkWasteMovementsClient['getDraft']>(),
  getDrafts: jest.fn<DaprUkWasteMovementsClient['getDrafts']>(),
};

describe(ServiceUkWasteMovementsSubmissionBackend, () => {
  const subject = new ServiceUkWasteMovementsSubmissionBackend(
    mockClient as unknown as DaprUkWasteMovementsClient,
    new Logger(),
  );
  beforeEach(() => {
    mockClient.getDraft.mockClear();
  });

  it('returns submission', async () => {
    const id = faker.string.uuid();
    const mockGetDraftResponse: GetDraftResponse = {
      success: true,
      value: {
        id: id,
        transactionId: '',
        wasteInformation: {
          status: 'NotStarted',
        },
        receiver: {
          status: 'NotStarted',
        },
        producerAndCollection: {
          status: 'NotStarted',
        },
        carrier: {
          status: 'NotStarted',
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      },
    };
    mockClient.getDraft.mockResolvedValueOnce(mockGetDraftResponse);
    const result = await subject.getUkwmSubmission({
      id,
    });

    expect(result.id).toEqual(id);
    expect(mockClient.getDraft).toBeCalledWith({ id });
  });

  it('returns drafts', async () => {
    const id = faker.string.uuid();
    const mockGetDraftsResponse: GetDraftsResponse = {
      success: true,
      value: {
        totalRecords: 1,
        totalPages: 1,
        page: 1,
        values: [
          {
            id: id,
            wasteMovementId: '',
            producerName: '',
            ewcCode: '',
            collectionDate: {
              day: '',
              month: '',
              year: '',
            },
          },
        ],
      },
    };
    mockClient.getDrafts.mockResolvedValueOnce(mockGetDraftsResponse);
    const result = await subject.getDrafts({
      page: 1,
    });

    expect(result.values[0].id).toEqual(id);
    expect(mockClient.getDrafts).toBeCalled();
  });
});
