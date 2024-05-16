import { DaprUkWasteMovementsClient } from '@wts/client/uk-waste-movements';
import { expect, jest } from '@jest/globals';
import { ServiceUkWasteMovementsSubmissionBackend } from './uk-waste-movements-submission.backend';
import { Logger } from 'winston';
import { faker } from '@faker-js/faker';
import { GetDraftResponse } from '@wts/api/uk-waste-movements';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClient = {
  getDraft: jest.fn<DaprUkWasteMovementsClient['getDraft']>(),
};

describe(ServiceUkWasteMovementsSubmissionBackend, () => {
  const subject = new ServiceUkWasteMovementsSubmissionBackend(
    mockClient as unknown as DaprUkWasteMovementsClient,
    new Logger()
  );
  beforeEach(() => {
    mockClient.getDraft.mockClear();
  });

  it('returns submission', async () => {
    const id = faker.datatype.uuid();
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
        submissionDeclaration: {
          status: 'NotStarted',
        },
        submissionState: {
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
});
