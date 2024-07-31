import { DaprUkWasteMovementsClient } from '@wts/client/uk-waste-movements';
import { expect, jest } from '@jest/globals';
import { ServiceUkWasteMovementsSubmissionBackend } from './uk-waste-movements-submission.backend';
import { Logger } from 'winston';
import { faker } from '@faker-js/faker';
import {
  CreateDraftResponse,
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
  createDraft: jest.fn<DaprUkWasteMovementsClient['createDraft']>(),
};

describe(ServiceUkWasteMovementsSubmissionBackend, () => {
  const subject = new ServiceUkWasteMovementsSubmissionBackend(
    mockClient as unknown as DaprUkWasteMovementsClient,
    new Logger(),
  );
  beforeEach(() => {
    mockClient.getDraft.mockClear();
  });

  it('returns draft', async () => {
    const id = faker.string.uuid();
    const mockGetDraftResponse: GetDraftResponse = {
      success: true,
      value: {
        id: id,
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
    const accountId = faker.string.uuid();
    mockClient.getDraft.mockResolvedValueOnce(mockGetDraftResponse);
    const result = await subject.getDraft({
      id,
      accountId,
    });

    expect(result.id).toEqual(id);
    expect(mockClient.getDraft).toBeCalledWith({ id, accountId });
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

  it('creates draft', async () => {
    const mockGetDraftsResponse: CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        producerAndCollection: {
          status: 'Started',
          producer: {
            address: {
              status: 'NotStarted',
            },
            contact: {
              status: 'NotStarted',
            },
            reference: '123456',
            sicCode: '123456',
          },
          wasteCollection: {
            status: 'NotStarted',
          },
        },
        carrier: {
          status: 'NotStarted',
        },
        declaration: {
          status: 'NotStarted',
        },
        receiver: {
          status: 'NotStarted',
        },
        state: {
          status: 'InProgress',
          timestamp: faker.date.anytime(),
        },
        wasteInformation: {
          status: 'NotStarted',
        },
      },
    };
    mockClient.createDraft.mockResolvedValueOnce(mockGetDraftsResponse);
    const result = await subject.createDraft({
      accountId: faker.string.uuid(),
      reference: '123456',
    });

    expect(result).toEqual(mockGetDraftsResponse.value);
    expect(mockClient.createDraft).toBeCalled();
  });
});
