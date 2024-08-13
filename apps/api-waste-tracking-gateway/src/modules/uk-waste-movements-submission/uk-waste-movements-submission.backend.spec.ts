import { DaprUkWasteMovementsClient } from '@wts/client/uk-waste-movements';
import { expect, jest } from '@jest/globals';
import { ServiceUkWasteMovementsSubmissionBackend } from './uk-waste-movements-submission.backend';
import { Logger } from 'winston';
import { faker } from '@faker-js/faker';
import {
  CreateDraftResponse,
  GetDraftProducerContactDetailResponse,
  GetDraftResponse,
  GetDraftsResponse,
  GetDraftProducerAddressDetailsResponse,
  SetDraftProducerContactDetailResponse,
  SetDraftWasteSourceResponse,
  GetDraftWasteSourceResponse,
  GetDraftWasteCollectionAddressDetailsResponse,
} from '@wts/api/uk-waste-movements';
import { UkwmContact } from '@wts/api/waste-tracking-gateway';

import { Response } from '@wts/util/invocation';
import { UkwmAddress } from '@wts/api/waste-tracking-gateway';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClient = {
  getDraft: jest.fn<DaprUkWasteMovementsClient['getDraft']>(),
  getDrafts: jest.fn<DaprUkWasteMovementsClient['getDrafts']>(),
  createDraft: jest.fn<DaprUkWasteMovementsClient['createDraft']>(),
  setDraftProducerAddressDetails:
    jest.fn<DaprUkWasteMovementsClient['setDraftProducerAddressDetails']>(),
  getDraftProducerAddressDetails:
    jest.fn<DaprUkWasteMovementsClient['getDraftProducerAddressDetails']>(),
  setDraftProducerContactDetail:
    jest.fn<DaprUkWasteMovementsClient['setDraftProducerContactDetail']>(),
  getDraftProducerContactDetail:
    jest.fn<DaprUkWasteMovementsClient['getDraftProducerContactDetail']>(),
  setDraftWasteSource:
    jest.fn<DaprUkWasteMovementsClient['setDraftWasteSource']>(),
  getDraftWasteSource:
    jest.fn<DaprUkWasteMovementsClient['getDraftWasteSource']>(),
  setDraftWasteCollectionAddressDetails:
    jest.fn<
      DaprUkWasteMovementsClient['setDraftWasteCollectionAddressDetails']
    >(),
  getDraftWasteCollectionAddressDetails:
    jest.fn<
      DaprUkWasteMovementsClient['getDraftWasteCollectionAddressDetails']
    >(),
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
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
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
            sicCodes: {
              status: 'Complete',
              values: ['123456'],
            },
          },
          wasteCollection: {
            address: {
              status: 'NotStarted',
            },
            wasteSource: {
              status: 'NotStarted',
            },
          },
        },
        carrier: {
          address: {
            status: 'NotStarted',
          },
          contact: {
            status: 'NotStarted',
          },
          modeOfTransport: {
            status: 'NotStarted',
          },
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

  it('sets producer address details on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockSetDraftProducerAddressDetailsResponse: Response<void> = {
      success: true,
      value: undefined,
    };

    mockClient.setDraftProducerAddressDetails.mockResolvedValueOnce(
      mockSetDraftProducerAddressDetailsResponse,
    );

    const value: UkwmAddress = {
      addressLine1: '123 Main St',
      addressLine2: 'Building 1',
      townCity: 'London',
      country: 'England [EN]',
      postcode: 'SW1A 1AA',
    };

    await subject.setDraftProducerAddressDetails(
      { id, accountId },
      value,
      true,
    );

    expect(mockClient.setDraftProducerAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
    expect(mockClient.setDraftProducerAddressDetails).toHaveBeenCalledTimes(1);
    expect(mockClient.setDraftProducerAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
  });

  it('gets producer address detail from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftProducerAddressDetailsResponse: GetDraftProducerAddressDetailsResponse =
      {
        success: true,
        value: {
          status: 'Started',
          addressLine1: '123 Main St',
          addressLine2: 'Building 1',
          townCity: 'London',
          country: 'England [EN]',
          postcode: 'SW1A 1AA',
        },
      };

    mockClient.getDraftProducerAddressDetails.mockResolvedValueOnce(
      mockGetDraftProducerAddressDetailsResponse,
    );

    const result = await subject.getDraftProducerAddressDetails({
      id,
      accountId,
    });

    expect(mockClient.getDraftProducerAddressDetails).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(mockGetDraftProducerAddressDetailsResponse.value);
  });

  it('sets producer contact detail on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockSetDraftProducerContactDetailResponse: SetDraftProducerContactDetailResponse =
      {
        success: true,
        value: undefined,
      };

    mockClient.setDraftProducerContactDetail.mockResolvedValueOnce(
      mockSetDraftProducerContactDetailResponse,
    );
    const value: UkwmContact = {
      organisationName: 'Org name',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
    };

    await subject.setDraftProducerContactDetail({ id, accountId }, value, true);

    expect(mockClient.setDraftProducerContactDetail).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
    expect(mockClient.setDraftProducerContactDetail).toHaveBeenCalledTimes(1);
    expect(mockClient.setDraftProducerContactDetail).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
  });

  it('gets producer contact detail from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftProducerContactDetailResponse: GetDraftProducerContactDetailResponse =
      {
        success: true,
        value: {
          status: 'Started',
          organisationName: 'Org name',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '123-456-7890',
        },
      };

    mockClient.getDraftProducerContactDetail.mockResolvedValueOnce(
      mockGetDraftProducerContactDetailResponse,
    );

    const result = await subject.getDraftProducerContactDetail({
      id,
      accountId,
    });

    expect(mockClient.getDraftProducerContactDetail).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(mockGetDraftProducerContactDetailResponse.value);
  });

  it('sets waste source on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockSetDraftWasteSourceResponse: SetDraftWasteSourceResponse = {
      success: true,
      value: undefined,
    };

    mockClient.setDraftWasteSource.mockResolvedValueOnce(
      mockSetDraftWasteSourceResponse,
    );
    const wasteSource = 'Industrial';

    await subject.setDraftWasteSource({ id, accountId, wasteSource });

    expect(mockClient.setDraftWasteSource).toHaveBeenCalledWith({
      id,
      accountId,
      wasteSource,
    });
    expect(mockClient.setDraftWasteSource).toHaveBeenCalledTimes(1);
    expect(mockClient.setDraftWasteSource).toHaveBeenCalledWith({
      id,
      accountId,
      wasteSource,
    });
  });

  it('gets waste source from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftWasteSourceResponse: GetDraftWasteSourceResponse = {
      success: true,
      value: {
        status: 'Complete',
        value: 'Industrial',
      },
    };

    mockClient.getDraftWasteSource.mockResolvedValueOnce(
      mockGetDraftWasteSourceResponse,
    );

    const result = await subject.getDraftWasteSource({
      id,
      accountId,
    });

    expect(mockClient.getDraftWasteSource).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(mockGetDraftWasteSourceResponse.value);
  });

  it('sets waste collection address details on a draft', async () => {
    const accountId = faker.string.uuid();
    const id = faker.string.uuid();
    const mockSetDraftWasteCollectionAddressDetailsResponse: Response<void> = {
      success: true,
      value: undefined,
    };

    mockClient.setDraftWasteCollectionAddressDetails.mockResolvedValueOnce(
      mockSetDraftWasteCollectionAddressDetailsResponse,
    );

    const value: UkwmAddress = {
      addressLine1: '123 Main St',
      addressLine2: 'Building 1',
      townCity: 'London',
      country: 'England [EN]',
      postcode: 'SW1A 1AA',
    };

    await subject.setDraftWasteCollectionAddressDetails(
      { id, accountId },
      value,
      true,
    );

    expect(
      mockClient.setDraftWasteCollectionAddressDetails,
    ).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
    expect(
      mockClient.setDraftWasteCollectionAddressDetails,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockClient.setDraftWasteCollectionAddressDetails,
    ).toHaveBeenCalledWith({
      id,
      accountId,
      value,
      saveAsDraft: true,
    });
  });

  it('gets waste collection address detail from a draft', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const mockGetDraftWasteCollectionAddressDetailsResponse: GetDraftWasteCollectionAddressDetailsResponse =
      {
        success: true,
        value: {
          status: 'Started',
          addressLine1: '123 Main St',
          addressLine2: 'Building 1',
          townCity: 'London',
          country: 'England [EN]',
          postcode: 'SW1A 1AA',
        },
      };

    mockClient.getDraftWasteCollectionAddressDetails.mockResolvedValueOnce(
      mockGetDraftWasteCollectionAddressDetailsResponse,
    );

    const result = await subject.getDraftWasteCollectionAddressDetails({
      id,
      accountId,
    });

    expect(
      mockClient.getDraftWasteCollectionAddressDetails,
    ).toHaveBeenCalledWith({
      id,
      accountId,
    });
    expect(result).toEqual(
      mockGetDraftWasteCollectionAddressDetailsResponse.value,
    );
  });
});
