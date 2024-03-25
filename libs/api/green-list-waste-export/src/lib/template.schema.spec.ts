import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  DeleteTemplateRequest,
  GetTemplateByIdResponse,
  GetTemplatesResponse,
} from './template.dto';
import {
  getTemplateByIdResponse,
  deleteTemplateRequest,
  getTemplatesResponse,
} from './template.schema';

const ajv = new Ajv();

describe('deleteTemplateRequest', () => {
  const validate = ajv.compile<DeleteTemplateRequest>(deleteTemplateRequest);

  it('is compatible with dto values', () => {
    const value: DeleteTemplateRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('GetTemplatesResponse', () => {
  const validate = ajv.compile<GetTemplatesResponse>(getTemplatesResponse);

  it('is compatible with success value', () => {
    const value: GetTemplatesResponse = {
      success: true,
      value: {
        totalTemplates: 1,
        totalPages: 1,
        currentPage: 1,
        pages: [
          {
            pageNumber: 1,
            token: '',
          },
        ],
        values: [
          {
            id: faker.datatype.uuid(),
            templateDetails: {
              name: 'My Template',
              description: 'My Template descripton',
              created: new Date(),
              lastModified: new Date(),
            },
            wasteDescription: { status: 'NotStarted' },
            exporterDetail: { status: 'NotStarted' },
            importerDetail: { status: 'NotStarted' },
            carriers: { status: 'NotStarted' },
            collectionDetail: { status: 'NotStarted' },
            ukExitLocation: { status: 'NotStarted' },
            transitCountries: { status: 'NotStarted' },
            recoveryFacilityDetail: { status: 'CannotStart' },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with error value', () => {
    validate({
      success: false,
      error: {
        statusCode: 400,
        name: 'BadRequest',
        message: 'Bad request',
      },
    });
  });
});

describe('getTemplateByIdResponse', () => {
  const validate = ajv.compile<GetTemplateByIdResponse>(
    getTemplateByIdResponse
  );

  it('is compatible with dto value', () => {
    const value: GetTemplateByIdResponse = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        templateDetails: {
          name: 'My Template',
          description: 'My Template descripton',
          created: new Date(),
          lastModified: new Date(),
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
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
      },
    };

    expect(validate(value)).toBe(true);
  });
});
