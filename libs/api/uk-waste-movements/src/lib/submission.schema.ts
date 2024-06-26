import { SchemaObject, JTDSchemaType } from 'ajv/dist/jtd';
import {
  Address,
  Contact,
  WasteTransportationDetail,
  WasteTypeDetail,
  ExpectedWasteCollectionDate,
  WasteCollectionAddress,
  ValidateSubmissionsRequest,
  CarrierDetail,
} from './submission.dto';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

export const address: JTDSchemaType<Address> = {
  properties: {
    addressLine1: { type: 'string' },
    townCity: { type: 'string' },
    country: { type: 'string' },
  },
  optionalProperties: {
    addressLine2: { type: 'string' },
    postcode: { type: 'string' },
  },
};

export const wasteCollectionAddress: JTDSchemaType<WasteCollectionAddress> = {
  optionalProperties: {
    addressLine1: { type: 'string' },
    addressLine2: { type: 'string' },
    townCity: { type: 'string' },
    country: { type: 'string' },
    postcode: { type: 'string' },
  },
};

export const wasteCollectionDate: JTDSchemaType<ExpectedWasteCollectionDate> = {
  properties: {
    day: { type: 'string' },
    month: { type: 'string' },
    year: { type: 'string' },
  },
};

export const contact: JTDSchemaType<Contact> = {
  properties: {
    organisationName: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
  },
};

export const carrier: JTDSchemaType<CarrierDetail> = {
  properties: {
    contact: contact,
    address: address,
  },
};

export const producer: SchemaObject = {
  properties: {
    reference: { type: 'string' },
    contact: contact,
    address: address,
  },
  optionalProperties: {
    sicCode: { type: 'string' },
  },
};

export const wasteCollection: SchemaObject = {
  properties: {
    address: wasteCollectionAddress,
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

export const receiver: SchemaObject = {
  properties: {
    authorizationType: { type: 'string' },
    contact: contact,
    address: address,
  },
  optionalProperties: {
    environmentalPermitNumber: { type: 'string' },
  },
};

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

export const wasteTransportation: JTDSchemaType<WasteTransportationDetail> = {
  properties: {
    numberAndTypeOfContainers: { type: 'string' },
  },
  optionalProperties: {
    specialHandlingRequirements: { type: 'string' },
  },
};

export const validateSubmissionsRequest: JTDSchemaType<ValidateSubmissionsRequest> =
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

export const validateSubmissionsResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: validationResult,
  },
};

export const submissionState: SchemaObject = {
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

export const createSubmissionsRequest: SchemaObject = {
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
