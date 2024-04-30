import { faker } from '@faker-js/faker';
import Ajv from 'ajv/dist/jtd';
import {
  CancelSubmissionRequest,
  Carrier,
  CollectionDate,
  CollectionDetail,
  CreateSubmissionsRequest,
  ExporterDetail,
  GetBulkSubmissionsRequest,
  GetBulkSubmissionsResponse,
  GetSubmissionResponse,
  GetSubmissionsResponse,
  ImporterDetail,
  RecoveryFacilityDetail,
  SetCollectionDateRequest,
  SetWasteQuantityRequest,
  Submission,
  SubmissionDeclaration,
  SubmissionState,
  TransitCountry,
  UkExitLocation,
  WasteDescription,
  WasteQuantity,
} from './dto';
import {
  cancelSubmissionRequest,
  carriers,
  collectionDate,
  collectionDetail,
  createSubmissionsRequest,
  exporterDetail,
  getBulkSubmissionsRequest,
  getBulkSubmissionsResponse,
  getSubmissionResponse,
  getSubmissionsResponse,
  importerDetail,
  recoveryFacilityDetails,
  setCollectionDateRequest,
  setWasteQuantityRequest,
  submission,
  submissionDeclaration,
  submissionState,
  transitCountries,
  ukExitLocation,
  wasteDescription,
  wasteQuantity,
} from './schema';

const ajv = new Ajv();

describe('wasteDescription', () => {
  const validate = ajv.compile<WasteDescription>(wasteDescription);

  it('is compatible with dto values', () => {
    const value: WasteDescription = {
      wasteCode: {
        type: 'AnnexIIIA',
        code: 'B1010 and B1050',
      },
      ewcCodes: [
        {
          code: '010101',
        },
        {
          code: '010102',
        },
      ],
      nationalCode: {
        provided: 'No',
      },
      description: 'test',
    };

    expect(validate(value)).toBe(true);
  });
});

describe('wasteQuantity', () => {
  const validate = ajv.compile<WasteQuantity>(wasteQuantity);

  it('is compatible with dto values', () => {
    const value: WasteQuantity = {
      type: 'ActualData',
      estimateData: {},
      actualData: {
        quantityType: 'Weight',
        unit: 'Tonne',
        value: 2,
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('exporterDetail', () => {
  const validate = ajv.compile<ExporterDetail>(exporterDetail);

  it('is compatible with dto values', () => {
    const value: ExporterDetail = {
      exporterAddress: {
        addressLine1: '1 Some Street',
        townCity: 'London',
        postcode: 'EC2N4AY',
        country: 'England',
      },
      exporterContactDetails: {
        organisationName: 'Test organisation 1',
        fullName: 'John Smith',
        emailAddress: 'test1@test.com',
        phoneNumber: '07888888888',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('importerDetail', () => {
  const validate = ajv.compile<ImporterDetail>(importerDetail);

  it('is compatible with dto values', () => {
    const value: ImporterDetail = {
      importerAddressDetails: {
        organisationName: 'Test organisation 2',
        address: '2 Some Street, Paris, 75002',
        country: 'France',
      },
      importerContactDetails: {
        fullName: 'Jane Smith',
        emailAddress: 'test2@test.com',
        phoneNumber: '0033140000000',
        faxNumber: '0033140000000',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('collectionDate', () => {
  const validate = ajv.compile<CollectionDate>(collectionDate);

  it('is compatible with dto values', () => {
    const value: CollectionDate = {
      type: 'ActualDate',
      actualDate: {
        day: '01',
        month: '01',
        year: '0001',
      },
      estimateDate: {},
    };

    expect(validate(value)).toBe(true);
  });
});

describe('carriers', () => {
  const validate = ajv.compile<Carrier[]>(carriers);

  it('is compatible with dto values', () => {
    const value: Carrier[] = [
      {
        addressDetails: {
          organisationName: 'Test organisation 3',
          address: 'Some address, London, EC2N4AY',
          country: 'United Kingdom (England) [GB-ENG]',
        },
        contactDetails: {
          fullName: 'John Doe',
          emailAddress: 'test3@test.com',
          phoneNumber: '07888888844',
          faxNumber: '07888888844',
        },
        transportDetails: {
          type: 'InlandWaterways',
          description: 'details',
        },
      },
      {
        addressDetails: {
          organisationName: 'Test organisation 4',
          address: '3 Some Street, Paris, 75002',
          country: 'France [FR]',
        },
        contactDetails: {
          fullName: 'Jane Doe',
          emailAddress: 'test4@test.com',
          phoneNumber: '0033140000044',
        },
        transportDetails: {
          type: 'Road',
        },
      },
    ];

    expect(validate(value)).toBe(true);
  });
});

describe('collectionDetail', () => {
  const validate = ajv.compile<CollectionDetail>(collectionDetail);

  it('is compatible with dto values', () => {
    const value: CollectionDetail = {
      address: {
        addressLine1: '5 Some Street',
        townCity: 'London',
        postcode: 'EC2N4AY',
        country: 'England',
      },
      contactDetails: {
        organisationName: 'Test organisation 5',
        fullName: 'John Johnson',
        emailAddress: 'test5@test.com',
        phoneNumber: '07888888855',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('ukExitLocation', () => {
  const validate = ajv.compile<UkExitLocation>(ukExitLocation);

  it('is compatible with dto values', () => {
    const value: UkExitLocation = {
      provided: 'Yes',
      value: 'Dover',
    };

    expect(validate(value)).toBe(true);
  });
});

describe('transitCountries', () => {
  const validate = ajv.compile<TransitCountry[]>(transitCountries);

  it('is compatible with dto values', () => {
    const value: TransitCountry[] = ['France [FR]', 'Belgium [BE]'];

    expect(validate(value)).toBe(true);
  });
});

describe('recoveryFacilityDetails', () => {
  const validate = ajv.compile<RecoveryFacilityDetail[]>(
    recoveryFacilityDetails
  );

  it('is compatible with dto values', () => {
    const value: RecoveryFacilityDetail[] = [
      {
        addressDetails: {
          name: 'Test organisation 6',
          address: '4 Some Street, Paris, 75002',
          country: 'France [FR]',
        },
        contactDetails: {
          fullName: 'Jean Philip',
          emailAddress: 'test6@test.com',
          phoneNumber: '0033140000066',
        },
        recoveryFacilityType: {
          type: 'RecoveryFacility',
          recoveryCode: 'R1',
        },
      },
    ];

    expect(validate(value)).toBe(true);
  });
});

describe('submissionDeclaration', () => {
  const validate = ajv.compile<SubmissionDeclaration>(submissionDeclaration);

  it('is compatible with dto values', () => {
    const value: SubmissionDeclaration = {
      declarationTimestamp: faker.date.soon(),
      transactionId: faker.datatype.string(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('submissionState', () => {
  const validate = ajv.compile<SubmissionState>(submissionState);

  it('is compatible with dto values', () => {
    const value: SubmissionState = {
      status: 'Cancelled',
      timestamp: faker.date.soon(),
      cancellationType: { type: 'ChangeOfRecoveryFacilityOrLaboratory' },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('full submission', () => {
  const validate = ajv.compile<Submission>(submission);

  it('is compatible with dto values', () => {
    const value: Submission = {
      id: faker.datatype.uuid(),
      reference: 'testRef',
      wasteDescription: {
        wasteCode: {
          type: 'AnnexIIIA',
          code: 'B1010 and B1050',
        },
        ewcCodes: [
          {
            code: '010101',
          },
          {
            code: '010102',
          },
        ],
        nationalCode: {
          provided: 'No',
        },
        description: 'test',
      },
      wasteQuantity: {
        type: 'ActualData',
        estimateData: {},
        actualData: {
          quantityType: 'Weight',
          unit: 'Tonne',
          value: 2,
        },
      },
      exporterDetail: {
        exporterAddress: {
          addressLine1: '1 Some Street',
          townCity: 'London',
          postcode: 'EC2N4AY',
          country: 'England',
        },
        exporterContactDetails: {
          organisationName: 'Test organisation 1',
          fullName: 'John Smith',
          emailAddress: 'test1@test.com',
          phoneNumber: '07888888888',
        },
      },
      importerDetail: {
        importerAddressDetails: {
          organisationName: 'Test organisation 2',
          address: '2 Some Street, Paris, 75002',
          country: 'France',
        },
        importerContactDetails: {
          fullName: 'Jane Smith',
          emailAddress: 'test2@test.com',
          phoneNumber: '0033140000000',
          faxNumber: '0033140000000',
        },
      },
      collectionDate: {
        type: 'ActualDate',
        actualDate: {
          day: '01',
          month: '01',
          year: '0001',
        },
        estimateDate: {},
      },
      carriers: [
        {
          addressDetails: {
            organisationName: 'Test organisation 3',
            address: 'Some address, London, EC2N4AY',
            country: 'United Kingdom (England) [GB-ENG]',
          },
          contactDetails: {
            fullName: 'John Doe',
            emailAddress: 'test3@test.com',
            phoneNumber: '07888888844',
            faxNumber: '07888888844',
          },
          transportDetails: {
            type: 'InlandWaterways',
            description: 'details',
          },
        },
        {
          addressDetails: {
            organisationName: 'Test organisation 4',
            address: '3 Some Street, Paris, 75002',
            country: 'France [FR]',
          },
          contactDetails: {
            fullName: 'Jane Doe',
            emailAddress: 'test4@test.com',
            phoneNumber: '0033140000044',
          },
          transportDetails: {
            type: 'Road',
          },
        },
      ],
      collectionDetail: {
        address: {
          addressLine1: '5 Some Street',
          townCity: 'London',
          postcode: 'EC2N4AY',
          country: 'England',
        },
        contactDetails: {
          organisationName: 'Test organisation 5',
          fullName: 'John Johnson',
          emailAddress: 'test5@test.com',
          phoneNumber: '07888888855',
        },
      },
      ukExitLocation: {
        provided: 'Yes',
        value: 'Dover',
      },
      transitCountries: ['France [FR]', 'Belgium [BE]'],
      recoveryFacilityDetail: [
        {
          addressDetails: {
            name: 'Test organisation 6',
            address: '4 Some Street, Paris, 75002',
            country: 'France [FR]',
          },
          contactDetails: {
            fullName: 'Jean Philip',
            emailAddress: 'test6@test.com',
            phoneNumber: '0033140000066',
          },
          recoveryFacilityType: {
            type: 'RecoveryFacility',
            recoveryCode: 'R1',
          },
        },
      ],
      submissionDeclaration: {
        declarationTimestamp: faker.date.soon(),
        transactionId: faker.datatype.string(),
      },
      submissionState: {
        status: 'SubmittedWithActuals',
        timestamp: faker.date.soon(),
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('cancelSubmissionRequest', () => {
  const validate = ajv.compile<CancelSubmissionRequest>(
    cancelSubmissionRequest
  );

  it('is compatible with dto values', () => {
    let value: CancelSubmissionRequest = {
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
        reason: 'I just wanted to cancel it!',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getSubmissionsResponse', () => {
  const validate = ajv.compile<GetSubmissionsResponse>(getSubmissionsResponse);

  it('is compatible with success value', () => {
    const value: GetSubmissionsResponse = {
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
            wasteDescription: {
              wasteCode: {
                type: 'NotApplicable',
              },
              ewcCodes: [
                {
                  code: '010101',
                },
              ],
              nationalCode: {
                provided: 'No',
              },
              description: 'desc',
            },
            collectionDate: {
              type: 'ActualDate',
              actualDate: {
                day: '11',
                month: '11',
                year: '2050',
              },
              estimateDate: {},
            },
            submissionDeclaration: {
              declarationTimestamp: new Date(),
              transactionId: '2404_09FG3023',
            },
            submissionState: {
              status: 'SubmittedWithActuals',
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

describe('getSubmissionResponse', () => {
  const validate = ajv.compile<GetSubmissionResponse>(getSubmissionResponse);

  it('is compatible with dto value', () => {
    const value: GetSubmissionResponse = {
      success: true,
      value: {
        id: faker.datatype.uuid(),
        reference: faker.datatype.string(10),
        wasteDescription: {
          wasteCode: {
            type: 'AnnexIIIA',
            code: 'B1010 and B1050',
          },
          ewcCodes: [
            {
              code: '010101',
            },
            {
              code: '010102',
            },
          ],
          nationalCode: {
            provided: 'No',
          },
          description: 'test',
        },
        wasteQuantity: {
          type: 'ActualData',
          estimateData: {},
          actualData: {
            quantityType: 'Weight',
            unit: 'Tonne',
            value: 2,
          },
        },
        exporterDetail: {
          exporterAddress: {
            addressLine1: '1 Some Street',
            townCity: 'London',
            postcode: 'EC2N4AY',
            country: 'England',
          },
          exporterContactDetails: {
            organisationName: 'Test organisation 1',
            fullName: 'John Smith',
            emailAddress: 'test1@test.com',
            phoneNumber: '07888888888',
          },
        },
        importerDetail: {
          importerAddressDetails: {
            organisationName: 'Test organisation 2',
            address: '2 Some Street, Paris, 75002',
            country: 'France',
          },
          importerContactDetails: {
            fullName: 'Jane Smith',
            emailAddress: 'test2@test.com',
            phoneNumber: '0033140000000',
            faxNumber: '0033140000000',
          },
        },
        collectionDate: {
          type: 'ActualDate',
          actualDate: {
            day: '01',
            month: '01',
            year: '0001',
          },
          estimateDate: {},
        },
        carriers: [
          {
            addressDetails: {
              organisationName: 'Test organisation 3',
              address: 'Some address, London, EC2N4AY',
              country: 'United Kingdom (England) [GB-ENG]',
            },
            contactDetails: {
              fullName: 'John Doe',
              emailAddress: 'test3@test.com',
              phoneNumber: '07888888844',
              faxNumber: '07888888844',
            },
            transportDetails: {
              type: 'InlandWaterways',
              description: 'details',
            },
          },
          {
            addressDetails: {
              organisationName: 'Test organisation 4',
              address: '3 Some Street, Paris, 75002',
              country: 'France [FR]',
            },
            contactDetails: {
              fullName: 'Jane Doe',
              emailAddress: 'test4@test.com',
              phoneNumber: '0033140000044',
            },
            transportDetails: {
              type: 'Road',
            },
          },
        ],
        collectionDetail: {
          address: {
            addressLine1: '5 Some Street',
            townCity: 'London',
            postcode: 'EC2N4AY',
            country: 'England',
          },
          contactDetails: {
            organisationName: 'Test organisation 5',
            fullName: 'John Johnson',
            emailAddress: 'test5@test.com',
            phoneNumber: '07888888855',
          },
        },
        ukExitLocation: {
          provided: 'Yes',
          value: 'Dover',
        },
        transitCountries: ['France [FR]', 'Belgium [BE]'],
        recoveryFacilityDetail: [
          {
            addressDetails: {
              name: 'Test organisation 6',
              address: '4 Some Street, Paris, 75002',
              country: 'France [FR]',
            },
            contactDetails: {
              fullName: 'Jean Philip',
              emailAddress: 'test6@test.com',
              phoneNumber: '0033140000066',
            },
            recoveryFacilityType: {
              type: 'RecoveryFacility',
              recoveryCode: 'R1',
            },
          },
        ],
        submissionDeclaration: {
          declarationTimestamp: new Date(),
          transactionId: '2404_09FG3023',
        },
        submissionState: {
          status: 'SubmittedWithActuals',
          timestamp: new Date(),
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setWasteQuantityRequest', () => {
  const validate = ajv.compile<SetWasteQuantityRequest>(
    setWasteQuantityRequest
  );

  it('is compatible with dto values', () => {
    let value: SetWasteQuantityRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        type: 'ActualData',
        estimateData: {},
        actualData: {
          quantityType: 'Weight',
          unit: 'Tonne',
          value: 2,
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        type: 'ActualData',
        estimateData: {},
        actualData: {
          quantityType: 'Weight',
          value: 2,
        },
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        type: 'ActualData',
        estimateData: {
          quantityType: 'Weight',
          value: 2,
        },
        actualData: {
          quantityType: 'Weight',
          value: 2,
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setCollectionDateRequest', () => {
  const validate = ajv.compile<SetCollectionDateRequest>(
    setCollectionDateRequest
  );

  it('is compatible with dto values', () => {
    let value: SetCollectionDateRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        type: 'ActualDate',
        actualDate: {
          day: '01',
          month: '01',
          year: '0001',
        },
        estimateDate: {},
      },
    };

    expect(validate(value)).toBe(true);

    value = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      value: {
        type: 'ActualDate',
        actualDate: {
          day: '01',
          month: '01',
          year: '0001',
        },
        estimateDate: {
          day: '01',
          month: '01',
          year: '0001',
        },
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('createSubmissionsRequest', () => {
  const validate = ajv.compile<CreateSubmissionsRequest>(
    createSubmissionsRequest
  );
  it('is compatible with dto values', () => {
    const value: CreateSubmissionsRequest = {
      id: faker.datatype.uuid(),
      accountId: faker.datatype.uuid(),
      values: [
        {
          reference: 'testRef',
          wasteDescription: {
            wasteCode: {
              type: 'AnnexIIIA',
              code: 'B1010 and B1050',
            },
            ewcCodes: [
              {
                code: '010101',
              },
              {
                code: '010102',
              },
            ],
            nationalCode: {
              provided: 'No',
            },
            description: 'test',
          },
          wasteQuantity: {
            type: 'ActualData',
            estimateData: {},
            actualData: {
              quantityType: 'Weight',
              unit: 'Tonne',
              value: 2,
            },
          },
          exporterDetail: {
            exporterAddress: {
              addressLine1: '1 Some Street',
              townCity: 'London',
              postcode: 'EC2N4AY',
              country: 'England',
            },
            exporterContactDetails: {
              organisationName: 'Test organisation 1',
              fullName: 'John Smith',
              emailAddress: 'test1@test.com',
              phoneNumber: '07888888888',
            },
          },
          importerDetail: {
            importerAddressDetails: {
              organisationName: 'Test organisation 2',
              address: '2 Some Street, Paris, 75002',
              country: 'France',
            },
            importerContactDetails: {
              fullName: 'Jane Smith',
              emailAddress: 'test2@test.com',
              phoneNumber: '0033140000000',
              faxNumber: '0033140000000',
            },
          },
          collectionDate: {
            type: 'ActualDate',
            actualDate: {
              day: '01',
              month: '01',
              year: '0001',
            },
            estimateDate: {},
          },
          carriers: [
            {
              addressDetails: {
                organisationName: 'Test organisation 3',
                address: 'Some address, London, EC2N4AY',
                country: 'United Kingdom (England) [GB-ENG]',
              },
              contactDetails: {
                fullName: 'John Doe',
                emailAddress: 'test3@test.com',
                phoneNumber: '07888888844',
                faxNumber: '07888888844',
              },
              transportDetails: {
                type: 'InlandWaterways',
                description: 'details',
              },
            },
            {
              addressDetails: {
                organisationName: 'Test organisation 4',
                address: '3 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jane Doe',
                emailAddress: 'test4@test.com',
                phoneNumber: '0033140000044',
              },
              transportDetails: {
                type: 'Road',
              },
            },
          ],
          collectionDetail: {
            address: {
              addressLine1: '5 Some Street',
              townCity: 'London',
              postcode: 'EC2N4AY',
              country: 'England',
            },
            contactDetails: {
              organisationName: 'Test organisation 5',
              fullName: 'John Johnson',
              emailAddress: 'test5@test.com',
              phoneNumber: '07888888855',
            },
          },
          ukExitLocation: {
            provided: 'Yes',
            value: 'Dover',
          },
          transitCountries: ['France [FR]', 'Belgium [BE]'],
          recoveryFacilityDetail: [
            {
              addressDetails: {
                name: 'Test organisation 6',
                address: '4 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jean Philip',
                emailAddress: 'test6@test.com',
                phoneNumber: '0033140000066',
              },
              recoveryFacilityType: {
                type: 'RecoveryFacility',
                recoveryCode: 'R1',
              },
            },
          ],
        },
      ],
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getBulkSubmissionsRequest', () => {
  const validate = ajv.compile<GetBulkSubmissionsRequest>(
    getBulkSubmissionsRequest
  );

  it('is compatible with dto values', () => {
    const value: GetBulkSubmissionsRequest = {
      accountId: faker.datatype.uuid(),
      submissionIds: [
        '9d27808f-df68-430c-877c-920b66a435c9',
        'ae8ce10c-8f35-4165-af6e-37d4abdb6121',
        '221e1ea2-216f-4eaa-b955-f2697f31e385',
        '8e46ea2f-85e4-440d-866c-05167c9f4d69',
        '2e1fd63e-c086-47e8-857e-e15e9ec42dd3',
        '9cf86e66-4419-4dca-ae2a-2caf414f14a9',
        '972725a9-36b1-43e0-b992-fc9a2001c770',
        '4909acad-c100-4419-b73e-181dfd553bfe',
        '8d1cb87d-9349-4d84-acf2-30aa4df4d2cb',
      ],
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getBulkSubmissionsResponse', () => {
  const validate = ajv.compile<GetBulkSubmissionsResponse>(
    getBulkSubmissionsResponse
  );

  it('is compatible with dto values', () => {
    const value: GetBulkSubmissionsResponse = {
      success: true,
      value: [
        {
          id: '8d1cb87d-9349-4d84-acf2-30aa4df4d2cb',
          reference: 'ref9',
          wasteDescription: {
            wasteCode: {
              type: 'BaselAnnexIX',
              code: 'B1010',
            },
            ewcCodes: [
              {
                code: '101213',
              },
            ],
            nationalCode: {
              provided: 'No',
            },
            description: 'WasteDescription',
          },
          wasteQuantity: {
            type: 'EstimateData',
            estimateData: {
              quantityType: 'Volume',
              unit: 'Cubic Metre',
              value: 10,
            },
            actualData: {},
          },
          exporterDetail: {
            exporterAddress: {
              addressLine1: 'Test organisation 1',
              addressLine2: 'Address line',
              townCity: 'London',
              postcode: 'EC2N4AY',
              country: 'England',
            },
            exporterContactDetails: {
              organisationName: 'Test organisation 1',
              fullName: 'John Smith',
              emailAddress: 'test1@test.com',
              phoneNumber: '00-44788-888 8888',
              faxNumber: '07888888888',
            },
          },
          importerDetail: {
            importerAddressDetails: {
              organisationName: 'Test organisation 2',
              address: '2 Some Street, Paris, 75002',
              country: 'France [FR]',
            },
            importerContactDetails: {
              fullName: 'Jane Smith',
              emailAddress: 'test2@test.com',
              phoneNumber: '0033140000000',
              faxNumber: '00 33140000000',
            },
          },
          collectionDate: {
            type: 'EstimateDate',
            estimateDate: {
              day: '15',
              month: '01',
              year: '2050',
            },
            actualDate: {},
          },
          carriers: [
            {
              addressDetails: {
                organisationName: 'Test organisation 2',
                address: '2 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jane Smith',
                emailAddress: 'test2@test.com',
                phoneNumber: '0033140000000',
                faxNumber: '00 33140000000',
              },
              transportDetails: {
                type: 'Sea',
              },
            },
          ],
          collectionDetail: {
            address: {
              addressLine1: 'Test organisation 1',
              addressLine2: 'Address line',
              townCity: 'London',
              postcode: 'EC2N4AY',
              country: 'England',
            },
            contactDetails: {
              organisationName: 'Test organisation 1',
              fullName: 'John Smith',
              emailAddress: 'test1@test.com',
              phoneNumber: '00-44788-888 8888',
              faxNumber: '07888888888',
            },
          },
          ukExitLocation: {
            provided: 'No',
          },
          transitCountries: [],
          recoveryFacilityDetail: [
            {
              addressDetails: {
                name: 'Test organisation 2',
                address: '2 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jane Smith',
                emailAddress: 'test2@test.com',
                phoneNumber: '0033140000000',
                faxNumber: '00 33140000000',
              },
              recoveryFacilityType: {
                type: 'InterimSite',
                recoveryCode: 'R13',
              },
            },
            {
              addressDetails: {
                name: 'Test organisation 2',
                address: '2 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jane Smith',
                emailAddress: 'test2@test.com',
                phoneNumber: '0033140000000',
                faxNumber: '00 33140000000',
              },
              recoveryFacilityType: {
                type: 'RecoveryFacility',
                recoveryCode: 'R1',
              },
            },
          ],
          submissionDeclaration: {
            declarationTimestamp: new Date(),
            transactionId: '2404_8D1CB87D',
          },
          submissionState: {
            status: 'SubmittedWithEstimates',
            timestamp: new Date(),
          },
        },
        {
          id: '4909acad-c100-4419-b73e-181dfd553bfe',
          reference: 'ref8',
          wasteDescription: {
            wasteCode: {
              type: 'NotApplicable',
            },
            ewcCodes: [
              {
                code: '101213',
              },
            ],
            nationalCode: {
              provided: 'Yes',
              value: 'NatCode',
            },
            description: 'WasteDescription',
          },
          wasteQuantity: {
            type: 'ActualData',
            estimateData: {},
            actualData: {
              quantityType: 'Weight',
              unit: 'Kilogram',
              value: 12.5,
            },
          },
          exporterDetail: {
            exporterAddress: {
              addressLine1: 'Test organisation 1',
              townCity: 'London',
              country: 'England',
            },
            exporterContactDetails: {
              organisationName: 'Test organisation 1',
              fullName: 'John Smith',
              emailAddress: 'test1@test.com',
              phoneNumber: '07888888888',
            },
          },
          importerDetail: {
            importerAddressDetails: {
              organisationName: 'Test organisation 2',
              address: '2 Some Street, Paris, 75002',
              country: 'France [FR]',
            },
            importerContactDetails: {
              fullName: 'Jane Smith',
              emailAddress: 'test2@test.com',
              phoneNumber: '0033140000000',
            },
          },
          collectionDate: {
            type: 'ActualDate',
            estimateDate: {},
            actualDate: {
              day: '08',
              month: '01',
              year: '2050',
            },
          },
          carriers: [
            {
              addressDetails: {
                organisationName: 'Test organisation 2',
                address: '2 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jane Smith',
                emailAddress: 'test2@test.com',
                phoneNumber: '0033140000000',
              },
            },
          ],
          collectionDetail: {
            address: {
              addressLine1: 'Test organisation 1',
              townCity: 'London',
              country: 'England',
            },
            contactDetails: {
              organisationName: 'Test organisation 1',
              fullName: 'John Smith',
              emailAddress: 'test1@test.com',
              phoneNumber: '07888888888',
            },
          },
          ukExitLocation: {
            provided: 'No',
          },
          transitCountries: [],
          recoveryFacilityDetail: [
            {
              addressDetails: {
                name: 'Test organisation 2',
                address: '2 Some Street, Paris, 75002',
                country: 'France [FR]',
              },
              contactDetails: {
                fullName: 'Jane Smith',
                emailAddress: 'test2@test.com',
                phoneNumber: '0033140000000',
              },
              recoveryFacilityType: {
                type: 'Laboratory',
                disposalCode: 'D2',
              },
            },
          ],
          submissionDeclaration: {
            declarationTimestamp: new Date(),
            transactionId: '2404_4909ACAD',
          },
          submissionState: {
            status: 'SubmittedWithActuals',
            timestamp: new Date(),
          },
        },
      ],
    };

    expect(validate(value)).toBe(true);
  });
});
