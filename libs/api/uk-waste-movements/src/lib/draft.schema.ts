import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';

import {
  DraftCarrier,
  GetDraftsRequest,
  GetDraftsResult,
  Address,
  Contact,
  ExpectedWasteCollectionDate,
  ProducerDetail,
  WasteTypeDetail,
  CarrierDetail,
  ValidateMultipleDraftsRequest,
  CreateDraftRequest,
  DraftContact,
  DraftAddress,
  DraftModeOfTransport,
  DraftSicCodes,
} from './draft.dto';

export const wasteType: JTDSchemaType<WasteTypeDetail> = {
  properties: {
    ewcCode: { type: 'string' },
    wasteDescription: { type: 'string' },
    physicalForm: {
      enum: ['Gas', 'Liquid', 'Solid', 'Sludge', 'Powder', 'Mixed'],
    },
    wasteQuantity: { type: 'float64' },
    quantityUnit: {
      enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
    },
    wasteQuantityType: { enum: ['EstimateData', 'ActualData'] },
    hasHazardousProperties: { type: 'boolean' },
    containsPops: { type: 'boolean' },
    chemicalAndBiologicalComponents: {
      elements: {
        properties: {
          name: { type: 'string' },
          concentration: { type: 'float64' },
          concentrationUnit: { type: 'string' },
        },
      },
    },
  },
  optionalProperties: {
    hazardousWasteCodes: {
      elements: {
        properties: {
          code: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
    pops: {
      elements: {
        properties: {
          name: { type: 'string' },
          concentration: { type: 'float64' },
          concentrationUnit: { type: 'string' },
        },
      },
    },
  },
};

export const wasteTransportation: SchemaObject = {
  properties: {
    numberAndTypeOfContainers: { type: 'string' },
  },
  optionalProperties: {
    specialHandlingRequirements: { type: 'string' },
  },
};

export const wasteInformation: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Complete: {
      properties: {
        wasteTypes: {
          elements: wasteType,
        },
        wasteTransportation: wasteTransportation,
      },
    },
  },
};

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

const address: JTDSchemaType<Address> = {
  properties: {
    addressLine1: { type: 'string' },
    townCity: { type: 'string' },
    country: { type: 'string' },
  },
  optionalProperties: {
    buildingNameOrNumber: { type: 'string' },
    addressLine2: { type: 'string' },
    postcode: { type: 'string' },
  },
};

const partialAddress: JTDSchemaType<Partial<Address>> = {
  properties: {},
  optionalProperties: {
    buildingNameOrNumber: { type: 'string' },
    addressLine1: { type: 'string' },
    addressLine2: { type: 'string' },
    townCity: { type: 'string' },
    country: { type: 'string' },
    postcode: { type: 'string' },
  },
};

const contact: JTDSchemaType<Contact> = {
  properties: {
    organisationName: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
  },
  optionalProperties: { fax: { type: 'string' } },
};

const partialContact: JTDSchemaType<Partial<Contact>> = {
  properties: {},
  optionalProperties: {
    organisationName: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    fax: { type: 'string' },
  },
};

export const receiver: SchemaObject = {
  properties: {
    environmentalPermitNumber: { type: 'string' },
    contact: contact,
    address: address,
  },
  optionalProperties: {
    authorizationType: { type: 'string' },
  },
};

const draftReceiver: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Complete: {
      properties: {
        value: receiver,
      },
    },
  },
};

export const producer: JTDSchemaType<ProducerDetail> = {
  properties: {
    reference: { type: 'string' },
    contact: contact,
    address: address,
  },
  optionalProperties: {
    sicCode: { type: 'string' },
  },
};

export const wasteCollectionDate: JTDSchemaType<ExpectedWasteCollectionDate> = {
  properties: {
    day: { type: 'string' },
    month: { type: 'string' },
    year: { type: 'string' },
  },
};

export const wasteCollection: SchemaObject = {
  properties: {
    address: address,
    wasteSource: {
      enum: ['Household', 'Commercial'],
    },
    localAuthority: { type: 'string' },
    expectedWasteCollectionDate: wasteCollectionDate,
  },
  optionalProperties: {
    brokerRegistrationNumber: { type: 'string' },
    carrierRegistrationNumber: { type: 'string' },
  },
};

export const draftAddress: JTDSchemaType<DraftAddress> = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      optionalProperties: {
        ...address.properties,
        ...address.optionalProperties,
      },
    },
    Complete: {
      properties: address.properties,
      optionalProperties: address.optionalProperties,
    },
  },
};

export const draftContact: JTDSchemaType<DraftContact> = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Started: {
      optionalProperties: {
        ...contact.properties,
        ...contact.optionalProperties,
      },
    },
    Complete: {
      properties: contact.properties,
      optionalProperties: contact.optionalProperties,
    },
  },
};

export const draftSicCodes: JTDSchemaType<DraftSicCodes> = {
  properties: {
    status: { enum: ['NotStarted', 'Complete'] },
    values: {
      elements: { type: 'string' },
    },
  },
};

export const draftProducer: SchemaObject = {
  properties: {
    reference: { type: 'string' },
    address: draftAddress,
    contact: draftContact,
    sicCodes: draftSicCodes,
  },
  optionalProperties: {},
};

export const draftWasteSource: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: {
      properties: {},
    },
    Complete: {
      properties: {
        value: { type: 'string' },
      },
    },
  },
};

export const wasteSource: SchemaObject = {
  properties: { wasteSource: { type: 'string' } },
};

export const draftWasteCollection: SchemaObject = {
  properties: {
    address: draftAddress,
    wasteSource: draftWasteSource,
  },
  optionalProperties: {
    localAuthority: { type: 'string' },
    expectedWasteCollectionDate: wasteCollectionDate,
    brokerRegistrationNumber: { type: 'string' },
    carrierRegistrationNumber: { type: 'string' },
  },
};

export const producerAndWasteCollectionDetail: SchemaObject = {
  discriminator: 'status',
  mapping: {
    NotStarted: { properties: {} },
    Complete: {
      properties: {
        producer: draftProducer,
        wasteCollection: draftWasteCollection,
      },
    },
  },
};

export const draftWasteTransport: JTDSchemaType<DraftModeOfTransport> = {
  discriminator: 'status',
  mapping: {
    NotStarted: { properties: {} },
    Complete: {
      properties: {
        value: { enum: ['Road', 'Rail', 'Sea', 'Air', 'InlandWaterways'] },
      },
    },
  },
};

export const carrier: JTDSchemaType<CarrierDetail> = {
  properties: {
    contact: contact,
    address: address,
  },
};

export const draftCarrier: JTDSchemaType<DraftCarrier> = {
  properties: {
    address: draftAddress,
    contact: draftContact,
    modeOfTransport: draftWasteTransport,
  },
};

export const declaration: SchemaObject = {
  discriminator: 'status',
  mapping: {
    CannotStart: {
      properties: {},
    },
    NotStarted: {
      properties: {},
    },
    Complete: {
      properties: {
        value: {
          properties: {
            declarationTimestamp: { type: 'timestamp' },
            transactionId: { type: 'string' },
          },
        },
      },
    },
  },
};

export const state: SchemaObject = {
  discriminator: 'status',
  mapping: {
    SubmittedWithEstimates: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
    SubmittedWithActuals: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
    UpdatedWithActuals: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
  },
};

export const draftSubmission: SchemaObject = {
  properties: {
    id: { type: 'string' },
    wasteInformation: wasteInformation,
    receiver: draftReceiver,
    producerAndCollection: producerAndWasteCollectionDetail,
    carrier: draftCarrier,
    declaration: declaration,
    state: state,
  },
};

export const getDraftResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftSubmission,
  },
};

export const getDraftsRequest: JTDSchemaType<GetDraftsRequest> = {
  properties: {
    page: { type: 'int32' },
  },
  optionalProperties: {
    collectionDate: { type: 'timestamp' },
    ewcCode: { type: 'string' },
    producerName: { type: 'string' },
    wasteMovementId: { type: 'string' },
    pageSize: { type: 'int32' },
  },
};

const getDraftsResult: JTDSchemaType<GetDraftsResult> = {
  properties: {
    totalRecords: { type: 'int32' },
    totalPages: { type: 'int32' },
    page: { type: 'int32' },
    values: {
      elements: {
        properties: {
          id: { type: 'string' },
          wasteMovementId: { type: 'string' },
          producerName: { type: 'string' },
          ewcCode: { type: 'string' },
          collectionDate: {
            properties: {
              day: { type: 'string' },
              month: { type: 'string' },
              year: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

export const getDraftsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: getDraftsResult,
  },
};

export const validateMultipleDraftsRequest: JTDSchemaType<ValidateMultipleDraftsRequest> =
  {
    properties: {
      accountId: { type: 'string' },
      padIndex: { type: 'uint16' },
      values: {
        elements: {
          properties: {
            customerReference: { type: 'string' },
            producerOrganisationName: { type: 'string' },
            producerContactName: { type: 'string' },
            producerContactEmail: { type: 'string' },
            producerContactPhone: { type: 'string' },
            producerAddressLine1: { type: 'string' },
            producerTownCity: { type: 'string' },
            producerCountry: { type: 'string' },
            receiverAuthorizationType: { type: 'string' },
            receiverOrganisationName: { type: 'string' },
            receiverContactName: { type: 'string' },
            receiverContactEmail: { type: 'string' },
            receiverContactPhone: { type: 'string' },
            receiverAddressLine1: { type: 'string' },
            receiverTownCity: { type: 'string' },
            receiverCountry: { type: 'string' },
            wasteTransportationNumberAndTypeOfContainers: { type: 'string' },
            wasteCollectionWasteSource: { type: 'string' },
            wasteCollectionExpectedWasteCollectionDate: {
              type: 'string',
            },
            wasteCollectionLocalAuthority: { type: 'string' },
            firstWasteTypeEwcCode: { type: 'string' },
            firstWasteTypeWasteDescription: { type: 'string' },
            firstWasteTypePhysicalForm: { type: 'string' },
            firstWasteTypeWasteQuantity: { type: 'string' },
            firstWasteTypeWasteQuantityUnit: { type: 'string' },
            firstWasteTypeWasteQuantityType: { type: 'string' },
            firstWasteTypeChemicalAndBiologicalComponentsString: {
              type: 'string',
            },
            firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString: {
              type: 'string',
            },
            firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              { type: 'string' },
            firstWasteTypeHasHazardousProperties: { type: 'string' },
            firstWasteTypeContainsPops: { type: 'string' },
          },
          optionalProperties: {
            producerAddressLine2: { type: 'string' },
            producerPostcode: { type: 'string' },
            producerSicCode: { type: 'string' },
            receiverEnvironmentalPermitNumber: { type: 'string' },
            receiverAddressLine2: { type: 'string' },
            receiverPostcode: { type: 'string' },
            wasteTransportationSpecialHandlingRequirements: { type: 'string' },
            wasteCollectionAddressLine1: { type: 'string' },
            wasteCollectionAddressLine2: { type: 'string' },
            wasteCollectionTownCity: { type: 'string' },
            wasteCollectionPostcode: { type: 'string' },
            wasteCollectionCountry: { type: 'string' },
            wasteCollectionBrokerRegistrationNumber: { type: 'string' },
            wasteCollectionCarrierRegistrationNumber: { type: 'string' },
            carrierAddressLine1: { type: 'string' },
            carrierAddressLine2: { type: 'string' },
            carrierTownCity: { type: 'string' },
            carrierContactEmail: { type: 'string' },
            carrierContactName: { type: 'string' },
            carrierContactPhone: { type: 'string' },
            carrierCountry: { type: 'string' },
            carrierOrganisationName: { type: 'string' },
            carrierPostcode: { type: 'string' },
            firstWasteTypeHazardousWasteCodesString: { type: 'string' },
            firstWasteTypePopsConcentrationsString: { type: 'string' },
            firstWasteTypePopsConcentrationUnitsString: { type: 'string' },
            firstWasteTypePopsString: { type: 'string' },
            secondWasteTypeEwcCode: { type: 'string' },
            secondWasteTypeWasteDescription: { type: 'string' },
            secondWasteTypePhysicalForm: { type: 'string' },
            secondWasteTypeWasteQuantity: { type: 'string' },
            secondWasteTypeWasteQuantityUnit: { type: 'string' },
            secondWasteTypeWasteQuantityType: { type: 'string' },
            secondWasteTypeChemicalAndBiologicalComponentsString: {
              type: 'string',
            },
            secondWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
              { type: 'string' },
            secondWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              { type: 'string' },
            secondWasteTypeHasHazardousProperties: { type: 'string' },
            secondWasteTypeHazardousWasteCodesString: { type: 'string' },
            secondWasteTypeContainsPops: { type: 'string' },
            secondWasteTypePopsString: { type: 'string' },
            secondWasteTypePopsConcentrationsString: { type: 'string' },
            secondWasteTypePopsConcentrationUnitsString: { type: 'string' },
            thirdWasteTypeEwcCode: { type: 'string' },
            thirdWasteTypeWasteDescription: { type: 'string' },
            thirdWasteTypePhysicalForm: { type: 'string' },
            thirdWasteTypeWasteQuantity: { type: 'string' },
            thirdWasteTypeWasteQuantityUnit: { type: 'string' },
            thirdWasteTypeWasteQuantityType: { type: 'string' },
            thirdWasteTypeChemicalAndBiologicalComponentsString: {
              type: 'string',
            },
            thirdWasteTypeChemicalAndBiologicalComponentsConcentrationsString: {
              type: 'string',
            },
            thirdWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              { type: 'string' },
            thirdWasteTypeHasHazardousProperties: { type: 'string' },
            thirdWasteTypeHazardousWasteCodesString: { type: 'string' },
            thirdWasteTypeContainsPops: { type: 'string' },
            thirdWasteTypePopsString: { type: 'string' },
            thirdWasteTypePopsConcentrationsString: { type: 'string' },
            thirdWasteTypePopsConcentrationUnitsString: { type: 'string' },
            fourthWasteTypeEwcCode: { type: 'string' },
            fourthWasteTypeWasteDescription: { type: 'string' },
            fourthWasteTypePhysicalForm: { type: 'string' },
            fourthWasteTypeWasteQuantity: { type: 'string' },
            fourthWasteTypeWasteQuantityUnit: { type: 'string' },
            fourthWasteTypeWasteQuantityType: { type: 'string' },
            fourthWasteTypeChemicalAndBiologicalComponentsString: {
              type: 'string',
            },
            fourthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
              { type: 'string' },
            fourthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              { type: 'string' },
            fourthWasteTypeHasHazardousProperties: { type: 'string' },
            fourthWasteTypeHazardousWasteCodesString: { type: 'string' },
            fourthWasteTypeContainsPops: { type: 'string' },
            fourthWasteTypePopsString: { type: 'string' },
            fourthWasteTypePopsConcentrationsString: { type: 'string' },
            fourthWasteTypePopsConcentrationUnitsString: { type: 'string' },
            fifthWasteTypeEwcCode: { type: 'string' },
            fifthWasteTypeWasteDescription: { type: 'string' },
            fifthWasteTypePhysicalForm: { type: 'string' },
            fifthWasteTypeWasteQuantity: { type: 'string' },
            fifthWasteTypeWasteQuantityUnit: { type: 'string' },
            fifthWasteTypeWasteQuantityType: { type: 'string' },
            fifthWasteTypeChemicalAndBiologicalComponentsString: {
              type: 'string',
            },
            fifthWasteTypeChemicalAndBiologicalComponentsConcentrationsString: {
              type: 'string',
            },
            fifthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              { type: 'string' },
            fifthWasteTypeHasHazardousProperties: { type: 'string' },
            fifthWasteTypeHazardousWasteCodesString: { type: 'string' },
            fifthWasteTypeContainsPops: { type: 'string' },
            fifthWasteTypePopsString: { type: 'string' },
            fifthWasteTypePopsConcentrationsString: { type: 'string' },
            fifthWasteTypePopsConcentrationUnitsString: { type: 'string' },
            sixthWasteTypeEwcCode: { type: 'string' },
            sixthWasteTypeWasteDescription: { type: 'string' },
            sixthWasteTypePhysicalForm: { type: 'string' },
            sixthWasteTypeWasteQuantity: { type: 'string' },
            sixthWasteTypeWasteQuantityUnit: { type: 'string' },
            sixthWasteTypeWasteQuantityType: { type: 'string' },
            sixthWasteTypeChemicalAndBiologicalComponentsString: {
              type: 'string',
            },
            sixthWasteTypeChemicalAndBiologicalComponentsConcentrationsString: {
              type: 'string',
            },
            sixthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              { type: 'string' },
            sixthWasteTypeHasHazardousProperties: { type: 'string' },
            sixthWasteTypeHazardousWasteCodesString: { type: 'string' },
            sixthWasteTypeContainsPops: { type: 'string' },
            sixthWasteTypePopsString: { type: 'string' },
            sixthWasteTypePopsConcentrationsString: { type: 'string' },
            sixthWasteTypePopsConcentrationUnitsString: { type: 'string' },
            seventhWasteTypeEwcCode: { type: 'string' },
            seventhWasteTypeWasteDescription: { type: 'string' },
            seventhWasteTypePhysicalForm: { type: 'string' },
            seventhWasteTypeWasteQuantity: { type: 'string' },
            seventhWasteTypeWasteQuantityUnit: { type: 'string' },
            seventhWasteTypeWasteQuantityType: { type: 'string' },
            seventhWasteTypeChemicalAndBiologicalComponentsString: {
              type: 'string',
            },
            seventhWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
              { type: 'string' },
            seventhWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              { type: 'string' },
            seventhWasteTypeHasHazardousProperties: { type: 'string' },
            seventhWasteTypeHazardousWasteCodesString: { type: 'string' },
            seventhWasteTypeContainsPops: { type: 'string' },
            seventhWasteTypePopsString: { type: 'string' },
            seventhWasteTypePopsConcentrationsString: { type: 'string' },
            seventhWasteTypePopsConcentrationUnitsString: { type: 'string' },
            eighthWasteTypeEwcCode: { type: 'string' },
            eighthWasteTypeWasteDescription: { type: 'string' },
            eighthWasteTypePhysicalForm: { type: 'string' },
            eighthWasteTypeWasteQuantity: { type: 'string' },
            eighthWasteTypeWasteQuantityUnit: { type: 'string' },
            eighthWasteTypeWasteQuantityType: { type: 'string' },
            eighthWasteTypeChemicalAndBiologicalComponentsString: {
              type: 'string',
            },
            eighthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
              { type: 'string' },
            eighthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              { type: 'string' },
            eighthWasteTypeHasHazardousProperties: { type: 'string' },
            eighthWasteTypeHazardousWasteCodesString: { type: 'string' },
            eighthWasteTypeContainsPops: { type: 'string' },
            eighthWasteTypePopsString: { type: 'string' },
            eighthWasteTypePopsConcentrationsString: { type: 'string' },
            eighthWasteTypePopsConcentrationUnitsString: { type: 'string' },
            ninthWasteTypeEwcCode: { type: 'string' },
            ninthWasteTypeWasteDescription: { type: 'string' },
            ninthWasteTypePhysicalForm: { type: 'string' },
            ninthWasteTypeWasteQuantity: { type: 'string' },
            ninthWasteTypeWasteQuantityUnit: { type: 'string' },
            ninthWasteTypeWasteQuantityType: { type: 'string' },
            ninthWasteTypeChemicalAndBiologicalComponentsString: {
              type: 'string',
            },
            ninthWasteTypeChemicalAndBiologicalComponentsConcentrationsString: {
              type: 'string',
            },
            ninthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              { type: 'string' },
            ninthWasteTypeHasHazardousProperties: { type: 'string' },
            ninthWasteTypeHazardousWasteCodesString: { type: 'string' },
            ninthWasteTypeContainsPops: { type: 'string' },
            ninthWasteTypePopsString: { type: 'string' },
            ninthWasteTypePopsConcentrationsString: { type: 'string' },
            ninthWasteTypePopsConcentrationUnitsString: { type: 'string' },
            tenthWasteTypeEwcCode: { type: 'string' },
            tenthWasteTypeWasteDescription: { type: 'string' },
            tenthWasteTypePhysicalForm: { type: 'string' },
            tenthWasteTypeWasteQuantity: { type: 'string' },
            tenthWasteTypeWasteQuantityUnit: { type: 'string' },
            tenthWasteTypeWasteQuantityType: { type: 'string' },
            tenthWasteTypeChemicalAndBiologicalComponentsString: {
              type: 'string',
            },
            tenthWasteTypeChemicalAndBiologicalComponentsConcentrationsString: {
              type: 'string',
            },
            tenthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
              { type: 'string' },
            tenthWasteTypeHasHazardousProperties: { type: 'string' },
            tenthWasteTypeHazardousWasteCodesString: { type: 'string' },
            tenthWasteTypeContainsPops: { type: 'string' },
            tenthWasteTypePopsString: { type: 'string' },
            tenthWasteTypePopsConcentrationsString: { type: 'string' },
            tenthWasteTypePopsConcentrationUnitsString: { type: 'string' },
          },
        },
      },
    },
  };

const validationResult: SchemaObject = {
  properties: {
    valid: { type: 'boolean' },
    accountId: { type: 'string' },
    values: {
      elements: {
        optionalProperties: {
          producer: producer,
          wasteCollection: wasteCollection,
          receiver: receiver,
          carrier,
          wasteTransportation,
          wasteTypes: {
            elements: {
              ...wasteType,
            },
          },
          index: { type: 'uint16' },
          fieldFormatErrors: {
            elements: {
              properties: {
                field: {
                  enum: [
                    'WasteTransportation',
                    'WasteTypeDetails',
                    'Reference',
                    'Producer organisation name',
                    'Producer address line 1',
                    'Producer address line 2',
                    'Producer town or city',
                    'Producer country',
                    'Producer postcode',
                    'Producer contact name',
                    'Producer contact email address',
                    'Producer contact phone number',
                    'Producer Standard Industrial Classification (SIC) code',
                    'Waste Collection Details Address Line 1',
                    'Waste Collection Details Address Line 2',
                    'Waste Collection Details Town or City',
                    'Waste Collection Details Country',
                    'Waste Collection Details Postcode',
                    'Waste Collection Details Waste Source',
                    'Waste Collection Details Broker Registration Number',
                    'Waste Collection Details Carrier Registration Number',
                    'Waste Collection Details Mode of Waste Transport',
                    'Waste Collection Details Expected Waste Collection Date',
                    'Receiver authorization type',
                    'Receiver environmental permit number',
                    'Receiver organisation name',
                    'Receiver address line 1',
                    'Receiver address line 2',
                    'Receiver town or city',
                    'Receiver country',
                    'Receiver postcode',
                    'Receiver contact name',
                    'Receiver contact email address',
                    'Receiver contact phone number',
                  ],
                },
                message: { type: 'string' },
              },
            },
          },
          invalidStructureErrors: {
            elements: {
              properties: {
                fields: {
                  elements: {
                    properties: {
                      field: {
                        enum: [
                          'WasteTransportation',
                          'WasteTypeDetails',
                          'Reference',
                          'Producer organisation name',
                          'Producer address line 1',
                          'Producer address line 2',
                          'Producer town or city',
                          'Producer country',
                          'Producer postcode',
                          'Producer contact name',
                          'Producer contact email address',
                          'Producer contact phone number',
                          'Producer Standard Industrial Classification (SIC) code',
                          'Waste Collection Details Address Line 1',
                          'Waste Collection Details Address Line 2',
                          'Waste Collection Details Town or City',
                          'Waste Collection Details Country',
                          'Waste Collection Details Postcode',
                          'Waste Collection Details Waste Source',
                          'Waste Collection Details Broker Registration Number',
                          'Waste Collection Details Carrier Registration Number',
                          'Waste Collection Details Mode of Waste Transport',
                          'Waste Collection Details Expected Waste Collection Date',
                          'Receiver authorization type',
                          'Receiver environmental permit number',
                          'Receiver organisation name',
                          'Receiver address line 1',
                          'Receiver address line 2',
                          'Receiver town or city',
                          'Receiver country',
                          'Receiver postcode',
                          'Receiver contact name',
                          'Receiver contact email address',
                          'Receiver contact phone number',
                        ],
                      },
                      message: { type: 'string' },
                    },
                  },
                },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

export const validateMultipleDraftsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: validationResult,
  },
};

export const createMultipleDraftsRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    values: {
      elements: {
        properties: {
          producer: producer,
          wasteCollection: wasteCollection,
          carrier,
          receiver: receiver,
          wasteTransportation: wasteTransportation,
          wasteTypes: {
            elements: {
              ...wasteType,
            },
          },
        },
        optionalProperties: {
          id: { type: 'string' },
          transactionId: { type: 'string' },
        },
      },
    },
  },
};

export const setDraftProducerContactDetailRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: contact,
    saveAsDraft: { type: 'boolean' },
  },
};

export const setPartialDraftProducerContactDetailRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    value: partialContact,
    saveAsDraft: { type: 'boolean' },
  },
};

export const getDraftProducerContactDetailRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const getDraftProducerContactDetailResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftContact,
  },
};

export const createDraftRequest: JTDSchemaType<CreateDraftRequest> = {
  properties: {
    accountId: { type: 'string' },
    reference: { type: 'string' },
  },
};

export const getDraftProducerAddressDetailsRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    id: { type: 'string' },
  },
};

export const setDraftProducerAddressDetailsRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    id: { type: 'string' },
    value: address,
    saveAsDraft: { type: 'boolean' },
  },
};

export const setPartialDraftProducerAddressDetailsRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    id: { type: 'string' },
    value: partialAddress,
    saveAsDraft: { type: 'boolean' },
  },
};

export const getDraftProducerAddressDetailsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftAddress,
  },
};

export const setDraftProducerAddressDetailsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
  },
};

export const getDraftWasteSourceRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
    id: { type: 'string' },
  },
};

export const getDraftWasteSourceResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: draftWasteSource,
  },
};

export const setDraftWasteSourceRequest: SchemaObject = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
    wasteSource: { type: 'string' },
  },
};
