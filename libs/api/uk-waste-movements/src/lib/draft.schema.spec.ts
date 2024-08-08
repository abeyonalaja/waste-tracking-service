import Ajv from 'ajv/dist/jtd';
import { faker } from '@faker-js/faker';
import {
  CarrierDetail,
  CreateDraftRequest,
  CreateMultipleDraftsRequest,
  GetDraftProducerContactDetailRequest,
  GetDraftProducerContactDetailResponse,
  GetDraftResponse,
  GetDraftsRequest,
  GetDraftsResponse,
  ProducerDetail,
  ReceiverDetail,
  SetDraftProducerContactDetailRequest,
  ValidateMultipleDraftsRequest,
  ValidateMultipleDraftsResponse,
  WasteCollectionDetail,
  WasteTransportationDetail,
  WasteTypeDetail,
  GetDraftProducerAddressDetailsRequest,
  SetDraftProducerAddressDetailsRequest,
  GetDraftProducerAddressDetailsResponse,
} from './draft.dto';
import {
  carrier,
  getDraftResponse,
  getDraftsRequest,
  getDraftsResponse,
  producer,
  receiver,
  wasteCollection,
  wasteTransportation,
  wasteType,
  validateMultipleDraftsRequest,
  validateMultipleDraftsResponse,
  createMultipleDraftsRequest,
  createDraftRequest,
  getDraftProducerAddressDetailsRequest,
  setDraftProducerAddressDetailsRequest,
  setPartialDraftProducerAddressDetailsRequest,
  getDraftProducerAddressDetailsResponse,
  setDraftProducerContactDetailRequest,
  setPartialDraftProducerContactDetailRequest,
  getDraftProducerContactDetailRequest,
  getDraftProducerContactDetailResponse,
} from './draft.schema';

const ajv = new Ajv();

describe('getDraftResponse', () => {
  const validate = ajv.compile<GetDraftResponse>(getDraftResponse);
  it('is compatible with dto values', () => {
    const value: GetDraftResponse = {
      success: true,
      value: {
        id: '',
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
          status: 'NotStarted',
        },
        declaration: {
          status: 'NotStarted',
        },
        state: {
          status: 'SubmittedWithActuals',
          timestamp: new Date(),
        },
      },
    };
    expect(validate(value)).toBe(true);
  });

  it('is compatible with dto values,with all statuses complete', () => {
    const value: GetDraftResponse = {
      success: true,
      value: {
        id: '1',
        wasteInformation: {
          status: 'Complete',
          wasteTypes: [
            {
              ewcCode: '20 03 01',
              wasteDescription: 'Mixed municipal waste',
              physicalForm: 'Solid',
              wasteQuantity: 100,
              quantityUnit: 'Tonne',
              wasteQuantityType: 'ActualData',
              chemicalAndBiologicalComponents: [
                {
                  name: 'Component1',
                  concentration: 50,
                  concentrationUnit: '%',
                },
              ],
              hasHazardousProperties: false,
              containsPops: false,
            },
          ],
          wasteTransportation: {
            numberAndTypeOfContainers: '10 x 20ft containers',
          },
        },
        receiver: {
          status: 'Complete',
          value: {
            authorizationType: 'Type1',
            environmentalPermitNumber: 'EPN123',
            contact: {
              organisationName: 'Organisation1',
              name: 'Contact1',
              email: 'contact1@example.com',
              phone: '1234567890',
            },
            address: {
              addressLine1: 'Address Line 1',
              townCity: 'City1',
              country: 'Country1',
            },
          },
        },
        producerAndCollection: {
          status: 'Complete',
          producer: {
            reference: 'REF123',
            address: {
              status: 'Complete',
              addressLine1: 'Address Line 2',
              townCity: 'City2',
              country: 'Country2',
            },
            contact: {
              status: 'Complete',
              organisationName: 'Organisation2',
              name: 'Contact2',
              email: 'contact2@example.com',
              phone: '0987654321',
            },
          },
          wasteCollection: {
            wasteSource: {
              status: 'Complete',
              value: 'Commercial',
            },
            localAuthority: 'LA1',
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2025',
            },
            address: {
              status: 'Complete',
              addressLine1: 'Address Line 3',
              townCity: 'City3',
              country: 'Country3',
            },
          },
        },
        carrier: {
          status: 'Complete',
          value: {
            contact: {
              organisationName: 'Organisation2',
              name: 'Contact2',
              email: 'contact2@example.com',
              phone: '0987654321',
            },
            address: {
              addressLine1: 'Address Line 2',
              townCity: 'City2',
              country: 'Country2',
            },
          },
        },
        declaration: {
          status: 'Complete',
          value: {
            declarationTimestamp: new Date(),
            transactionId: '123',
          },
        },
        state: {
          status: 'SubmittedWithActuals',
          timestamp: new Date(),
        },
      },
    };
    expect(validate(value)).toBe(true);
  });
});

describe('getDraftsRequest', () => {
  const validate = ajv.compile<GetDraftsRequest>(getDraftsRequest);
  it('is compatible with dto values', () => {
    const value: GetDraftsRequest = {
      page: 1,
      pageSize: 10,
      collectionDate: new Date(),
      ewcCode: '123',
      producerName: 'name',
      wasteMovementId: '123',
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getDraftsResponse', () => {
  const validate = ajv.compile<GetDraftsResponse>(getDraftsResponse);
  it('is compatible with dto values', () => {
    const value: GetDraftsResponse = {
      success: true,
      value: {
        page: 1,
        totalRecords: 1,
        totalPages: 1,
        values: [
          {
            id: '123',
            wasteMovementId: '123',
            producerName: 'name',
            ewcCode: '123',
            collectionDate: {
              day: '1',
              month: '1',
              year: '2021',
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('producer', () => {
  const validate = ajv.compile<ProducerDetail>(producer);

  it('is compatible with dto values', () => {
    const value: ProducerDetail = {
      reference: 'testRef',
      sicCode: '123456',
      contact: {
        organisationName: 'org',
        name: 'name',
        email: 'example@email.co.uk',
        phone: '02071234567',
      },
      address: {
        buildingNameOrNumber: '123',
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
    };

    const isValid = validate(value);

    expect(isValid).toBe(true);
  });
});

describe('wasteTypeDetails', () => {
  const validate = ajv.compile<WasteTypeDetail>(wasteType);

  it('is compatible with dto values', () => {
    const value: WasteTypeDetail = {
      ewcCode: '01 03 04',
      wasteDescription: 'waste description',
      physicalForm: 'Solid',
      wasteQuantity: 100,
      quantityUnit: 'Tonne',
      wasteQuantityType: 'ActualData',
      hasHazardousProperties: false,
      containsPops: false,
      chemicalAndBiologicalComponents: [
        {
          concentration: 1,
          name: 'test',
          concentrationUnit: 'Milligram',
        },
      ],
      hazardousWasteCodes: [
        {
          code: 'HP1',
          name: 'test',
        },
      ],
      pops: [
        {
          concentration: 1,
          name: 'test',
          concentrationUnit: 'Milligram',
        },
      ],
    };

    const isValid = validate(value);

    expect(isValid).toBe(true);
  });
});

describe('receiver', () => {
  const validate = ajv.compile<ReceiverDetail>(receiver);

  it('is compatible with dto values and phone number contains 11 caracters', () => {
    const value: ReceiverDetail = {
      authorizationType: 'permit',
      environmentalPermitNumber: '123',
      contact: {
        organisationName: 'org',
        name: 'name',
        email: 'example@email.co.uk',
        phone: '02071234567',
      },
      address: {
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with dto values and phone number contains 13 caracters', () => {
    const value: ReceiverDetail = {
      authorizationType: 'permit',
      environmentalPermitNumber: '123',
      contact: {
        organisationName: 'org',
        name: 'name',
        email: 'myemail@sample.com',
        phone: '+442071234567',
      },
      address: {
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
    };

    expect(validate(value)).toBe(true);
  });

  it('is compatible with dto values and phone number contains 13 caracters and an environmental Permit number with space and ()', () => {
    const value: ReceiverDetail = {
      authorizationType: 'permit',
      environmentalPermitNumber: 'E123-456-ABC (1)',
      contact: {
        organisationName: 'org',
        name: 'name',
        email: 'myemail@sample.com',
        phone: '+442071234567',
      },
      address: {
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('wasteCollection', () => {
  const validate = ajv.compile<WasteCollectionDetail>(wasteCollection);

  it('is compatible with dto values', () => {
    const value: WasteCollectionDetail = {
      address: {
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
      wasteSource: 'Household',
      brokerRegistrationNumber: '1234567',
      carrierRegistrationNumber: 'CBDU1234',
      localAuthority: 'local authority',
      expectedWasteCollectionDate: {
        day: '01',
        month: '01',
        year: '2028',
      },
    };

    const isValid = validate(value);

    expect(isValid).toBe(true);
  });
});

describe('carrier', () => {
  const validate = ajv.compile<CarrierDetail>(carrier);

  it('is compatible with dto values', () => {
    const value: CarrierDetail = {
      contact: {
        organisationName: 'org',
        name: 'name',
        email: 'example@email.co.uk',
        phone: '02071234567',
      },
      address: {
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
    };

    const isValid = validate(value);

    expect(isValid).toBe(true);
  });
});

describe('wasteTransportationDetails', () => {
  const validate = ajv.compile<WasteTransportationDetail>(wasteTransportation);

  it('is compatible with dto values', () => {
    const value: WasteTransportationDetail = {
      numberAndTypeOfContainers: '1 x 20L drum',
      specialHandlingRequirements: 'special handling requirements',
    };

    expect(validate(value)).toBe(true);
  });

  it('handles optional properties', () => {
    const value: WasteTransportationDetail = {
      numberAndTypeOfContainers: '1 x 20L drum',
    };

    expect(validate(value)).toBe(true);
  });
});

describe('validateMultipleDraftsRequest', () => {
  const validate = ajv.compile<ValidateMultipleDraftsRequest>(
    validateMultipleDraftsRequest,
  );

  it('is compatible with dto values', () => {
    const value: ValidateMultipleDraftsRequest = {
      accountId: faker.string.uuid(),
      padIndex: 2,
      values: [
        {
          producerOrganisationName: 'Producer Organisation Name',
          producerContactName: 'Producer Contact Name',
          producerContactEmail: 'Producer Email',
          producerContactPhone: 'Producer Phone',
          producerAddressLine1: 'Producer Address Line 1',
          producerAddressLine2: 'Producer Address Line 2',
          producerTownCity: 'Producer Town/City',
          producerPostcode: 'Producer Postcode',
          producerCountry: 'Producer Country',
          producerSicCode: 'Producer SIC Code',
          customerReference: 'Reference',
          receiverAuthorizationType: 'Receiver Authorization Type',
          receiverEnvironmentalPermitNumber:
            'Receiver Environmental Permit Number',
          receiverOrganisationName: 'Receiver Organisation Name',
          receiverAddressLine1: 'Receiver Address Line 1',
          receiverAddressLine2: 'Receiver Address Line 2',
          receiverTownCity: 'Receiver Town/City',
          receiverPostcode: 'Receiver Postcode',
          receiverCountry: 'Receiver Country',
          receiverContactName: 'Receiver Contact Name',
          receiverContactPhone: 'Receiver Contact Phone',
          receiverContactEmail: 'Receiver Contact Email',
          wasteTransportationNumberAndTypeOfContainers:
            'Waste Transportation Number And Type Of Containers',
          wasteTransportationSpecialHandlingRequirements:
            'Waste Transportation Special Handling Requirements',
          wasteCollectionExpectedWasteCollectionDate: '2022-01-01',
          wasteCollectionLocalAuthority: 'Waste Collection Local Authority',
          wasteCollectionWasteSource: 'Household',
          wasteCollectionAddressLine1: 'Waste Collection Address Line 1',
          wasteCollectionAddressLine2: 'Waste Collection Address Line 2',
          wasteCollectionBrokerRegistrationNumber:
            'Waste Collection Broker Registration Number',
          wasteCollectionCarrierRegistrationNumber:
            'Waste Collection Carrier Registration Number',
          wasteCollectionCountry: 'Waste Collection Country',
          wasteCollectionPostcode: 'Waste Collection Postcode',
          wasteCollectionTownCity: 'Waste Collection Town/City',
          firstWasteTypeEwcCode: '010203',
          firstWasteTypeWasteDescription: 'Waste',
          firstWasteTypePhysicalForm: 'Solid',
          firstWasteTypeWasteQuantity: '15',
          firstWasteTypeWasteQuantityUnit: 'Tonne',
          firstWasteTypeWasteQuantityType: 'EstimateData',
          firstWasteTypeHasHazardousProperties: 'Yes',
          firstWasteTypeHazardousWasteCodesString: 'HP1',
          firstWasteTypeContainsPops: 'No',
          firstWasteTypePopsString: '',
          firstWasteTypePopsConcentrationsString: '',
          firstWasteTypePopsConcentrationUnitsString: '',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString: '',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            '',
          firstWasteTypeChemicalAndBiologicalComponentsString: '',
        },
      ],
    };

    expect(validate(value)).toBe(true);
  });
});

describe('validateMultipleDraftsResponse', () => {
  const validate = ajv.compile<ValidateMultipleDraftsResponse>(
    validateMultipleDraftsResponse,
  );

  it('is compatible with dto values when valid', () => {
    const value: ValidateMultipleDraftsResponse = {
      success: true,
      value: {
        valid: true,
        accountId: faker.string.uuid(),
        values: [
          {
            wasteTransportation: {
              numberAndTypeOfContainers: 'test',
              specialHandlingRequirements: 'test',
            },
            wasteCollection: {
              address: {
                addressLine1: 'Waste Collection Address Line 1',
                addressLine2: 'Waste Collection Address Line 2',
                country: 'Waste Collection Country',
                postcode: 'Waste Collection Postcode',
                townCity: 'Waste Collection Town/City',
              },
              expectedWasteCollectionDate: {
                day: '01',
                month: '01',
                year: '2024',
              },
              localAuthority: 'Waste Collection Local Authority',
              wasteSource: 'Household',
              brokerRegistrationNumber:
                'Waste Collection Broker Registration Number',
              carrierRegistrationNumber:
                'Waste Collection Carrier Registration Number',
            },
            carrier: {
              contact: {
                organisationName: 'org',
                name: 'name',
                email: 'example@email.co.uk',
                phone: '02071234567',
              },
              address: {
                addressLine1: '123 Oxford Street',
                addressLine2: 'Westminster',
                townCity: 'London',
                postcode: 'W1A 1AA',
                country: 'England',
              },
            },
            wasteTypes: [
              {
                ewcCode: '01 03 04',
                wasteDescription: 'waste description',
                physicalForm: 'Solid',
                wasteQuantity: 100,
                quantityUnit: 'Tonne',
                wasteQuantityType: 'ActualData',
                hasHazardousProperties: false,
                containsPops: false,
                chemicalAndBiologicalComponents: [
                  {
                    concentration: 1,
                    name: 'test',
                    concentrationUnit: 'Milligram',
                  },
                ],
                hazardousWasteCodes: [
                  {
                    code: 'HP1',
                    name: 'test',
                  },
                ],
                pops: [
                  {
                    concentration: 1,
                    name: 'test',
                    concentrationUnit: 'Milligram',
                  },
                ],
              },
            ],
            receiver: {
              address: {
                addressLine1: 'Receiver Address Line 1',
                addressLine2: 'Receiver Address Line 2',
                country: 'Receiver Country',
                postcode: 'Receiver Postcode',
                townCity: 'Receiver Town/City',
              },
              contact: {
                email: 'Receiver Email',
                name: 'Receiver Contact Name',
                organisationName: 'Receiver Organisation Name',
                phone: 'Receiver Phone',
              },
              authorizationType: 'permit',
              environmentalPermitNumber: '123456',
            },
            producer: {
              reference: 'ref',
              sicCode: '123456',
              address: {
                addressLine1: 'Producer Address Line 1',
                addressLine2: 'Producer Address Line 2',
                country: 'Producer Country',
                postcode: 'Producer Postcode',
                townCity: 'Producer Town/City',
              },
              contact: {
                email: 'Producer Email',
                name: 'Producer Contact Name',
                organisationName: 'Producer Organisation Name',
                phone: 'Producer Phone',
              },
            },
          },
        ],
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('createMultipleDraftsRequest', () => {
  const validate = ajv.compile<CreateMultipleDraftsRequest>(
    createMultipleDraftsRequest,
  );

  it('is compatible with dto value', () => {
    const value: CreateMultipleDraftsRequest = {
      accountId: faker.string.uuid(),
      values: [
        {
          wasteTransportation: {
            numberAndTypeOfContainers: 'test',
            specialHandlingRequirements: 'test',
          },
          wasteCollection: {
            address: {
              addressLine1: 'Waste Collection Address Line 1',
              addressLine2: 'Waste Collection Address Line 2',
              country: 'Waste Collection Country',
              postcode: 'Waste Collection Postcode',
              townCity: 'Waste Collection Town/City',
            },
            expectedWasteCollectionDate: {
              day: '01',
              month: '01',
              year: '2024',
            },
            localAuthority: 'Waste Collection Local Authority',
            wasteSource: 'Household',
            brokerRegistrationNumber:
              'Waste Collection Broker Registration Number',
            carrierRegistrationNumber:
              'Waste Collection Carrier Registration Number',
          },
          carrier: {
            contact: {
              organisationName: 'org',
              name: 'name',
              email: 'example@email.co.uk',
              phone: '02071234567',
            },
            address: {
              addressLine1: '123 Oxford Street',
              addressLine2: 'Westminster',
              townCity: 'London',
              postcode: 'W1A 1AA',
              country: 'England',
            },
          },
          wasteTypes: [
            {
              ewcCode: '01 03 04',
              wasteDescription: 'waste description',
              physicalForm: 'Solid',
              wasteQuantity: 100,
              quantityUnit: 'Tonne',
              wasteQuantityType: 'ActualData',
              hasHazardousProperties: false,
              containsPops: false,
              chemicalAndBiologicalComponents: [
                {
                  concentration: 1,
                  name: 'test',
                  concentrationUnit: 'Milligram',
                },
              ],
              hazardousWasteCodes: [
                {
                  code: 'HP1',
                  name: 'test',
                },
              ],
              pops: [
                {
                  concentration: 1,
                  name: 'test',
                  concentrationUnit: 'Milligram',
                },
              ],
            },
          ],
          receiver: {
            address: {
              addressLine1: 'Receiver Address Line 1',
              addressLine2: 'Receiver Address Line 2',
              country: 'Receiver Country',
              postcode: 'Receiver Postcode',
              townCity: 'Receiver Town/City',
            },
            contact: {
              email: 'Receiver Email',
              name: 'Receiver Contact Name',
              organisationName: 'Receiver Organisation Name',
              phone: 'Receiver Phone',
            },
            authorizationType: 'permit',
            environmentalPermitNumber: '123456',
          },
          producer: {
            reference: 'ref',
            sicCode: '123456',
            address: {
              addressLine1: 'Producer Address Line 1',
              addressLine2: 'Producer Address Line 2',
              country: 'Producer Country',
              postcode: 'Producer Postcode',
              townCity: 'Producer Town/City',
            },
            contact: {
              email: 'Producer Email',
              name: 'Producer Contact Name',
              organisationName: 'Producer Organisation Name',
              phone: 'Producer Phone',
            },
          },
        },
      ],
    };

    expect(validate(value)).toBe(true);
  });
});

describe('createDraftRequest', () => {
  const validate = ajv.compile<CreateDraftRequest>(createDraftRequest);

  it('is compatible with dto value', () => {
    const value: CreateDraftRequest = {
      accountId: faker.string.uuid(),
      reference: faker.string.sample(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getDraftProducerAddressDetailsRequest', () => {
  const validate = ajv.compile<GetDraftProducerAddressDetailsRequest>(
    getDraftProducerAddressDetailsRequest,
  );

  it('is compatible with dto value', () => {
    const value: GetDraftProducerAddressDetailsRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftProducerAddressDetailsRequest', () => {
  const validate = ajv.compile<SetDraftProducerAddressDetailsRequest>(
    setDraftProducerAddressDetailsRequest,
  );

  it('is compatible with dto value', () => {
    const value: SetDraftProducerAddressDetailsRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
      value: {
        buildingNameOrNumber: '123',
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
      saveAsDraft: false,
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setPartialDraftProducerAddressDetailsRequest', () => {
  const validate = ajv.compile<SetDraftProducerAddressDetailsRequest>(
    setPartialDraftProducerAddressDetailsRequest,
  );

  it('is compatible with dto value', () => {
    const value: SetDraftProducerAddressDetailsRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
      value: {
        buildingNameOrNumber: '123',
      },
      saveAsDraft: true,
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getDraftProducerAddressDetailsResponse', () => {
  const validate = ajv.compile<GetDraftProducerAddressDetailsResponse>(
    getDraftProducerAddressDetailsResponse,
  );

  it('is compatible with dto value', () => {
    const value: GetDraftProducerAddressDetailsResponse = {
      success: true,
      value: {
        status: 'Complete',
        buildingNameOrNumber: '123',
        addressLine1: '123 Oxford Street',
        addressLine2: 'Westminster',
        townCity: 'London',
        postcode: 'W1A 1AA',
        country: 'England',
      },
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setDraftProducerContactDetailRequest', () => {
  const validate = ajv.compile<SetDraftProducerContactDetailRequest>(
    setDraftProducerContactDetailRequest,
  );
  it('is compatible with dto value', () => {
    const value: SetDraftProducerContactDetailRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
      value: {
        organisationName: 'Tech Innovators Inc.',
        name: 'John Doe',
        email: 'john.doe@techinnovators.com',
        phone: '+1234567890',
        fax: '+0987654321',
      },
      saveAsDraft: false,
    };

    expect(validate(value)).toBe(true);
  });
});

describe('setPartialDraftProducerContactDetailRequest', () => {
  const validate = ajv.compile<SetDraftProducerContactDetailRequest>(
    setPartialDraftProducerContactDetailRequest,
  );
  it('is compatible with dto value', () => {
    const value: SetDraftProducerContactDetailRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
      value: {
        name: 'Jane Smith',
        email: 'jane.smith@techinnovators.com',
      },
      saveAsDraft: true,
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getDraftProducerContactDetailRequest', () => {
  const validate = ajv.compile<GetDraftProducerContactDetailRequest>(
    getDraftProducerContactDetailRequest,
  );
  it('is compatible with dto value', () => {
    const value: GetDraftProducerContactDetailRequest = {
      id: faker.string.uuid(),
      accountId: faker.string.uuid(),
    };

    expect(validate(value)).toBe(true);
  });
});

describe('getDraftProducerContactDetailResponse', () => {
  const validate = ajv.compile<GetDraftProducerContactDetailResponse>(
    getDraftProducerContactDetailResponse,
  );
  it('is compatible with dto value', () => {
    const value: GetDraftProducerContactDetailResponse = {
      success: true,
      value: {
        status: 'Complete',
        organisationName: 'Tech Innovators Inc.',
        name: 'John Doe',
        email: 'john.doe@techinnovators.com',
        phone: '01903230482',
        fax: '01903230482',
      },
    };

    expect(validate(value)).toBe(true);
  });
});
