import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  createDraftCarriersRequest,
  createDraftRecoveryFacilityDetailsRequest,
  deleteDraftCarriersRequest,
  deleteDraftRecoveryFacilityDetailsRequest,
  deleteDraftRequest,
  getDraftResponse,
  getDraftsResponse,
  listDraftCarriersResponse,
  listDraftRecoveryFacilityDetailsResponse,
  setDraftCarriersRequest,
  setDraftCollectionDateRequest,
  setDraftCustomerReferenceResponse,
  setDraftRecoveryFacilityDetailsRequest,
  setDraftSubmissionConfirmationRequest,
  setDraftSubmissionDeclarationRequest,
  setDraftTransitCountriesRequest,
  setDraftUkExitLocationRequest,
  setDraftWasteQuantityRequest,
} from './schema';
import {
  CreateDraftCarriersRequest,
  CreateDraftRecoveryFacilityDetailsRequest,
  DeleteDraftCarriersRequest,
  DeleteDraftRecoveryFacilityDetailsRequest,
  DeleteDraftRequest,
  GetDraftResponse,
  GetDraftsResponse,
  ListDraftCarriersResponse,
  ListDraftRecoveryFacilityDetailsResponse,
  SetDraftCarriersRequest,
  SetDraftCollectionDateRequest,
  SetDraftCustomerReferenceResponse,
  SetDraftRecoveryFacilityDetailsRequest,
  SetDraftSubmissionConfirmationRequest,
  SetDraftSubmissionDeclarationRequest,
  SetDraftTransitCountriesRequest,
  SetDraftUkExitLocationRequest,
  SetDraftWasteQuantityRequest,
} from './dto';

const ajv = new Ajv();

describe('getDraftsResponse', () => {
  const validate = ajv.compile<GetDraftsResponse>(getDraftsResponse);

  it('is compatible with success value', () => {
    const value: GetDraftsResponse = {
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
            id: faker.datatype.uuid(),
            reference: faker.datatype.string(10),
            wasteDescription: { status: 'NotStarted' },
            collectionDate: { status: 'NotStarted' },
            submissionDeclaration: { status: 'CannotStart' },
            submissionState: {
              status: 'InProgress',
              timestamp: new Date(),
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

describe('getDraftResponse', () => {
  const validate = ajv.compile<GetDraftResponse>(getDraftResponse);

  it('is compatible with dto value', () => {
    const value: GetDraftResponse = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        reference: faker.datatype.string(10),
        wasteDescription: {
          status: 'Complete',
          wasteCode: {
            type: 'BaselAnnexIX',
            code: 'B1031',
          },
          ewcCodes: [
            {
              code: '010101',
            },
          ],
          nationalCode: {
            provided: 'No',
          },
          description: 'test',
        },
        wasteQuantity: {
          status: 'Complete',
          value: {
            type: 'EstimateData',
            estimateData: {
              quantityType: 'Weight',
              value: 2.33,
              unit: 'Tonne',
            },
            actualData: {},
          },
        },
        exporterDetail: {
          status: 'Complete',
          exporterAddress: {
            addressLine1: '1 Sth Str',
            townCity: 'London',
            country: 'England',
            postcode: '',
          },
          exporterContactDetails: {
            organisationName: 'test',
            fullName: 'te',
            emailAddress: 'twe@gmail.com',
            phoneNumber: '07888888888',
          },
        },
        importerDetail: {
          status: 'Complete',
          importerAddressDetails: {
            organisationName: 'geg',
            address: 'teqrrte',
            country: 'Afghanistan [AF]',
          },
          importerContactDetails: {
            fullName: 'test',
            emailAddress: 'twe@gmail.com',
            phoneNumber: '07888888888',
            faxNumber: '',
          },
        },
        collectionDate: {
          status: 'Complete',
          value: {
            type: 'ActualDate',
            actualDate: {
              day: '9',
              month: '4',
              year: '2024',
            },
            estimateDate: {},
          },
        },
        carriers: {
          status: 'Complete',
          transport: true,
          values: [
            {
              id: 'cd6fdf02-cce4-45dc-84ac-fbf0d73aca43',
              addressDetails: {
                country: 'United Kingdom (England) [GB-ENG]',
                address: 'gsgs',
                organisationName: 'grgd',
              },
              contactDetails: {
                fullName: 'hfdhfh',
                emailAddress: 'htr@test.com',
                phoneNumber: '04576387658735',
              },
              transportDetails: {
                type: 'InlandWaterways',
                description: "gewgew#'da",
              },
            },
          ],
        },
        collectionDetail: {
          status: 'Complete',
          address: {
            addressLine1: '1 Sth Str',
            townCity: 'London',
            postcode: 'W140QA',
            country: 'England',
          },
          contactDetails: {
            organisationName: 'geg',
            fullName: 'geg',
            emailAddress: 'gege@gmail.com',
            phoneNumber: '07888888888',
          },
        },
        ukExitLocation: {
          status: 'Complete',
          exitLocation: {
            provided: 'Yes',
            value: "test- .'\\",
          },
        },
        transitCountries: {
          status: 'Complete',
          values: ['Åland Islands [AX]'],
        },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: [
            {
              id: 'd3435c31-745b-4c46-8760-448a2f98462f',
              addressDetails: {
                name: 'te',
                address: 'tete',
                country: 'Åland Islands [AX]',
              },
              recoveryFacilityType: {
                type: 'RecoveryFacility',
                recoveryCode: 'R2',
              },
              contactDetails: {
                fullName: 'teq',
                emailAddress: 'gege@gmail.com',
                phoneNumber: '07888888888',
              },
            },
          ],
        },
        submissionConfirmation: {
          status: 'Complete',
          confirmation: true,
        },
        submissionDeclaration: {
          status: 'Complete',
          values: {
            declarationTimestamp: new Date(),
            transactionId: '2404_6940ECEF',
          },
        },
        submissionState: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('deleteDraftRequest', () => {
  const validate = ajv.compile<DeleteDraftRequest>(deleteDraftRequest);

  it('is compatible with dto values', () => {
    let value: DeleteDraftRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftCustomerReferenceResponse', () => {
  const validate = ajv.compile<SetDraftCustomerReferenceResponse>(
    setDraftCustomerReferenceResponse
  );

  it('is compatible with dto value', () => {
    const value: SetDraftCustomerReferenceResponse = {
      success: true,
      value: undefined,
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftWasteQuantityRequest', () => {
  const validate = ajv.compile<SetDraftWasteQuantityRequest>(
    setDraftWasteQuantityRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftWasteQuantityRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: { status: 'NotStarted' },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Started',
        value: { type: 'ActualData' },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          actualData: {
            quantityType: 'Volume',
            value: 12,
          },
          estimateData: {},
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftCollectionDateRequest', () => {
  const validate = ajv.compile<SetDraftCollectionDateRequest>(
    setDraftCollectionDateRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftCollectionDateRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: { status: 'NotStarted' },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        value: {
          type: 'ActualDate',
          actualDate: {
            year: '1970',
            month: '00',
            day: '01',
          },
          estimateDate: {},
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('listDraftCarriersResponse', () => {
  const validate = ajv.compile<ListDraftCarriersResponse>(
    listDraftCarriersResponse
  );

  it('is compatible with success value', () => {
    const value: ListDraftCarriersResponse = {
      success: true,
      value: {
        status: 'Complete',
        transport: true,
        values: [
          {
            id: faker.datatype.uuid(),
            addressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            transportDetails: {
              type: 'Air',
              description: 'RyanAir',
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

describe('createDraftCarriersRequest', () => {
  const validate = ajv.compile<CreateDraftCarriersRequest>(
    createDraftCarriersRequest
  );

  it('is compatible with dto values', () => {
    const value: CreateDraftCarriersRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Started',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftCarrierRequest', () => {
  const validate = ajv.compile<SetDraftCarriersRequest>(
    setDraftCarriersRequest
  );

  it('is compatible with dto values', () => {
    const carrierId = faker.datatype.uuid();
    let value: SetDraftCarriersRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: carrierId,
      value: {
        status: 'Started',
        transport: true,
        values: [
          {
            id: carrierId,
            addressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            transportDetails: {
              type: 'InlandWaterways',
              description: 'Barge',
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: carrierId,
      value: {
        status: 'NotStarted',
        transport: true,
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: carrierId,
      value: {
        status: 'Started',
        transport: false,
        values: [
          {
            id: carrierId,
            addressDetails: {
              organisationName: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('deleteDraftCarrierRequest', () => {
  const validate = ajv.compile<DeleteDraftCarriersRequest>(
    deleteDraftCarriersRequest
  );

  it('is compatible with dto values', () => {
    const value: DeleteDraftCarriersRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      carrierId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftExitLocationRequest', () => {
  const validate = ajv.compile<SetDraftUkExitLocationRequest>(
    setDraftUkExitLocationRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftUkExitLocationRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        exitLocation: {
          provided: 'No',
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftTransitCountriesRequest', () => {
  const validate = ajv.compile<SetDraftTransitCountriesRequest>(
    setDraftTransitCountriesRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftTransitCountriesRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'NotStarted',
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Started',
        values: ['N.Ireland', 'Wales'],
      },
    };

    expect(validate(value)).toBe(true);
    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        values: ['N.Ireland', 'Wales', 'England'],
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('listDraftRecoveryFacilityDetailsResponse', () => {
  const validate = ajv.compile<ListDraftRecoveryFacilityDetailsResponse>(
    listDraftRecoveryFacilityDetailsResponse
  );

  it('is compatible with success value', () => {
    const value: ListDraftRecoveryFacilityDetailsResponse = {
      success: true,
      value: {
        status: 'Complete',
        values: [
          {
            id: faker.datatype.uuid(),
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: faker.datatype.string(),
            },
            addressDetails: {
              name: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
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

describe('createDraftRecoveryFacilityDetailsRequest', () => {
  const validate = ajv.compile<CreateDraftRecoveryFacilityDetailsRequest>(
    createDraftRecoveryFacilityDetailsRequest
  );

  it('is compatible with dto values', () => {
    const value: CreateDraftRecoveryFacilityDetailsRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Started',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftRecoveryFacilityDetailsRequest', () => {
  const validate = ajv.compile<SetDraftRecoveryFacilityDetailsRequest>(
    setDraftRecoveryFacilityDetailsRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftRecoveryFacilityDetailsRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      rfdId: faker.datatype.uuid(),
      value: {
        status: 'Started',
        values: [
          {
            id: faker.datatype.uuid(),
            recoveryFacilityType: {
              type: 'InterimSite',
              recoveryCode: faker.datatype.string(),
            },
            addressDetails: {
              name: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      rfdId: faker.datatype.uuid(),
      value: {
        status: 'NotStarted',
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      rfdId: faker.datatype.uuid(),
      value: {
        status: 'Started',
        values: [
          {
            id: faker.datatype.uuid(),
            recoveryFacilityType: {
              type: 'RecoveryFacility',
              recoveryCode: faker.datatype.string(),
            },
            addressDetails: {
              name: faker.datatype.string(),
              address: faker.datatype.string(),
              country: faker.datatype.string(),
            },
            contactDetails: {
              fullName: faker.datatype.string(),
              emailAddress: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('deleteDraftRecoveryFacilityDetailsRequest', () => {
  const validate = ajv.compile<DeleteDraftRecoveryFacilityDetailsRequest>(
    deleteDraftRecoveryFacilityDetailsRequest
  );

  it('is compatible with dto values', () => {
    const value: DeleteDraftRecoveryFacilityDetailsRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      rfdId: faker.datatype.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftSubmissionConfirmationRequest', () => {
  const validate = ajv.compile<SetDraftSubmissionConfirmationRequest>(
    setDraftSubmissionConfirmationRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftSubmissionConfirmationRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'CannotStart',
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'NotStarted',
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
        confirmation: faker.datatype.boolean(),
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftSubmissionDeclarationRequest', () => {
  const validate = ajv.compile<SetDraftSubmissionDeclarationRequest>(
    setDraftSubmissionDeclarationRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftSubmissionDeclarationRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'CannotStart',
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'NotStarted',
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        status: 'Complete',
      },
    };

    expect(validate(value)).toBe(true);
  });
});
