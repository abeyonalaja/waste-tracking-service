import { SchemaObject, JTDSchemaType } from 'ajv/dist/jtd';
import {
  Address,
  Contact,
  WasteTransportationDetail,
  WasteTypeDetail,
  ExpectedWasteCollectionDate,
  WasteCollectionAddress,
  ValidateSubmissionsRequest,
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
      enum: [
        'Household',
        'Commercial',
        'Industrial',
        'LocalAuthority',
        'Demolition',
        'Construction',
      ],
    },
    brokerRegistrationNumber: { type: 'string' },
    carrierRegistrationNumber: { type: 'string' },
    modeOfWasteTransport: {
      enum: ['Road', 'Rail', 'Air', 'Sea', 'InlandWaterways'],
    },
    expectedWasteCollectionDate: wasteCollectionDate,
  },
};

export const receiver: SchemaObject = {
  properties: {
    authorizationType: { type: 'string' },
    environmentalPermitNumber: { type: 'string' },
    contact: contact,
    address: address,
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
  },
  optionalProperties: {
    hazardousWasteCodes: {
      elements: {
        properties: {
          code: { type: 'string' },
          name: { type: 'string' },
          concentration: { type: 'float64' },
          concentrationUnit: { enum: ['Microgram', 'Milligram', 'Kilogram'] },
          unIdentificationNumber: { type: 'string' },
          properShippingName: { type: 'string' },
          unClass: { type: 'string' },
          packageGroup: { type: 'string' },
          specialHandlingRequirements: { type: 'string' },
        },
      },
    },
    pops: {
      elements: {
        properties: {
          name: { type: 'string' },
          concentration: { type: 'float64' },
          concentrationUnit: { enum: ['Microgram', 'Milligram', 'Kilogram'] },
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
            reference: { type: 'string' },
            producerOrganisationName: { type: 'string' },
            producerContactName: { type: 'string' },
            producerEmail: { type: 'string' },
            producerPhone: { type: 'string' },
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
            wasteCollectionDetailsWasteSource: { type: 'string' },
            wasteCollectionDetailsModeOfWasteTransport: { type: 'string' },
            wasteCollectionDetailsExpectedWasteCollectionDate: {
              type: 'string',
            },
          },
          optionalProperties: {
            producerAddressLine2: { type: 'string' },
            producerPostcode: { type: 'string' },
            producerSicCode: { type: 'string' },
            receiverEnvironmentalPermitNumber: { type: 'string' },
            receiverAddressLine2: { type: 'string' },
            receiverPostcode: { type: 'string' },
            wasteTransportationSpecialHandlingRequirements: { type: 'string' },
            wasteCollectionDetailsAddressLine1: { type: 'string' },
            wasteCollectionDetailsAddressLine2: { type: 'string' },
            wasteCollectionDetailsTownCity: { type: 'string' },
            wasteCollectionDetailsPostcode: { type: 'string' },
            wasteCollectionDetailsCountry: { type: 'string' },
            wasteCollectionDetailsBrokerRegistrationNumber: { type: 'string' },
            wasteCollectionDetailsCarrierRegistrationNumber: { type: 'string' },
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
          wasteTransportation,
          wasteType: {
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
