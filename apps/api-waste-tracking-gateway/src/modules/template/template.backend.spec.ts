import { faker } from '@faker-js/faker';
import { expect, jest } from '@jest/globals';
import { AnnexViiServiceTemplateBackend } from './template.backend';
import { DaprAnnexViiClient } from '@wts/client/green-list-waste-export';
import { Logger } from 'winston';
import { template } from '@wts/api/green-list-waste-export';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

const mockClient = {
  getTemplates: jest.fn<DaprAnnexViiClient['getTemplates']>(),
  getTemplate: jest.fn<DaprAnnexViiClient['getTemplate']>(),
  createTemplate: jest.fn<DaprAnnexViiClient['createTemplate']>(),
  updateTemplate: jest.fn<DaprAnnexViiClient['updateTemplate']>(),
  deleteTemplate: jest.fn<DaprAnnexViiClient['deleteTemplate']>(),
  createTemplateFromSubmission:
    jest.fn<DaprAnnexViiClient['createTemplateFromSubmission']>(),
  createTemplateFromTemplate:
    jest.fn<DaprAnnexViiClient['createTemplateFromTemplate']>(),
  getNumberOfTemplates: jest.fn<DaprAnnexViiClient['getNumberOfTemplates']>(),
  getTemplateWasteDescription:
    jest.fn<DaprAnnexViiClient['getTemplateWasteDescription']>(),
  setTemplateWasteDescription:
    jest.fn<DaprAnnexViiClient['setTemplateWasteDescription']>(),
  getTemplateExporterDetail:
    jest.fn<DaprAnnexViiClient['getTemplateExporterDetail']>(),
  setTemplateExporterDetail:
    jest.fn<DaprAnnexViiClient['setTemplateExporterDetail']>(),
  getTemplateImporterDetail:
    jest.fn<DaprAnnexViiClient['getTemplateImporterDetail']>(),
  setTemplateImporterDetail:
    jest.fn<DaprAnnexViiClient['setTemplateImporterDetail']>(),
  listTemplateCarriers: jest.fn<DaprAnnexViiClient['listTemplateCarriers']>(),
  createTemplateCarriers:
    jest.fn<DaprAnnexViiClient['createTemplateCarriers']>(),
  getTemplateCarriers: jest.fn<DaprAnnexViiClient['getTemplateCarriers']>(),
  setTemplateCarriers: jest.fn<DaprAnnexViiClient['setTemplateCarriers']>(),
  getTemplateCollectionDetail:
    jest.fn<DaprAnnexViiClient['getTemplateCollectionDetail']>(),
  setTemplateCollectionDetail:
    jest.fn<DaprAnnexViiClient['setTemplateCollectionDetail']>(),
  getTemplateUkExitLocation:
    jest.fn<DaprAnnexViiClient['getTemplateUkExitLocation']>(),
  setTemplateUkExitLocation:
    jest.fn<DaprAnnexViiClient['setTemplateUkExitLocation']>(),
  getTemplateTransitCountries:
    jest.fn<DaprAnnexViiClient['getTemplateTransitCountries']>(),
  setTemplateTransitCountries:
    jest.fn<DaprAnnexViiClient['setTemplateTransitCountries']>(),
  createTemplateRecoveryFacilityDetails:
    jest.fn<DaprAnnexViiClient['createTemplateRecoveryFacilityDetails']>(),
  getTemplateRecoveryFacilityDetails:
    jest.fn<DaprAnnexViiClient['getTemplateRecoveryFacilityDetails']>(),
  setTemplateRecoveryFacilityDetails:
    jest.fn<DaprAnnexViiClient['setTemplateRecoveryFacilityDetails']>(),
};

describe(AnnexViiServiceTemplateBackend, () => {
  const accountId = faker.datatype.uuid();
  const subject = new AnnexViiServiceTemplateBackend(
    mockClient as unknown as DaprAnnexViiClient,
    new Logger()
  );

  beforeEach(() => {
    mockClient.getTemplates.mockClear();
    mockClient.getTemplate.mockClear();
    mockClient.createTemplate.mockClear();
    mockClient.updateTemplate.mockClear();
    mockClient.deleteTemplate.mockClear();
    mockClient.createTemplateFromSubmission.mockClear();
    mockClient.createTemplateFromTemplate.mockClear();
    mockClient.getNumberOfTemplates.mockClear();
    mockClient.getTemplateWasteDescription.mockClear();
    mockClient.setTemplateWasteDescription.mockClear();
    mockClient.getTemplateExporterDetail.mockClear();
    mockClient.setTemplateExporterDetail.mockClear();
    mockClient.getTemplateImporterDetail.mockClear();
    mockClient.setTemplateImporterDetail.mockClear();
    mockClient.listTemplateCarriers.mockClear();
    mockClient.createTemplateCarriers.mockClear();
    mockClient.getTemplateCarriers.mockClear();
    mockClient.setTemplateCarriers.mockClear();
    mockClient.getTemplateCollectionDetail.mockClear();
    mockClient.setTemplateCollectionDetail.mockClear();
    mockClient.getTemplateUkExitLocation.mockClear();
    mockClient.setTemplateUkExitLocation.mockClear();
    mockClient.getTemplateTransitCountries.mockClear();
    mockClient.setTemplateTransitCountries.mockClear();
    mockClient.createTemplateRecoveryFacilityDetails.mockClear();
    mockClient.getTemplateRecoveryFacilityDetails.mockClear();
    mockClient.setTemplateRecoveryFacilityDetails.mockClear();
  });

  it('persists a created template', async () => {
    const mockCreateTemplateResponse: template.CreateTemplateResponse = {
      success: true,
      value: {
        templateDetails: {
          name: '',
          description: '',
          created: new Date(),
          lastModified: new Date(),
        },
        id: '',
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
    mockClient.createTemplate.mockResolvedValueOnce(mockCreateTemplateResponse);
    const { id } = await subject.createTemplate(accountId, {
      name: 'My Template',
      description: 'My template description',
    });
    const mockGetTemplateResponse: template.GetTemplateResponse = {
      success: true,
      value: mockCreateTemplateResponse.value,
    };

    mockClient.getTemplate.mockResolvedValueOnce(mockGetTemplateResponse);
    const result = await subject.getTemplate({ id, accountId });
    expect(result.id).toEqual(id);
    expect(result.wasteDescription.status).toEqual('NotStarted');
  });
});
