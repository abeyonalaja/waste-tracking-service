import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  DeleteDraftRequest,
  CancelDraftByIdRequest,
  GetDraftByIdResponse,
  GetDraftsResponse,
  SetDraftCollectionDateByIdRequest,
  SetDraftCustomerReferenceByIdResponse,
  SetDraftWasteQuantityByIdRequest,
  SetDraftSubmissionConfirmationByIdRequest,
  SetDraftSubmissionDeclarationByIdRequest,
} from './submission.dto';
import {
  deleteDraftRequest,
  cancelDraftByIdRequest,
  getDraftByIdResponse,
  getDraftsResponse,
  setDraftCustomerReferenceByIdResponse,
  setDraftWasteQuantityByIdRequest,
  setDraftCollectionDateByIdRequest,
  setDraftSubmissionConfirmationByIdRequest,
  setDraftSubmissionDeclarationByIdRequest,
} from './submission.schema';

const ajv = new Ajv();

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

describe('cancelDraftRequest', () => {
  const validate = ajv.compile<CancelDraftByIdRequest>(cancelDraftByIdRequest);

  it('is compatible with dto values', () => {
    let value: CancelDraftByIdRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      cancellationType: { type: 'ChangeOfRecoveryFacilityOrLaboratory' },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      cancellationType: { type: 'ChangeOfRecoveryFacilityOrLaboratory' },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      cancellationType: {
        type: 'Other',
        reason: 'I just wanted to calcel it!',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getDraftsResponse', () => {
  const validate = ajv.compile<GetDraftsResponse>(getDraftsResponse);

  it('is compatible with success value', () => {
    const value: GetDraftsResponse = {
      success: true,
      value: {
        totalSubmissions: 1,
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
            wasteQuantity: { status: 'CannotStart' },
            exporterDetail: { status: 'NotStarted' },
            importerDetail: { status: 'NotStarted' },
            collectionDate: { status: 'NotStarted' },
            carriers: { status: 'NotStarted' },
            collectionDetail: { status: 'NotStarted' },
            ukExitLocation: { status: 'NotStarted' },
            transitCountries: { status: 'NotStarted' },
            recoveryFacilityDetail: { status: 'NotStarted' },
            submissionConfirmation: { status: 'CannotStart' },
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

describe('getDraftByIdResponse', () => {
  const validate = ajv.compile<GetDraftByIdResponse>(getDraftByIdResponse);

  it('is compatible with dto value', () => {
    const value: GetDraftByIdResponse = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        reference: faker.datatype.string(10),
        wasteDescription: {
          status: 'Complete',
          wasteCode: { type: 'NotApplicable' },
          ewcCodes: [],
          nationalCode: { provided: 'No' },
          description: '',
        },
        wasteQuantity: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        collectionDate: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: false,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'NotStarted' },
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftCustomerReferenceByIdResponse', () => {
  const validate = ajv.compile<SetDraftCustomerReferenceByIdResponse>(
    setDraftCustomerReferenceByIdResponse
  );

  it('is compatible with dto value', () => {
    const value: SetDraftCustomerReferenceByIdResponse = {
      success: true,
      value: undefined,
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftWasteQuantityByIdRequest', () => {
  const validate = ajv.compile<SetDraftWasteQuantityByIdRequest>(
    setDraftWasteQuantityByIdRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftWasteQuantityByIdRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: { status: 'NotStarted' },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: { status: 'Started' },
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

describe('setDraftCollectionDateByIdRequest', () => {
  const validate = ajv.compile<SetDraftCollectionDateByIdRequest>(
    setDraftCollectionDateByIdRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftCollectionDateByIdRequest = {
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

describe('setDraftSubmissionConfirmationByIdRequest', () => {
  const validate = ajv.compile<SetDraftSubmissionConfirmationByIdRequest>(
    setDraftSubmissionConfirmationByIdRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftSubmissionConfirmationByIdRequest = {
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

describe('setDraftSubmissionDeclarationByIdRequest', () => {
  const validate = ajv.compile<SetDraftSubmissionDeclarationByIdRequest>(
    setDraftSubmissionDeclarationByIdRequest
  );

  it('is compatible with dto values', () => {
    let value: SetDraftSubmissionDeclarationByIdRequest = {
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
