import { DaprClient } from '@dapr/dapr';
import { StateQueryResponseType } from '@dapr/dapr/types/state/StateQueryResponse.type';
import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import { Logger } from 'winston';
import DaprDraftRepository from './dapr-drafts';

const mockGetBulk = jest.fn<typeof DaprClient.prototype.state.getBulk>();
const mockSave = jest.fn<typeof DaprClient.prototype.state.save>();
const mockQuery = jest.fn<typeof DaprClient.prototype.state.query>();

jest.mock('@dapr/dapr', () => ({
  DaprClient: jest.fn().mockImplementation(() => ({
    state: {
      getBulk: mockGetBulk,
      save: mockSave,
      query: mockQuery,
    },
  })),
}));

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

beforeEach(() => {
  mockGetBulk.mockClear();
  mockSave.mockClear();
  mockQuery.mockClear();
});

const stateStoreName = faker.datatype.string();
const subject = new DaprDraftRepository(
  new DaprClient(),
  new Logger(),
  stateStoreName
);

describe('getDrafts', () => {
  it('handles empty response', async () => {
    mockQuery.mockResolvedValueOnce({
      results: undefined,
    } as unknown as StateQueryResponseType);

    expect(await subject.getDrafts(faker.datatype.uuid())).toEqual([]);
  });
});

describe('getDraft', () => {
  it('retrieves a value with the associated id', async () => {
    const id = faker.datatype.uuid();
    const accountId = faker.datatype.uuid();
    const timestamp = new Date();
    const mockResponse = [
      {
        key: id,
        data: {
          id,
          accountId,
          reference: null,
          carriers: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          collectionDetail: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'CannotStart' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'InProgress',
            timestamp: timestamp,
          },
          transitCountries: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'CannotStart' },
        },
      },
    ];

    mockGetBulk.mockResolvedValueOnce(mockResponse);
    const result = await subject.getDraft(id, accountId);

    expect(result).toEqual({
      id,
      reference: null,
      carriers: { status: 'NotStarted' },
      collectionDate: { status: 'NotStarted' },
      collectionDetail: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
      submissionConfirmation: { status: 'CannotStart' },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: timestamp,
      },
      transitCountries: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      wasteDescription: { status: 'NotStarted' },
      wasteQuantity: { status: 'CannotStart' },
    });

    expect(mockGetBulk).toBeCalledTimes(1);
    expect(mockGetBulk).toBeCalledWith(stateStoreName, [id], {
      metadata: { partitionKey: accountId },
    });
  });

  it("throws Not Found exception if key doesn't exist", async () => {
    const id = faker.datatype.uuid();
    mockGetBulk.mockResolvedValue([{ key: id }]);
    expect(subject.getDraft(id, faker.datatype.uuid())).rejects.toThrow(
      Boom.notFound()
    );
    expect(mockGetBulk).toBeCalledTimes(1);
  });

  it('throws Not Found exception if submission state is Deleted', async () => {
    const id = faker.datatype.uuid();
    const accountId = faker.datatype.uuid();
    const timestamp = new Date();
    const mockResponse = [
      {
        key: id,
        data: {
          id,
          accountId,
          reference: null,
          carriers: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          collectionDetail: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'CannotStart' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'Deleted',
            timestamp: timestamp,
          },
          transitCountries: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'CannotStart' },
        },
      },
    ];
    mockGetBulk.mockResolvedValueOnce(mockResponse);
    expect(subject.getDraft(id, accountId)).rejects.toThrow(Boom.notFound());
    expect(mockGetBulk).toBeCalledTimes(1);
  });

  it('throws Not Found exception if submission state is Cancelled', async () => {
    const id = faker.datatype.uuid();
    const accountId = faker.datatype.uuid();
    const timestamp = new Date();
    const mockResponse = [
      {
        key: id,
        data: {
          id,
          accountId,
          reference: null,
          carriers: { status: 'NotStarted' },
          collectionDate: { status: 'NotStarted' },
          collectionDetail: { status: 'NotStarted' },
          exporterDetail: { status: 'NotStarted' },
          importerDetail: { status: 'NotStarted' },
          recoveryFacilityDetail: { status: 'CannotStart' },
          submissionConfirmation: { status: 'CannotStart' },
          submissionDeclaration: { status: 'CannotStart' },
          submissionState: {
            status: 'Cancelled',
            timestamp: timestamp,
            cancellationType: {
              type: 'NoLongerExportingWaste',
            },
          },
          transitCountries: { status: 'NotStarted' },
          ukExitLocation: { status: 'NotStarted' },
          wasteDescription: { status: 'NotStarted' },
          wasteQuantity: { status: 'CannotStart' },
        },
      },
    ];
    mockGetBulk.mockResolvedValueOnce(mockResponse);
    expect(subject.getDraft(id, accountId)).rejects.toThrow(Boom.notFound());
    expect(mockGetBulk).toBeCalledTimes(1);
  });
});
