import { faker } from '@faker-js/faker';
import Boom from '@hapi/boom';
import { expect, jest } from '@jest/globals';
import winston from 'winston';
import {
  DbContainerNameKey,
  DraftCarriers,
  DraftRecoveryFacilityDetails,
  DraftWasteDescription,
  DraftExporterDetail,
  DraftImporterDetail,
  DraftCollectionDetail,
  DraftTransitCountries,
  DraftUkExitLocation,
  Template,
  validation,
  Submission,
} from '../../model';
import TemplateController from './controller';
import { CosmosRepository } from '../../data';
import { v4 as uuidv4 } from 'uuid';

jest.mock('winston', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    error: jest.fn(),
  })),
}));

jest.mock('uuid', () => ({ v4: () => '00000000-0000-0000-0000-000000000000' }));

const templateContainerName: DbContainerNameKey = 'templates';

const mockRepository = {
  getRecords: jest.fn<CosmosRepository['getRecords']>(),
  getRecord: jest.fn<CosmosRepository['getRecord']>(),
  saveRecord: jest.fn<CosmosRepository['saveRecord']>(),
  createBulkRecords: jest.fn<CosmosRepository['createBulkRecords']>(),
  deleteRecord: jest.fn<CosmosRepository['deleteRecord']>(),
  getTotalNumber: jest.fn<CosmosRepository['getTotalNumber']>(),
};

const wasteCodes = [
  {
    type: 'BaselAnnexIX',
    values: [
      {
        code: 'B1010',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'OECD',
    values: [
      {
        code: 'GB040',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'AnnexIIIA',
    values: [
      {
        code: 'B1010 and B1050',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
      {
        code: 'B1010 and B1070',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
  {
    type: 'AnnexIIIB',
    values: [
      {
        code: 'BEU04',
        value: {
          description: {
            en: 'English Description',
            cy: 'Welsh Description',
          },
        },
      },
    ],
  },
];

const ewcCodes = [
  {
    code: '010101',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
  {
    code: '010102',
    value: {
      description: {
        en: 'English Description',
        cy: 'Welsh Description',
      },
    },
  },
];

const countries = [
  {
    name: 'Afghanistan [AF]',
  },
  {
    name: 'France [FR]',
  },
  {
    name: 'Belgium [BE]',
  },
  {
    name: 'Burkina Faso [BF]',
  },
  {
    name: 'Åland Islands [AX]',
  },
  {
    name: 'Albania [AB]',
  },
];
describe(TemplateController, () => {
  const subject = new TemplateController(
    mockRepository as unknown as CosmosRepository,
    wasteCodes,
    ewcCodes,
    countries,
    new winston.Logger(),
  );
  const timestamp = new Date();

  beforeEach(() => {
    mockRepository.getRecords.mockClear();
    mockRepository.getRecord.mockClear();
    mockRepository.saveRecord.mockClear();
    mockRepository.createBulkRecords.mockClear();
    mockRepository.deleteRecord.mockClear();
    mockRepository.getTotalNumber.mockClear();
  });

  describe('createTemplateFromTemplate', () => {
    it('successfully copies template', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: Template = {
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      mockRepository.getRecord.mockResolvedValue(value);

      const response = await subject.createTemplateFromTemplate({
        id,
        accountId,
        templateDetails: { name: 'Copied Template', description: 'new desc' },
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value.templateDetails.name).toEqual('Copied Template');
    });

    it('returns an error if the template name is invalid', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: Template = {
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      mockRepository.getRecord.mockResolvedValue(value);

      let response = await subject.createTemplateFromTemplate({
        id,
        accountId,
        templateDetails: { name: '', description: 'new desc' },
      });
      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);

      response = await subject.createTemplateFromTemplate({
        id,
        accountId,
        templateDetails: {
          name: faker.string.sample(validation.TemplateNameChar.max + 1),
          description: 'new desc',
        },
      });
      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);

      response = await subject.createTemplateFromTemplate({
        id,
        accountId,
        templateDetails: {
          name: 'name',
          description: faker.string.sample(
            validation.TemplateDescriptionChar.max + 1,
          ),
        },
      });
      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
    });
  });

  describe('createDraftFromTemplate', () => {
    const id = uuidv4();
    const accountId = uuidv4();
    const template: Template = {
      id: id,
      templateDetails: {
        name: 'name',
        description: 'description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: {
        status: 'Complete',
        wasteCode: {
          type: 'AnnexIIIA',
          code: 'B1010 and B1050',
        },
        ewcCodes: [],
        nationalCode: { provided: 'No' },
        description: faker.string.sample(),
      },
      exporterDetail: {
        status: 'Complete',
        exporterAddress: {
          country: faker.string.sample(),
          postcode: faker.string.sample(),
          townCity: faker.string.sample(),
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
        },
        exporterContactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      importerDetail: {
        status: 'Complete',
        importerAddressDetails: {
          address: faker.string.sample(),
          country: faker.string.sample(),
          organisationName: faker.string.sample(),
        },
        importerContactDetails: {
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      carriers: {
        status: 'Started',
        transport: true,
        values: [
          {
            id: uuidv4(),
            transportDetails: {
              type: 'Road',
              description: 'test',
            },
            addressDetails: {
              organisationName: faker.string.sample(),
              country: faker.string.sample(),
              address: faker.string.sample(),
            },
            contactDetails: {
              fullName: faker.string.sample(),
              emailAddress: faker.string.sample(),
              phoneNumber: faker.string.sample(),
              faxNumber: faker.string.sample(),
            },
          },
        ],
      },
      collectionDetail: {
        status: 'Complete',
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          postcode: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.string.sample(),
        },
      },
      transitCountries: {
        status: 'Complete',
        values: ['Albania (AL)'],
      },
      recoveryFacilityDetail: {
        status: 'Complete',
        values: [
          {
            id: uuidv4(),
            recoveryFacilityType: {
              type: 'RecoveryFacility',
              recoveryCode: 'R1',
            },
            addressDetails: {
              address: faker.string.sample(),
              country: faker.string.sample(),
              name: faker.string.sample(),
            },
            contactDetails: {
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
            },
          },
        ],
      },
    };

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.createDraftFromTemplate({
        id,
        accountId,
        reference: 'test',
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(418);
    });

    it('successfully creates a draft from a template', async () => {
      jest.useFakeTimers().setSystemTime(new Date());

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.createDraftFromTemplate({
        id,
        accountId,
        reference: 'test',
      });

      expect(mockRepository.saveRecord).toBeCalled();

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      if (template.carriers.status !== 'Started') {
        return;
      }

      expect(response.value).toEqual({
        id: '00000000-0000-0000-0000-000000000000',
        reference: 'test',
        wasteDescription: template.wasteDescription,
        wasteQuantity: {
          status: 'NotStarted',
        },
        exporterDetail: template.exporterDetail,
        importerDetail: template.importerDetail,
        collectionDetail: template.collectionDetail,
        carriers: {
          status: 'Started',
          transport: true,
          values: [
            {
              id: '00000000-0000-0000-0000-000000000000',
              addressDetails: template.carriers.values[0].addressDetails,
              contactDetails: template.carriers.values[0].contactDetails,
            },
          ],
        },
        ukExitLocation: template.ukExitLocation,
        transitCountries: template.transitCountries,
        recoveryFacilityDetail: template.recoveryFacilityDetail,
        collectionDate: {
          status: 'NotStarted',
        },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
        submissionDeclaration: {
          status: 'CannotStart',
        },
        submissionConfirmation: {
          status: 'CannotStart',
        },
      });
    });

    it('fails to create a draft with invalid reference', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.createDraftFromTemplate({
        id,
        accountId,
        reference: faker.string.sample(validation.ReferenceChar.max + 1),
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
    });
  });

  describe('createTemplateFromSubmission', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const submission = {
      id: id,
      reference: faker.string.sample(),
      wasteDescription: {
        wasteCode: {
          type: 'BaselAnnexIX',
          code: faker.string.sample(),
        },
        ewcCodes: [
          {
            code: faker.string.sample(),
          },
          {
            code: faker.string.sample(),
          },
        ],
        description: faker.string.sample(),
      },
      wasteQuantity: {
        type: 'ActualData',
        actualData: {
          quantityType: 'Weight',
          value: faker.number.float(),
          unit: 'Tonne',
        },
        estimateData: {},
      },
      exporterDetail: {
        exporterAddress: {
          country: faker.string.sample(),
          postcode: faker.string.sample(),
          townCity: faker.string.sample(),
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
        },
        exporterContactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.string.sample(),
          country: faker.string.sample(),
          organisationName: faker.string.sample(),
        },
        importerContactDetails: {
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      collectionDate: {
        type: 'EstimateDate',
        actualDate: {},
        estimateDate: {
          year: '01',
          month: '01',
          day: '2025',
        },
      },
      carriers: [
        {
          transportDetails: {
            type: 'Air',
            description: 'RyanAir',
          },
          addressDetails: {
            address: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
        },
      ],
      collectionDetail: {
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          postcode: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          fullName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: {
        provided: 'Yes',
        value: faker.string.sample(),
      },
      transitCountries: ['Albania (AL)'],
      recoveryFacilityDetail: [
        {
          addressDetails: {
            address: faker.string.sample(),
            country: faker.string.sample(),
            name: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
          recoveryFacilityType: {
            type: 'Laboratory',
            disposalCode: 'D1',
          },
        },
      ],
      submissionDeclaration: {
        declarationTimestamp: new Date(),
        transactionId: faker.string.sample(),
      },
      submissionState: {
        status: 'SubmittedWithEstimates',
        timestamp: new Date(),
      },
    } as Submission;

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.createTemplateFromSubmission({
        id,
        accountId,
        templateDetails: { name: 'test', description: 'test' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalled();
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully creates a template from a submission', async () => {
      mockRepository.getRecord.mockResolvedValue(submission);
      jest.useFakeTimers().setSystemTime(new Date());
      const response = await subject.createTemplateFromSubmission({
        id,
        accountId,
        templateDetails: { name: 'test', description: 'test' },
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalled();
      expect(mockRepository.saveRecord).toBeCalled();

      expect(response.value).toEqual({
        id: '00000000-0000-0000-0000-000000000000',
        templateDetails: {
          name: 'test',
          description: 'test',
          created: new Date(),
          lastModified: new Date(),
        },
        wasteDescription: {
          status: 'Complete',
          wasteCode: submission.wasteDescription.wasteCode,
          ewcCodes: submission.wasteDescription.ewcCodes,
          description: submission.wasteDescription.description,
        },
        exporterDetail: {
          status: 'Complete',
          exporterAddress: submission.exporterDetail.exporterAddress,
          exporterContactDetails:
            submission.exporterDetail.exporterContactDetails,
        },
        importerDetail: {
          status: 'Complete',
          importerAddressDetails:
            submission.importerDetail.importerAddressDetails,
          importerContactDetails:
            submission.importerDetail.importerContactDetails,
        },
        carriers: {
          status: 'Started',
          transport: true,
          values: [
            {
              addressDetails: submission.carriers[0].addressDetails,
              contactDetails: submission.carriers[0].contactDetails,
              id: '00000000-0000-0000-0000-000000000000',
            },
          ],
        },
        collectionDetail: {
          status: 'Complete',
          address: submission.collectionDetail.address,
          contactDetails: submission.collectionDetail.contactDetails,
        },
        ukExitLocation: {
          status: 'Complete',
          exitLocation: submission.ukExitLocation,
        },
        transitCountries: {
          status: 'Complete',
          values: submission.transitCountries,
        },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: [
            {
              recoveryFacilityType:
                submission.recoveryFacilityDetail[0].recoveryFacilityType,
              addressDetails:
                submission.recoveryFacilityDetail[0].addressDetails,
              contactDetails:
                submission.recoveryFacilityDetail[0].contactDetails,
              id: '00000000-0000-0000-0000-000000000000',
            },
          ],
        },
      });
    });

    it('returns an error is the template name and description is invalid', async () => {
      mockRepository.getRecord.mockResolvedValue(submission);

      let response = await subject.createTemplateFromSubmission({
        id,
        accountId,
        templateDetails: { name: '', description: 'test' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);

      response = await subject.createTemplateFromSubmission({
        id,
        accountId,
        templateDetails: {
          name: faker.string.sample(validation.TemplateNameChar.max + 1),
          description: 'test',
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);

      response = await subject.createTemplateFromSubmission({
        id,
        accountId,
        templateDetails: {
          name: 'test',
          description: faker.string.sample(
            validation.TemplateDescriptionChar.max + 1,
          ),
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
    });
  });

  describe('getRecords', () => {
    it('forwards thrown Boom errors', async () => {
      const accountId = faker.string.uuid();
      const order = 'ASC';
      mockRepository.getRecords.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplates({
        accountId,
        order,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecords).toBeCalledWith(
        templateContainerName,
        accountId,
        order,
        undefined,
        undefined,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns values from repository', async () => {
      const accountId = faker.string.uuid();
      const order = 'ASC';
      mockRepository.getRecords.mockResolvedValue({
        totalRecords: 0,
        totalPages: 0,
        currentPage: 0,
        pages: [],
        values: [],
      });

      const response = await subject.getTemplates({
        accountId,
        order,
        pageLimit: 1,
        token: '',
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecords).toHaveBeenCalledWith(
        templateContainerName,
        accountId,
        order,
        1,
        '',
      );
      expect(response.value).toEqual({
        currentPage: 0,
        pages: [],
        totalPages: 0,
        totalRecords: 0,
        values: [],
      });
    });

    it('successfully returns number of templates from repository', async () => {
      const accountId = faker.string.uuid();
      mockRepository.getTotalNumber.mockResolvedValue(2);

      const response = await subject.getNumberOfTemplates({ accountId });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getTotalNumber).toHaveBeenCalledWith(
        templateContainerName,
        accountId,
      );
      expect(response.value).toEqual(2);
    });
  });

  describe('createTemplate', () => {
    it('forwards thrown Boom errors', async () => {
      mockRepository.saveRecord.mockRejectedValue(Boom.teapot());
      const response = await subject.createTemplate({
        accountId: faker.string.uuid(),
        templateDetails: { name: 'a', description: '' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully creates a template', async () => {
      const accountId = faker.string.uuid();
      const templateDetails = { name: 'template', description: 'description' };
      mockRepository.saveRecord.mockResolvedValue(undefined);

      const response = await subject.createTemplate({
        accountId,
        templateDetails,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.value.id).toBeDefined();
      expect(response.value.templateDetails.name).toEqual(templateDetails.name);
      expect(response.value.templateDetails.description).toEqual(
        templateDetails.description,
      );
    });

    it('fails to create a template with invalid name', async () => {
      const accountId = faker.string.uuid();
      const templateDetails = { name: '', description: 'description' };

      let response = await subject.createTemplate({
        accountId,
        templateDetails,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);

      templateDetails.name = faker.string.sample(
        validation.TemplateNameChar.max + 1,
      );

      response = await subject.createTemplate({
        accountId,
        templateDetails,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
    });

    it('fails to create a template with invalid name', async () => {
      const accountId = faker.string.uuid();
      const templateDetails = {
        name: 'abc',
        description: faker.string.sample(
          validation.TemplateDescriptionChar.max + 1,
        ),
      };

      const response = await subject.createTemplate({
        accountId,
        templateDetails,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
    });
  });

  describe('updateTemplate', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.updateTemplate({
        id,
        accountId,
        templateDetails: { name: 'test', description: 'test' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalled();
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully updates a template', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const templateDetails = { name: 'template', description: 'description' };
      const template: Template = {
        id,
        templateDetails: {
          name: 'old name',
          description: 'old description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      const lastModifiedDate = template.templateDetails.lastModified;

      mockRepository.getRecord.mockResolvedValue(template);
      mockRepository.saveRecord.mockResolvedValue(undefined);

      const response = await subject.updateTemplate({
        id,
        accountId,
        templateDetails,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalled();
      expect(mockRepository.saveRecord).toBeCalled();
      expect(response.value.templateDetails.name).toEqual(templateDetails.name);
      expect(response.value.templateDetails.description).toEqual(
        templateDetails.description,
      );
      expect(template.templateDetails.lastModified.getTime()).toBeGreaterThan(
        lastModifiedDate.getTime(),
      );
    });

    it('fails to update a template with invalid name or description', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const templateDetails = {
        name: faker.string.sample(validation.TemplateNameChar.max + 1),
        description: 'description',
      };

      let response = await subject.updateTemplate({
        id,
        accountId,
        templateDetails,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);

      templateDetails.name = 'abc';
      templateDetails.description = faker.string.sample(
        validation.TemplateDescriptionChar.max + 1,
      );

      response = await subject.updateTemplate({
        id,
        accountId,
        templateDetails,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
    });
  });

  describe('getRecord', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplate({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns value from the repository', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: Template = {
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      mockRepository.getRecord.mockResolvedValue(value);

      const response = await subject.getTemplate({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(value);
    });

    it('successfully deletes template from the repository', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();

      const value: Template = {
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      mockRepository.getRecord.mockResolvedValue(value);

      const response = await subject.getTemplate({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(value);

      const deleteResponse = await subject.deleteTemplate({
        id: response.value.id,
        accountId,
      });
      expect(deleteResponse.success).toBe(true);
      if (!deleteResponse.success) {
        return;
      }
    });
  });

  describe('setTemplateWasteDescription', () => {
    it('enables recovery facility where some waste code is provided', async () => {
      const id = faker.string.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      });

      const accountId = faker.string.uuid();
      await subject.setTemplateWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'AnnexIIIA', code: 'B1010 and B1050' },
        },
      });

      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .wasteDescription as DraftWasteDescription
        ).status,
      ).toBe('Started');
    });

    it('Resets carriers and recovery facility details if input switches to small-waste', async () => {
      const id = faker.string.uuid();
      const carrierId = faker.string.uuid();
      const rfdId = faker.string.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'B1010 and B1050',
          },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Road',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId,
            },
          ],
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: [
            {
              recoveryFacilityType: {
                type: 'RecoveryFacility',
                recoveryCode: 'R1',
              },
              addressDetails: {
                address: '',
                country: '',
                name: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: rfdId,
            },
          ],
        },
      });

      const accountId = faker.string.uuid();
      await subject.setTemplateWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: { type: 'NotApplicable' },
        },
      });

      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .wasteDescription as DraftWasteDescription
        ).status,
      ).toBe('Started');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .carriers as DraftCarriers
        ).status,
      ).toBe('NotStarted');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .recoveryFacilityDetail as DraftRecoveryFacilityDetails
        ).status,
      ).toBe('NotStarted');
    });

    it('Resets carriers and recovery facility details if input switches to bulk-waste', async () => {
      const id = faker.string.uuid();
      const carrierId = faker.string.uuid();
      const rfdId = faker.string.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: {
          status: 'Complete',
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Road',
                description: 'hitch-hiking',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId,
            },
          ],
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: [
            {
              recoveryFacilityType: {
                type: 'Laboratory',
                disposalCode: 'D1',
              },
              addressDetails: {
                address: '',
                country: '',
                name: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: rfdId,
            },
          ],
        },
      });

      const accountId = faker.string.uuid();
      await subject.setTemplateWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'B1010 and B1050',
          },
        },
      });

      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .wasteDescription as DraftWasteDescription
        ).status,
      ).toBe('Started');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .carriers as DraftCarriers
        ).status,
      ).toBe('NotStarted');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .recoveryFacilityDetail as DraftRecoveryFacilityDetails
        ).status,
      ).toBe('NotStarted');
    });

    it('Resets carriers and recovery facility details if input switches type of bulk-waste', async () => {
      const id = faker.string.uuid();
      const carrierId = faker.string.uuid();
      const rfdId = faker.string.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'B1010 and B1050',
          },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Air',
                description: 'flying',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId,
            },
          ],
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: [
            {
              recoveryFacilityType: {
                type: 'RecoveryFacility',
                recoveryCode: 'R1',
              },
              addressDetails: {
                address: '',
                country: '',
                name: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: rfdId,
            },
          ],
        },
      });

      const accountId = faker.string.uuid();
      await subject.setTemplateWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIB',
            code: 'BEU04',
          },
        },
      });

      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .wasteDescription as DraftWasteDescription
        ).status,
      ).toBe('Started');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .carriers as DraftCarriers
        ).status,
      ).toBe('NotStarted');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .recoveryFacilityDetail as DraftRecoveryFacilityDetails
        ).status,
      ).toBe('NotStarted');
    });

    it('Resets status of carriers and recovery facility if input switches bulk-waste code with the same bulk-waste type', async () => {
      const id = faker.string.uuid();
      const carrierId1 = faker.string.uuid();
      const carrierId2 = faker.string.uuid();
      const carrierId3 = faker.string.uuid();
      const rfdId = faker.string.uuid();
      const timestamp = new Date();
      mockRepository.getRecord.mockResolvedValue({
        id,
        templateDetails: {
          name: 'My Template name',
          description: 'My Template description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'B1010 and B1050',
          },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Sea',
                description: 'swimming',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId1,
            },
            {
              transportDetails: {
                type: 'Road',
                description: 'On the one road...',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId2,
            },
            {
              transportDetails: {
                type: 'Road',
                description: 'On the one road...',
              },
              addressDetails: {
                address: '',
                country: '',
                organisationName: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: carrierId3,
            },
          ],
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: [
            {
              recoveryFacilityType: {
                type: 'RecoveryFacility',
                recoveryCode: 'R1',
              },
              addressDetails: {
                address: '',
                country: '',
                name: '',
              },
              contactDetails: {
                emailAddress: '',
                faxNumber: '',
                fullName: '',
                phoneNumber: '',
              },
              id: rfdId,
            },
          ],
        },
      });

      const accountId = faker.string.uuid();
      await subject.setTemplateWasteDescription({
        id,
        accountId,
        value: {
          status: 'Started',
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'B1010 and B1070',
          },
        },
      });

      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .wasteDescription as DraftWasteDescription as DraftWasteDescription
        ).status,
      ).toBe('Started');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .carriers as DraftCarriers
        ).status,
      ).toBe('Started');
      expect(
        (
          (await mockRepository.getRecord(templateContainerName, id, accountId))
            .recoveryFacilityDetail as DraftRecoveryFacilityDetails
        ).status,
      ).toBe('Started');
    });
  });

  describe('getWasteTemplateDescription', () => {
    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplateWasteDescription({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns the waste description', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      const value: Template = {
        id,
        templateDetails: {
          name: 'name',
          description: 'description',
          created: timestamp,
          lastModified: timestamp,
        },
        wasteDescription: {
          status: 'NotStarted',
        },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      mockRepository.getRecord.mockResolvedValue(value);

      const response = await subject.getTemplateWasteDescription({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toBeCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(value.wasteDescription);
    });
  });

  describe('getTemplateExporterDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplateExporterDetail({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns the exporter details', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.getTemplateExporterDetail({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(template.exporterDetail);
    });
  });

  describe('setTemplateExporterDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setTemplateExporterDetail({
        id,
        accountId,
        value: { status: 'NotStarted' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully sets the exporter detail', async () => {
      const lastModifiedDate = template.templateDetails.lastModified;

      const exporterDetail = { status: 'Started' } as DraftExporterDetail;

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.setTemplateExporterDetail({
        id,
        accountId,
        value: exporterDetail,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(template.templateDetails.lastModified.getTime()).toBeGreaterThan(
        lastModifiedDate.getTime(),
      );
      expect(template.exporterDetail).toEqual(exporterDetail);
    });
  });

  describe('getTemplateImporterDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplateImporterDetail({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns the importer details', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.getTemplateImporterDetail({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(template.importerDetail);
    });
  });

  describe('setTemplateImporterDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setTemplateImporterDetail({
        id,
        accountId,
        value: { status: 'NotStarted' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully sets the importer detail', async () => {
      const lastModifiedDate = template.templateDetails.lastModified;
      const importerDetail = { status: 'Started' } as DraftImporterDetail;

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.setTemplateImporterDetail({
        id,
        accountId,
        value: importerDetail,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(template.templateDetails.lastModified.getTime()).toBeGreaterThan(
        lastModifiedDate.getTime(),
      );
      expect(template.importerDetail).toEqual(importerDetail);
    });
  });

  describe('listTemplateCarriers', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.listTemplateCarriers({ id, accountId });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully lists the carriers', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.listTemplateCarriers({ id, accountId });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(template.carriers);
    });
  });

  describe('getTemplateCarriers', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const carrierId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'name',
        description: 'description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Road',
            },
            addressDetails: {
              address: faker.string.sample(),
              country: 'Albania [AB]',
              organisationName: faker.string.sample(),
            },
            contactDetails: {
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
            },
            id: carrierId,
          },
        ],
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplateCarriers({
        id,
        accountId,
        carrierId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns the carriers', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.getTemplateCarriers({
        id,
        accountId,
        carrierId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(template.carriers);
    });

    it('returns an error if the carrier is not found', async () => {
      const response = await subject.getTemplateCarriers({
        id,
        accountId,
        carrierId: faker.string.uuid(),
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });
  });

  describe('createTemplateCarriers', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'name',
        description: 'description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.createTemplateCarriers({
        id,
        accountId,
        value: {
          status: 'Started',
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully creates carrier details', async () => {
      const lastModifiedDate = template.templateDetails.lastModified;

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.createTemplateCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(template.templateDetails.lastModified.getTime()).toBeGreaterThan(
        lastModifiedDate.getTime(),
      );
      expect(template.carriers).toEqual({
        status: 'Started',
        transport: true,
        values: [{ id: '00000000-0000-0000-0000-000000000000' }],
      });
    });

    it('returns an error if the maximum number of carriers has been reached', async () => {
      template.carriers = { status: 'Started', transport: true, values: [] };

      for (let i = 0; i < validation.CarrierLength.max; i++) {
        if (template.carriers.status !== 'Started') {
          return;
        }
        template.carriers.values.push({
          transportDetails: {
            type: 'Road',
          },
          addressDetails: {
            address: faker.string.sample(),
            country: 'Albania [AB]',
            organisationName: faker.string.sample(),
          },
          contactDetails: {
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
          },
          id: faker.string.uuid(),
        });
      }

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.createTemplateCarriers({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }
      expect(response.error.statusCode).toBe(400);
    });
  });

  describe('setTemplateCarriers', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const carrierId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'name',
        description: 'description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'Started',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Road',
            },
            addressDetails: {
              address: faker.string.sample(),
              country: 'Albania [AB]',
              organisationName: faker.string.sample(),
            },
            contactDetails: {
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
            },
            id: carrierId,
          },
        ],
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setTemplateCarriers({
        id,
        accountId,
        carrierId,
        value: {
          status: 'Started',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Road',
              },
              addressDetails: {
                address: faker.string.sample(),
                country: 'Albania [AB]',
                organisationName: faker.string.sample(),
              },
              contactDetails: {
                emailAddress: faker.string.sample(),
                faxNumber: faker.string.sample(),
                fullName: faker.string.sample(),
                phoneNumber: faker.string.sample(),
              },
              id: carrierId,
            },
          ],
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully sets the carrier details', async () => {
      const lastModifiedDate = template.templateDetails.lastModified;
      const carrierDetails = {
        status: 'Started',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Road',
            },
            addressDetails: {
              address: faker.string.sample(),
              country: 'Albania [AB]',
              organisationName: faker.string.sample(),
            },
            contactDetails: {
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
            },
            id: carrierId,
          },
        ],
      } as DraftCarriers;

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.setTemplateCarriers({
        id,
        accountId,
        carrierId,
        value: carrierDetails,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(template.templateDetails.lastModified.getTime()).toBeGreaterThan(
        lastModifiedDate.getTime(),
      );
      expect(template.carriers).toEqual(carrierDetails);
    });

    it('returns an error if the template carriers have not been started', async () => {
      template.carriers.status = 'NotStarted';
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.setTemplateCarriers({
        id,
        accountId,
        carrierId,
        value: {
          status: 'Started',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Road',
              },
              addressDetails: {
                address: faker.string.sample(),
                country: 'Albania [AB]',
                organisationName: faker.string.sample(),
              },
              contactDetails: {
                emailAddress: faker.string.sample(),
                faxNumber: faker.string.sample(),
                fullName: faker.string.sample(),
                phoneNumber: faker.string.sample(),
              },
              id: carrierId,
            },
          ],
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });

    it('returns an error if the carrier id does not exist', async () => {
      const response = await subject.setTemplateCarriers({
        id,
        accountId,
        carrierId: faker.string.uuid(),
        value: {
          status: 'Started',
          transport: true,
          values: [
            {
              transportDetails: {
                type: 'Road',
              },
              contactDetails: {
                emailAddress: faker.string.sample(),
                faxNumber: faker.string.sample(),
                fullName: faker.string.sample(),
                phoneNumber: faker.string.sample(),
              },
              id: faker.string.uuid(),
            },
          ],
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });
  });

  describe('deleteTemplateCarriers', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const carrierId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'name',
        description: 'description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'Started',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Road',
            },
            addressDetails: {
              address: faker.string.sample(),
              country: 'Albania [AB]',
              organisationName: faker.string.sample(),
            },
            contactDetails: {
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
            },
            id: carrierId,
          },
        ],
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.deleteTemplateCarriers({
        id,
        accountId,
        carrierId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully deletes the carrier details', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.deleteTemplateCarriers({
        id,
        accountId,
        carrierId,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }
      if (template.carriers.status !== 'Started') {
        return;
      }
      expect(
        template.carriers.values.map((carrier) => carrier.id),
      ).not.toContain(carrierId);
    });

    it('returns an error if the carrier status is `NotStarted`', async () => {
      template.carriers.status = 'NotStarted';
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.deleteTemplateCarriers({
        id,
        accountId,
        carrierId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });

    it('returns an error is the carrierId is not found', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.deleteTemplateCarriers({
        id,
        accountId,
        carrierId: faker.string.uuid(),
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });
  });

  describe('getTemplateCollectionDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: {
        status: 'Started',
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          faxNumber: faker.string.sample(),
          fullName: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplateCollectionDetail({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns the collection details', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.getTemplateCollectionDetail({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(template.collectionDetail);
    });
  });

  describe('setTemplateCollectionDetail', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: {
        status: 'Started',
        address: {
          addressLine1: faker.string.sample(),
          addressLine2: faker.string.sample(),
          townCity: faker.string.sample(),
          country: faker.string.sample(),
        },
        contactDetails: {
          organisationName: faker.string.sample(),
          emailAddress: faker.string.sample(),
          faxNumber: faker.string.sample(),
          fullName: faker.string.sample(),
          phoneNumber: faker.string.sample(),
        },
      },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setTemplateCollectionDetail({
        id,
        accountId,
        value: { status: 'NotStarted' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(418);
    });

    it('successfully sets the collection details', async () => {
      const lastModifiedDate = template.templateDetails.lastModified;
      const collectionDetail = { status: 'Started' } as DraftCollectionDetail;

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.setTemplateCollectionDetail({
        id,
        accountId,
        value: collectionDetail,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(template.templateDetails.lastModified.getTime()).toBeGreaterThan(
        lastModifiedDate.getTime(),
      );
      expect(template.collectionDetail).toEqual(collectionDetail);
    });
  });

  describe('getTemplateUkExitLocation', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.string.sample(),
        },
      },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplateUkExitLocation({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns the UK exit location', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.getTemplateUkExitLocation({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(template.ukExitLocation);
    });
  });

  describe('setTemplateUkExitLocation', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.string.sample(),
        },
      },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setTemplateUkExitLocation({
        id,
        accountId,
        value: { status: 'NotStarted' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(418);
    });

    it('successfully sets the UK exit location', async () => {
      const lastModifiedDate = template.templateDetails.lastModified;
      const ukExitLocation = { status: 'NotStarted' } as DraftUkExitLocation;

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.setTemplateUkExitLocation({
        id,
        accountId,
        value: ukExitLocation,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(template.templateDetails.lastModified.getTime()).toBeGreaterThan(
        lastModifiedDate.getTime(),
      );
      expect(template.ukExitLocation).toEqual(ukExitLocation);
    });

    it('fails to set the UK exit location if the provided location is not valid', async () => {
      const ukExitLocation = {
        status: 'Complete',
        exitLocation: { provided: 'Yes', value: 'London?>/2#?>2.' },
      } as DraftUkExitLocation;

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.setTemplateUkExitLocation({
        id,
        accountId,
        value: ukExitLocation,
      });
      expect(response.success).toBe(false);
    });
  });

  describe('getTemplateTransitCountries', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: {
        status: 'Complete',
        values: ['Albania [AB]', 'France [FR]'],
      },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplateTransitCountries({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns the transit countries', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.getTemplateTransitCountries({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.value).toEqual(template.transitCountries);
    });
  });

  describe('setTemplateTransitCountries', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: {
        status: 'NotStarted',
      },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    const transitCountries = {
      status: 'Complete',
      values: ['Albania [AB]', 'France [FR]'],
    } as DraftTransitCountries;

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setTemplateTransitCountries({
        id,
        accountId,
        value: transitCountries,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(418);
    });

    it('successfully sets the transit countries', async () => {
      const lastModifiedDate = template.templateDetails.lastModified;
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.setTemplateTransitCountries({
        id,
        accountId,
        value: transitCountries,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(template.templateDetails.lastModified.getTime()).toBeGreaterThan(
        lastModifiedDate.getTime(),
      );
      expect(template.transitCountries).toEqual(transitCountries);
    });

    it('fails to set the transit countries if the given data is invalid', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.setTemplateTransitCountries({
        id,
        accountId,
        value: {
          status: 'Complete',
          values: ['London'],
        },
      });
      expect(response.success).toBe(false);
    });
  });

  describe('listTemplateRecoveryFacilityDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const recoveryFacilityId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: {
        status: 'Complete',
        values: [
          {
            id: recoveryFacilityId,
            addressDetails: {
              name: faker.string.sample(),
              address: faker.string.sample(),
              country: faker.string.sample(),
            },
            contactDetails: {
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D15',
            },
          },
        ],
      },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.listTemplateRecoveryFacilityDetails({
        id,
        accountId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(mockRepository.getRecord).toHaveBeenCalledWith(
        templateContainerName,
        id,
        accountId,
      );
      expect(response.error.statusCode).toBe(418);
    });

    it('successfully lists the recovery facility details', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.listTemplateRecoveryFacilityDetails({
        id,
        accountId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(response.success).toBe(true);
      expect(response.value).toEqual(template.recoveryFacilityDetail);
    });
  });

  describe('getTemplateRecoveryFacilityDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const rfdId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'template name',
        description: 'template description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: {
        status: 'Complete',
        values: [
          {
            id: rfdId,
            addressDetails: {
              name: faker.string.sample(),
              address: faker.string.sample(),
              country: faker.string.sample(),
            },
            contactDetails: {
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D15',
            },
          },
        ],
      },
    };

    it('forwards thrown Boom errors', async () => {
      const id = faker.string.uuid();
      const accountId = faker.string.uuid();
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.getTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(418);
    });

    it('successfully returns the recovery facility details', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.getTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
      });
      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }
      if (template.recoveryFacilityDetail.status !== 'Complete') {
        return;
      }
      if (response.value.status !== 'Complete') {
        return;
      }
      expect(response.value.values[0]).toEqual(
        template.recoveryFacilityDetail.values[0],
      );
    });

    it('returns an error if the recovery facility details are not found', async () => {
      const response = await subject.getTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId: faker.string.uuid(),
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });

    it('returns an error if the recovery facility section has not been started', async () => {
      template.recoveryFacilityDetail.status = 'NotStarted';
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.getTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });
  });

  describe('createTemplateRecoveryFacilityDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'name',
        description: 'description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: {
        status: 'NotStarted',
      },
    };

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.createTemplateRecoveryFacilityDetails({
        id,
        accountId,
        value: {
          status: 'Started',
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(418);
    });

    it('returns an error is the status provided is not `Started`', async () => {
      const response = await subject.createTemplateRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'NotStarted' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
    });

    it('successfully creates recovery facility details', async () => {
      const lastModifiedDate = template.templateDetails.lastModified;

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.createTemplateRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(template.templateDetails.lastModified.getTime()).toBeGreaterThan(
        lastModifiedDate.getTime(),
      );
      expect(template.recoveryFacilityDetail.status).toEqual('Started');
    });

    it('returns an error if the maximum number of recovery facilities has been reached', async () => {
      template.recoveryFacilityDetail = { status: 'Started', values: [] };

      for (
        let i = 0;
        i <
        validation.RecoveryFacilityLength.max +
          validation.InterimSiteLength.max;
        i++
      ) {
        if (template.recoveryFacilityDetail.status !== 'Started') {
          return;
        }
        template.recoveryFacilityDetail.values.push({
          id: faker.string.uuid(),
          addressDetails: {
            name: faker.string.sample(),
            address: faker.string.sample(),
            country: faker.string.sample(),
          },
          contactDetails: {
            fullName: faker.string.sample(),
            phoneNumber: faker.string.sample(),
            emailAddress: faker.string.sample(),
            faxNumber: faker.string.sample(),
          },
          recoveryFacilityType: {
            type: 'Laboratory',
            disposalCode: 'D15',
          },
        });
      }

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.createTemplateRecoveryFacilityDetails({
        id,
        accountId,
        value: { status: 'Started' },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(400);
    });
  });

  describe('setTemplateRecoveryFacilityDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const rfdId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'name',
        description: 'description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: {
        status: 'Started',
        values: [
          {
            id: rfdId,
            addressDetails: {
              name: faker.string.sample(),
              address: faker.string.sample(),
              country: faker.string.sample(),
            },
            contactDetails: {
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D15',
            },
          },
        ],
      },
    };

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.setTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value: {
          status: 'Started',
          values: [
            {
              id: rfdId,
              addressDetails: {
                name: faker.string.sample(),
                address: faker.string.sample(),
                country: faker.string.sample(),
              },
              contactDetails: {
                fullName: faker.string.sample(),
                phoneNumber: faker.string.sample(),
                emailAddress: faker.string.sample(),
                faxNumber: faker.string.sample(),
              },
              recoveryFacilityType: {
                type: 'Laboratory',
                disposalCode: 'D15',
              },
            },
          ],
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(418);
    });

    it('successfully sets the recovery facility details', async () => {
      const lastModifiedDate = template.templateDetails.lastModified;
      const recoveryFacilityDetails = {
        status: 'Started',
        values: [
          {
            id: rfdId,
            addressDetails: {
              name: faker.string.sample(),
              address: faker.string.sample(),
              country: faker.string.sample(),
            },
            contactDetails: {
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D15',
            },
          },
        ],
      } as DraftRecoveryFacilityDetails;

      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.setTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value: recoveryFacilityDetails,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }

      expect(template.templateDetails.lastModified.getTime()).toBeGreaterThan(
        lastModifiedDate.getTime(),
      );
      if (template.recoveryFacilityDetail.status !== 'Started') {
        return;
      }
      if (recoveryFacilityDetails.status !== 'Started') {
        return;
      }
      expect(template.recoveryFacilityDetail.values[0]).toEqual(
        recoveryFacilityDetails.values[0],
      );
    });

    it('returns an error if the recovery facility status is `NotStarted`', async () => {
      template.recoveryFacilityDetail.status = 'NotStarted';
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.setTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value: {
          status: 'Started',
          values: [
            {
              id: rfdId,
              addressDetails: {
                name: faker.string.sample(),
                address: faker.string.sample(),
                country: faker.string.sample(),
              },
              contactDetails: {
                fullName: faker.string.sample(),
                phoneNumber: faker.string.sample(),
                emailAddress: faker.string.sample(),
                faxNumber: faker.string.sample(),
              },
              recoveryFacilityType: {
                type: 'Laboratory',
                disposalCode: 'D15',
              },
            },
          ],
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });

    it('returns an error if the recovery facility id does not exist', async () => {
      const response = await subject.setTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId: faker.string.uuid(),
        value: {
          status: 'Started',
          values: [
            {
              id: faker.string.uuid(),
              addressDetails: {
                name: faker.string.sample(),
                address: faker.string.sample(),
                country: faker.string.sample(),
              },
              contactDetails: {
                fullName: faker.string.sample(),
                phoneNumber: faker.string.sample(),
                emailAddress: faker.string.sample(),
                faxNumber: faker.string.sample(),
              },
              recoveryFacilityType: {
                type: 'Laboratory',
                disposalCode: 'D15',
              },
            },
          ],
        },
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });
  });

  describe('deleteTemplateRecoveryFacilityDetails', () => {
    const id = faker.string.uuid();
    const accountId = faker.string.uuid();
    const rfdId = faker.string.uuid();
    const template: Template = {
      id,
      templateDetails: {
        name: 'name',
        description: 'description',
        created: timestamp,
        lastModified: timestamp,
      },
      wasteDescription: { status: 'NotStarted' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      carriers: {
        status: 'NotStarted',
        transport: true,
      },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: {
        status: 'Started',
        values: [
          {
            id: rfdId,
            addressDetails: {
              name: faker.string.sample(),
              address: faker.string.sample(),
              country: faker.string.sample(),
            },
            contactDetails: {
              fullName: faker.string.sample(),
              phoneNumber: faker.string.sample(),
              emailAddress: faker.string.sample(),
              faxNumber: faker.string.sample(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D15',
            },
          },
        ],
      },
    };

    it('forwards thrown Boom errors', async () => {
      mockRepository.getRecord.mockRejectedValue(Boom.teapot());

      const response = await subject.deleteTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(418);
    });

    it('successfully deletes the recovery facility details', async () => {
      const lastModifiedDate = template.templateDetails.lastModified;
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.deleteTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
      });

      expect(response.success).toBe(true);
      if (!response.success) {
        return;
      }
      if (template.recoveryFacilityDetail.status !== 'Started') {
        return;
      }
      expect(
        template.recoveryFacilityDetail.values.map((rfd) => rfd.id),
      ).not.toContain(rfdId);
      expect(template.templateDetails.lastModified.getTime()).toBeGreaterThan(
        lastModifiedDate.getTime(),
      );
    });

    it('returns an error if the recovery facility status is `NotStarted`', async () => {
      template.recoveryFacilityDetail.status = 'NotStarted';
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.deleteTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });

    it('returns an error is the recovery facilityId is not found', async () => {
      mockRepository.getRecord.mockResolvedValue(template);

      const response = await subject.deleteTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId: faker.string.uuid(),
      });

      expect(response.success).toBe(false);
      if (response.success) {
        return;
      }

      expect(response.error.statusCode).toBe(404);
    });
  });
});
