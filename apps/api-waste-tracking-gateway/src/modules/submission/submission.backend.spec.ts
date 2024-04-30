import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import { AnnexViiServiceSubmissionBackend } from './submission.backend';
import { Logger } from 'winston';
import { DaprAnnexViiClient } from '@wts/client/green-list-waste-export';
import { draft } from '@wts/api/green-list-waste-export';

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
    new Logger()
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
    const accountId = faker.datatype.uuid();
    const reference = faker.datatype.string(10);

    const mockCreateDraftResponse: draft.CreateDraftResponse = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
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
    const accountId = faker.datatype.uuid();
    const reference = faker.datatype.string(21);

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
      subject.createSubmission(accountId, reference)
    ).rejects.toHaveProperty('isBoom', true);

    expect(mockClient.createDraft).toBeCalledWith({
      accountId,
      reference,
    });
  });
});
