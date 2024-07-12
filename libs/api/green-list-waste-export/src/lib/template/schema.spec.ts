import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  DeleteTemplateRequest,
  GetTemplateResponse,
  GetTemplatesResponse,
} from './dto';
import {
  deleteTemplateRequest,
  getTemplateResponse,
  getTemplatesResponse,
} from './schema';

const ajv = new Ajv();

describe('deleteTemplateRequest', () => {
  const validate = ajv.compile<DeleteTemplateRequest>(deleteTemplateRequest);

  it('is compatible with dto values', () => {
    const value: DeleteTemplateRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getTemplatesResponse', () => {
  const validate = ajv.compile<GetTemplatesResponse>(getTemplatesResponse);

  it('is compatible with success value', () => {
    const value: GetTemplatesResponse = {
      success: true,
      value: {
        totalRecords: 1,
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
            id: faker.string.uuid(),
            templateDetails: {
              name: 'My Template',
              description: 'My Template descripton',
              created: new Date(),
              lastModified: new Date(),
            },
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

describe('getTemplateResponse', () => {
  const validate = ajv.compile<GetTemplateResponse>(getTemplateResponse);

  it('is compatible with dto value', () => {
    const value: GetTemplateResponse = {
      success: true,
      value: {
        id: faker.string.uuid(),
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
