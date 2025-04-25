import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import { AnnexViiServiceSubmissionBackend } from './submission.backend';
import { Logger } from 'winston';
import { DaprAnnexViiClient } from '@wts/client/green-list-waste-export';
import { draft } from '@wts/api/green-list-waste-export';
import {
  Carriers,
  ExitLocation,
  RecoveryFacilityDetail,
  TransitCountries,
} from '@wts/api/waste-tracking-gateway';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClient = {
  getDraft: jest.fn<DaprAnnexViiClient['getDraft']>(),
  getDrafts: jest.fn<DaprAnnexViiClient['getDrafts']>(),
  getSubmission: jest.fn<DaprAnnexViiClient['getSubmission']>(),
  getSubmissions: jest.fn<DaprAnnexViiClient['getSubmissions']>(),
  createDraft: jest.fn<DaprAnnexViiClient['createDraft']>(),
  deleteDraft: jest.fn<DaprAnnexViiClient['deleteDraft']>(),
  cancelSubmission: jest.fn<DaprAnnexViiClient['cancelSubmission']>(),
  getDraftCustomerReference:
    jest.fn<DaprAnnexViiClient['getDraftCustomerReference']>(),
  setDraftCustomerReference:
    jest.fn<DaprAnnexViiClient['setDraftCustomerReference']>(),
  getDraftWasteDescription:
    jest.fn<DaprAnnexViiClient['getDraftWasteDescription']>(),
  setDraftWasteDescription:
    jest.fn<DaprAnnexViiClient['setDraftWasteDescription']>(),
  getDraftWasteQuantity: jest.fn<DaprAnnexViiClient['getDraftWasteQuantity']>(),
  getWasteQuantity: jest.fn<DaprAnnexViiClient['getWasteQuantity']>(),
  setDraftWasteQuantity: jest.fn<DaprAnnexViiClient['setDraftWasteQuantity']>(),
  setWasteQuantity: jest.fn<DaprAnnexViiClient['setWasteQuantity']>(),
  getDraftExporterDetail:
    jest.fn<DaprAnnexViiClient['getDraftExporterDetail']>(),
  setDraftExporterDetail:
    jest.fn<DaprAnnexViiClient['setDraftExporterDetail']>(),
  getDraftImporterDetail:
    jest.fn<DaprAnnexViiClient['getDraftImporterDetail']>(),
  setDraftImporterDetail:
    jest.fn<DaprAnnexViiClient['setDraftImporterDetail']>(),
  getDraftCollectionDate:
    jest.fn<DaprAnnexViiClient['getDraftCollectionDate']>(),
  getCollectionDate: jest.fn<DaprAnnexViiClient['getCollectionDate']>(),
  setDraftCollectionDate:
    jest.fn<DaprAnnexViiClient['setDraftCollectionDate']>(),
  setCollectionDate: jest.fn<DaprAnnexViiClient['setCollectionDate']>(),
  listDraftCarriers: jest.fn<DaprAnnexViiClient['listDraftCarriers']>(),
  createDraftCarriers: jest.fn<DaprAnnexViiClient['createDraftCarriers']>(),
  getDraftCarriers: jest.fn<DaprAnnexViiClient['getDraftCarriers']>(),
  setDraftCarriers: jest.fn<DaprAnnexViiClient['setDraftCarriers']>(),
  getDraftCollectionDetail:
    jest.fn<DaprAnnexViiClient['getDraftCollectionDetail']>(),
  setDraftCollectionDetail:
    jest.fn<DaprAnnexViiClient['setDraftCollectionDetail']>(),
  getDraftUkExitLocation:
    jest.fn<DaprAnnexViiClient['getDraftUkExitLocation']>(),
  setDraftUkExitLocation:
    jest.fn<DaprAnnexViiClient['setDraftUkExitLocation']>(),
  getDraftTransitCountries:
    jest.fn<DaprAnnexViiClient['getDraftTransitCountries']>(),
  setDraftTransitCountries:
    jest.fn<DaprAnnexViiClient['setDraftTransitCountries']>(),
  createDraftRecoveryFacilityDetails:
    jest.fn<DaprAnnexViiClient['createDraftRecoveryFacilityDetails']>(),
  getDraftRecoveryFacilityDetails:
    jest.fn<DaprAnnexViiClient['getDraftRecoveryFacilityDetails']>(),
  setDraftRecoveryFacilityDetails:
    jest.fn<DaprAnnexViiClient['setDraftRecoveryFacilityDetails']>(),
  getDraftSubmissionConfirmation:
    jest.fn<DaprAnnexViiClient['getDraftSubmissionConfirmation']>(),
  setDraftSubmissionConfirmation:
    jest.fn<DaprAnnexViiClient['setDraftSubmissionConfirmation']>(),
  getDraftSubmissionDeclaration:
    jest.fn<DaprAnnexViiClient['getDraftSubmissionDeclaration']>(),
  setDraftSubmissionDeclaration:
    jest.fn<DaprAnnexViiClient['setDraftSubmissionDeclaration']>(),
  createDraftFromTemplate:
    jest.fn<DaprAnnexViiClient['createDraftFromTemplate']>(),
  getNumberOfSubmissions:
    jest.fn<DaprAnnexViiClient['getNumberOfSubmissions']>(),
};

describe(AnnexViiServiceSubmissionBackend, () => {
  const subject = new AnnexViiServiceSubmissionBackend(
    mockClient as unknown as DaprAnnexViiClient,
    new Logger(),
  );

  beforeEach(() => {
    mockClient.getDraft.mockClear();
    mockClient.getDrafts.mockClear();
    mockClient.getSubmission.mockClear();
    mockClient.getSubmissions.mockClear();
    mockClient.createDraft.mockClear();
    mockClient.deleteDraft.mockClear();
    mockClient.cancelSubmission.mockClear();
    mockClient.getDraftCustomerReference.mockClear();
    mockClient.setDraftCustomerReference.mockClear();
    mockClient.getDraftWasteDescription.mockClear();
    mockClient.setDraftWasteDescription.mockClear();
    mockClient.getDraftWasteQuantity.mockClear();
    mockClient.getWasteQuantity.mockClear();
    mockClient.setDraftWasteQuantity.mockClear();
    mockClient.setWasteQuantity.mockClear();
    mockClient.getDraftExporterDetail.mockClear();
    mockClient.setDraftExporterDetail.mockClear();
    mockClient.getDraftImporterDetail.mockClear();
    mockClient.setDraftImporterDetail.mockClear();
    mockClient.getDraftCollectionDate.mockClear();
    mockClient.getCollectionDate.mockClear();
    mockClient.setDraftCollectionDate.mockClear();
    mockClient.setCollectionDate.mockClear();
    mockClient.listDraftCarriers.mockClear();
    mockClient.createDraftCarriers.mockClear();
    mockClient.getDraftCarriers.mockClear();
    mockClient.setDraftCarriers.mockClear();
    mockClient.getDraftCollectionDetail.mockClear();
    mockClient.setDraftCollectionDetail.mockClear();
    mockClient.getDraftUkExitLocation.mockClear();
    mockClient.setDraftUkExitLocation.mockClear();
    mockClient.getDraftTransitCountries.mockClear();
    mockClient.setDraftTransitCountries.mockClear();
    mockClient.createDraftRecoveryFacilityDetails.mockClear();
    mockClient.getDraftRecoveryFacilityDetails.mockClear();
    mockClient.setDraftRecoveryFacilityDetails.mockClear();
    mockClient.getDraftSubmissionConfirmation.mockClear();
    mockClient.setDraftSubmissionConfirmation.mockClear();
    mockClient.getDraftSubmissionDeclaration.mockClear();
    mockClient.setDraftSubmissionDeclaration.mockClear();
    mockClient.createDraftFromTemplate.mockClear();
    mockClient.getNumberOfSubmissions.mockClear();
  });

  it('persists a created submission', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: '',
        wasteQuantity: {
          status: 'CannotStart',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'NotStarted',
        },
        submissionDeclaration: {
          status: 'NotStarted',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
        recoveryFacilityDetail: {
          status: 'NotStarted',
        },
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    const { id } = await subject.createSubmission(accountId, reference);

    const mockGetDraftResponse: draft.GetDraftResponse = {
      success: true,
      value: mockCreateDraftResponse.value,
    };

    mockClient.getDraft.mockResolvedValueOnce(mockGetDraftResponse);
    const result = await subject.getSubmission({
      id,
      accountId,
      submitted: false,
    });

    expect(result.id).toEqual(id);
    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
    expect(mockClient.getDraft).toBeCalledWith({ id, accountId });
  });

  it('bad request if reference more than 20 chars', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(21);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: false,
      error: {
        statusCode: 400,
        name: 'Bad Request',
        message: 'Reference cannot be more than 20 characters',
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    await expect(
      subject.createSubmission(accountId, reference),
    ).rejects.toHaveProperty('isBoom', true);

    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
  });
  it('creates a submission with a reference', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: reference,
        wasteQuantity: {
          status: 'CannotStart',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
        recoveryFacilityDetail: {
          status: 'CannotStart',
        },
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    const { id } = await subject.createSubmission(accountId, reference);

    const mockGetDraftByIdResponse: draft.GetDraftResponse = {
      success: true,
      value: mockCreateDraftResponse.value,
    };

    mockClient.getDraft.mockResolvedValueOnce(mockGetDraftByIdResponse);

    const result = await subject.getSubmission({
      id,
      accountId,
      submitted: false,
    });

    expect(result.id).toEqual(id);
    expect(result.reference).toBe(reference);
    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
    expect(mockClient.getDraft).toBeCalledWith({ id, accountId });
  });

  it('creates a submission and gets the submission using returned id to check all statuses are correct', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: reference,
        wasteQuantity: {
          status: 'CannotStart',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
        recoveryFacilityDetail: {
          status: 'CannotStart',
        },
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    const { id } = await subject.createSubmission(accountId, reference);

    const mockGetDraftByIdResponse: draft.GetDraftResponse = {
      success: true,
      value: mockCreateDraftResponse.value,
    };

    mockClient.getDraft.mockResolvedValueOnce(mockGetDraftByIdResponse);

    const result = await subject.getSubmission({
      id,
      accountId,
      submitted: false,
    });

    expect(result.id).toEqual(id);
    expect(result.reference).toBe(reference);
    expect(result.wasteDescription).toBe(
      mockCreateDraftResponse.value.wasteDescription,
    );
    expect(result.wasteQuantity).toBe(
      mockCreateDraftResponse.value.wasteQuantity,
    );
    expect(result.exporterDetail).toBe(
      mockCreateDraftResponse.value.exporterDetail,
    );
    expect(result.importerDetail).toBe(
      mockCreateDraftResponse.value.importerDetail,
    );
    expect(result.collectionDate).toBe(
      mockCreateDraftResponse.value.collectionDate,
    );
    expect(result.carriers).toBe(mockCreateDraftResponse.value.carriers);
    expect(result.collectionDetail).toBe(
      mockCreateDraftResponse.value.collectionDetail,
    );
    expect(result.ukExitLocation).toBe(
      mockCreateDraftResponse.value.ukExitLocation,
    );
    expect(result.transitCountries).toBe(
      mockCreateDraftResponse.value.transitCountries,
    );
    expect(result.recoveryFacilityDetail).toBe(
      mockCreateDraftResponse.value.recoveryFacilityDetail,
    );
    expect(result.submissionDeclaration).toBe(
      mockCreateDraftResponse.value.submissionDeclaration,
    );
    expect(result.submissionState).toBe(
      mockCreateDraftResponse.value.submissionState,
    );

    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
    expect(mockClient.getDraft).toBeCalledWith({ id, accountId });
  });

  it('enables waste quantity on completion of waste description', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: reference,
        wasteQuantity: {
          status: 'NotStarted',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
        recoveryFacilityDetail: {
          status: 'CannotStart',
        },
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    const { id } = await subject.createSubmission(accountId, reference);

    const wasteDescription: draft.DraftWasteDescription = {
      status: 'Complete',
      wasteCode: { type: 'NotApplicable' },
      ewcCodes: [],
      nationalCode: { provided: 'No' },
      description: '',
    };

    const mockSetDraftWasteDescriptionByIdResponse: draft.SetDraftWasteDescriptionResponse =
      {
        success: true,
        value: undefined,
      };

    mockClient.setDraftWasteDescription.mockResolvedValueOnce(
      mockSetDraftWasteDescriptionByIdResponse,
    );

    await subject.setWasteDescription({ id, accountId }, wasteDescription);

    const mockGetDraftByIdResponse: draft.GetDraftResponse = {
      success: true,
      value: {
        ...mockCreateDraftResponse.value,
        wasteDescription: wasteDescription,
        wasteQuantity: {
          status: 'NotStarted',
        },
      },
    };

    mockClient.getDraft.mockResolvedValueOnce(mockGetDraftByIdResponse);

    const result = await subject.getSubmission({
      id,
      accountId,
      submitted: false,
    });

    expect(result?.wasteQuantity).toEqual(
      mockCreateDraftResponse.value.wasteQuantity,
    );

    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
    expect(mockClient.setDraftWasteDescription).toBeCalledWith({
      id,
      accountId,
      value: wasteDescription,
    });
    expect(mockClient.getDraft).toBeCalledWith({ id, accountId });
  });

  it('cannot initially start recovery facility section', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: reference,
        recoveryFacilityDetail: {
          status: 'CannotStart',
        },
        wasteQuantity: {
          status: 'CannotStart',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    const { recoveryFacilityDetail } = await subject.createSubmission(
      accountId,
      reference,
    );

    expect(recoveryFacilityDetail.status).toBe('CannotStart');

    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
  });

  it('enables recovery facility where some waste code is provided', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: reference,
        wasteQuantity: {
          status: 'CannotStart',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
        recoveryFacilityDetail: {
          status: 'NotStarted',
        },
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    const { id } = await subject.createSubmission(accountId, reference);

    const wasteDescription: draft.DraftWasteDescription = {
      status: 'Started',
      wasteCode: { type: 'AnnexIIIA', code: 'X' },
    };

    const mockSetDraftWasteDescriptionByIdResponse: draft.SetDraftWasteDescriptionResponse =
      {
        success: true,
        value: undefined,
      };

    mockClient.setDraftWasteDescription.mockResolvedValueOnce(
      mockSetDraftWasteDescriptionByIdResponse,
    );

    await subject.setWasteDescription({ id, accountId }, wasteDescription);

    const mockGetDraftByIdResponse: draft.GetDraftResponse = {
      success: true,
      value: {
        ...mockCreateDraftResponse.value,
        wasteDescription: wasteDescription,
        recoveryFacilityDetail: {
          status: 'NotStarted',
        },
      },
    };

    mockClient.getDraft.mockResolvedValueOnce(mockGetDraftByIdResponse);

    const result = await subject.getSubmission({
      id,
      accountId,
      submitted: false,
    });

    expect(result?.recoveryFacilityDetail).toEqual(
      mockCreateDraftResponse.value.recoveryFacilityDetail,
    );

    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
    expect(mockClient.setDraftWasteDescription).toBeCalledWith({
      id,
      accountId,
      value: wasteDescription,
    });
    expect(mockClient.getDraft).toBeCalledWith({ id, accountId });
  });

  it('enables recovery facility where some waste code is provided', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: reference,
        wasteQuantity: {
          status: 'CannotStart',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
        recoveryFacilityDetail: {
          status: 'NotStarted',
        },
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    const { id } = await subject.createSubmission(accountId, reference);

    const wasteDescription: draft.DraftWasteDescription = {
      status: 'Started',
      wasteCode: { type: 'AnnexIIIA', code: 'X' },
    };

    const mockSetDraftWasteDescriptionByIdResponse: draft.SetDraftWasteDescriptionResponse =
      {
        success: true,
        value: undefined,
      };

    mockClient.setDraftWasteDescription.mockResolvedValueOnce(
      mockSetDraftWasteDescriptionByIdResponse,
    );

    await subject.setWasteDescription({ id, accountId }, wasteDescription);

    const mockGetDraftByIdResponse: draft.GetDraftResponse = {
      success: true,
      value: {
        ...mockCreateDraftResponse.value,
        wasteDescription: wasteDescription,
        recoveryFacilityDetail: {
          status: 'NotStarted',
        },
      },
    };

    mockClient.getDraft.mockResolvedValueOnce(mockGetDraftByIdResponse);

    const result = await subject.getSubmission({
      id,
      accountId,
      submitted: false,
    });

    expect(result?.recoveryFacilityDetail).toEqual(
      mockCreateDraftResponse.value.recoveryFacilityDetail,
    );

    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
    expect(mockClient.setDraftWasteDescription).toBeCalledWith({
      id,
      accountId,
      value: wasteDescription,
    });
    expect(mockClient.getDraft).toBeCalledWith({ id, accountId });
  });

  it('rejects where reference not found', async () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: false,
      error: {
        statusCode: 404,
        name: 'Not Found',
        message: 'Reference not found',
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    await expect(
      subject.createSubmission(accountId, reference),
    ).rejects.toHaveProperty('isBoom', true);

    const mockGetDraftWasteDescriptionByIdResponse: draft.GetDraftWasteDescriptionResponse =
      {
        success: false,
        error: {
          statusCode: 404,
          name: 'Not Found',
          message: 'Reference not found',
        },
      };

    mockClient.getDraftWasteDescription.mockResolvedValueOnce(
      mockGetDraftWasteDescriptionByIdResponse,
    );

    await expect(
      subject.getWasteDescription({ id, accountId }),
    ).rejects.toHaveProperty('isBoom', true);

    const mockGetDraftCustomerReferenceByIdResponse: draft.GetDraftCustomerReferenceResponse =
      {
        success: false,
        error: {
          statusCode: 404,
          name: 'Not Found',
          message: 'Reference not found',
        },
      };

    mockClient.getDraftCustomerReference.mockResolvedValueOnce(
      mockGetDraftCustomerReferenceByIdResponse,
    );

    await expect(
      subject.getCustomerReference({ id, accountId }),
    ).rejects.toHaveProperty('isBoom', true);

    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
    expect(mockClient.getDraftWasteDescription).toBeCalledWith({
      id,
      accountId,
    });
    expect(mockClient.getDraftCustomerReference).toBeCalledWith({
      id,
      accountId,
    });
  });

  it('lets us change a carrier detail', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: reference,
        wasteQuantity: {
          status: 'CannotStart',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
        recoveryFacilityDetail: {
          status: 'CannotStart',
        },
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    const { id } = await subject.createSubmission(accountId, reference);

    const status: Omit<Carriers, 'transport' | 'values'> = {
      status: 'Started',
    };

    const mockCreateDraftCarriersResponse: draft.CreateDraftCarriersResponse = {
      success: true,
      value: {
        status: status.status,
        transport: false,
        values: [
          {
            id: faker.string.uuid(),
            addressDetails: {
              organisationName: 'Acme Corporation',
              address: '123 Main St, Anytown',
              country: 'Bulgaria',
            },
            contactDetails: {
              fullName: 'John Doe',
              emailAddress: 'john.doe@example.com',
              phoneNumber: '123-456-7890',
            },
          },
        ],
      },
    };

    mockClient.createDraftCarriers.mockResolvedValueOnce(
      mockCreateDraftCarriersResponse,
    );

    const carriers = await subject.createCarriers({ id, accountId }, status);

    if (carriers.status !== 'Started') {
      expect(false);
    } else {
      const carrierId = carriers.values[0].id;
      const value: Carriers = {
        status: status.status,
        transport: true,
        values: [
          {
            id: carriers.values[0].id,
            addressDetails: {
              organisationName: 'Acme Inc',
              address: '123 Anytown',
              country: 'UK',
            },
            contactDetails: {
              fullName: 'John Doe',
              emailAddress: 'johndoe@acme.com',
              phoneNumber: '555-1234',
              faxNumber: '555-5678',
            },
            transportDetails: {
              type: 'Road',
              description: 'hitch-hiking',
            },
          },
        ],
      };

      const mockSetDraftCarriersResponse: draft.SetDraftCarriersResponse = {
        success: true,
        value: undefined,
      };

      mockClient.setDraftCarriers.mockResolvedValueOnce(
        mockSetDraftCarriersResponse,
      );

      await subject.setCarriers({ id, accountId }, carrierId, value);

      const mockGetDraftCarriersResponse: draft.GetDraftCarriersResponse = {
        success: true,
        value: value,
      };

      mockClient.getDraftCarriers.mockResolvedValueOnce(
        mockGetDraftCarriersResponse,
      );

      expect(await subject.getCarriers({ id, accountId }, carrierId)).toEqual(
        value,
      );

      expect(mockClient.createDraft).toBeCalledWith({
        accountId,
        reference,
      });
      expect(mockClient.createDraftCarriers).toBeCalledWith({
        id,
        accountId,
        value: status,
      });
      expect(mockClient.setDraftCarriers).toBeCalledWith({
        id,
        accountId,
        carrierId,
        value,
      });
      expect(mockClient.getDraftCarriers).toBeCalledWith({
        id,
        accountId,
        carrierId,
      });
    }
  });

  it('accepts set exit location if provided is Yes and value is given', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: reference,
        wasteQuantity: {
          status: 'CannotStart',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
        recoveryFacilityDetail: {
          status: 'CannotStart',
        },
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    const { id } = await subject.createSubmission(accountId, reference);

    const setExitLocationRequest: ExitLocation = {
      status: 'Complete',
      exitLocation: { provided: 'Yes', value: faker.string.sample() },
    };

    const mockSetDraftExitLocationByIdResponse: draft.SetDraftUkExitLocationResponse =
      {
        success: true,
        value: undefined,
      };

    mockClient.setDraftUkExitLocation.mockResolvedValueOnce(
      mockSetDraftExitLocationByIdResponse,
    );

    await expect(
      subject.setExitLocation({ id, accountId }, setExitLocationRequest),
    ).resolves.toEqual(undefined);

    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
    expect(mockClient.setDraftUkExitLocation).toBeCalledWith({
      id,
      accountId,
      value: setExitLocationRequest,
    });
  });

  it('lets us change a Transit Countries data', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: reference,
        wasteQuantity: {
          status: 'CannotStart',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
        recoveryFacilityDetail: {
          status: 'CannotStart',
        },
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    const { id } = await subject.createSubmission(accountId, reference);

    const transitCountryData: TransitCountries = {
      status: 'Complete',
      values: ['N. Ireland', 'Wales'],
    };

    const mockSetDraftTransitCountriesResponse: draft.SetDraftTransitCountriesResponse =
      {
        success: true,
        value: undefined,
      };

    mockClient.setDraftTransitCountries.mockResolvedValueOnce(
      mockSetDraftTransitCountriesResponse,
    );

    await subject.setTransitCountries({ id, accountId }, transitCountryData);

    const mockGetDraftTransitCountriesResponse: draft.GetDraftTransitCountriesResponse =
      {
        success: true,
        value: transitCountryData,
      };

    mockClient.getDraftTransitCountries.mockResolvedValueOnce(
      mockGetDraftTransitCountriesResponse,
    );

    expect(await subject.getTransitCountries({ id, accountId })).toEqual(
      transitCountryData,
    );

    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
    expect(mockClient.setDraftTransitCountries).toBeCalledWith({
      id,
      accountId,
      value: transitCountryData,
    });
    expect(mockClient.getDraftTransitCountries).toBeCalledWith({
      id,
      accountId,
    });
  });

  it('lets us change a Recovery Facility Detail', async () => {
    const accountId = faker.string.uuid();
    const reference = faker.string.sample(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
        reference: reference,
        wasteQuantity: {
          status: 'CannotStart',
        },
        collectionDate: {
          status: 'NotStarted',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: {
          status: 'NotStarted',
        },
        importerDetail: {
          status: 'NotStarted',
        },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: {
          status: 'NotStarted',
        },
        ukExitLocation: {
          status: 'NotStarted',
        },
        transitCountries: {
          status: 'NotStarted',
        },
        recoveryFacilityDetail: {
          status: 'CannotStart',
        },
      },
    };

    mockClient.createDraft.mockResolvedValueOnce(mockCreateDraftResponse);

    const { id } = await subject.createSubmission(accountId, reference);

    const status: Omit<RecoveryFacilityDetail, 'values'> = {
      status: 'Started',
    };

    const mockCreateDraftRecoveryFacilityDetailsResponse: draft.CreateDraftRecoveryFacilityDetailsResponse =
      {
        success: true,
        value: {
          status: status.status,
          values: [
            {
              id: faker.string.uuid(),
              addressDetails: {
                name: 'Acme Corporation',
                address: '123 Main St, Anytown',
                country: 'Bulgaria',
              },
              contactDetails: {
                fullName: 'John Doe',
                emailAddress: 'john.doe@example.com',
                phoneNumber: '123-456-7890',
              },
              recoveryFacilityType: {
                type: 'Laboratory',
                disposalCode: 'LAB123',
              },
            },
          ],
        },
      };

    mockClient.createDraftRecoveryFacilityDetails.mockResolvedValueOnce(
      mockCreateDraftRecoveryFacilityDetailsResponse,
    );

    const recoveryFacilities = await subject.createRecoveryFacilityDetail(
      { id, accountId },
      status,
    );

    if (recoveryFacilities.status !== 'Started') {
      expect(false);
    } else {
      const rfdId = recoveryFacilities.values[0].id;
      const value: RecoveryFacilityDetail = {
        status: status.status,
        values: [
          {
            id: recoveryFacilities.values[0].id,
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D01',
            },
            addressDetails: {
              name: 'Fireflies',
              address: '15 Firefly Ave',
              country: 'Boston',
            },
            contactDetails: {
              fullName: 'Joel Miller',
              emailAddress: 'jm@tlou.com',
              phoneNumber: '0123456789',
            },
          },
        ],
      };

      const mockSetDraftRecoveryFacilityDetailsResponse: draft.SetDraftRecoveryFacilityDetailsResponse =
        {
          success: true,
          value: undefined,
        };

      mockClient.setDraftRecoveryFacilityDetails.mockResolvedValueOnce(
        mockSetDraftRecoveryFacilityDetailsResponse,
      );

      await subject.setRecoveryFacilityDetail({ id, accountId }, rfdId, value);

      const mockGetDraftRecoveryFacilityDetailsResponse: draft.GetDraftRecoveryFacilityDetailsResponse =
        {
          success: true,
          value: value,
        };

      mockClient.getDraftRecoveryFacilityDetails.mockResolvedValueOnce(
        mockGetDraftRecoveryFacilityDetailsResponse,
      );

      expect(
        await subject.getRecoveryFacilityDetail({ id, accountId }, rfdId),
      ).toEqual(value);

      expect(mockClient.createDraft).toBeCalledWith({
        accountId,
        reference,
      });
      expect(mockClient.createDraftRecoveryFacilityDetails).toBeCalledWith({
        id,
        accountId,
        value: status,
      });
      expect(mockClient.setDraftRecoveryFacilityDetails).toBeCalledWith({
        id,
        accountId,
        rfdId,
        value,
      });
      expect(mockClient.getDraftRecoveryFacilityDetails).toBeCalledWith({
        id,
        accountId,
        rfdId,
      });
    }
  });
});
