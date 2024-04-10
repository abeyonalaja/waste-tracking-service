import { SchemaObject, JTDSchemaType } from 'ajv/dist/jtd';
import { Address, Contact } from './submission.dto';

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

export const receiver: SchemaObject = {
  properties: {
    authorizationType: { type: 'string' },
    environmentalPermitNumber: { type: 'string' },
    contact: contact,
    address: address,
  },
};

export const wasteTypeDetails: SchemaObject = {
  properties: {
    ewcCode: { type: 'string' },
    wasteDescription: { type: 'string' },
    physicalForm: {
      enum: ['Gas', 'Liquid', 'Solid', 'Sludge', 'Powder', 'Mixed'],
    },
    wasteQuantity: { type: 'float64' },
    quantityUnits: {
      enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
    },
    wasteQuantityType: { enum: ['EstimateData', 'ActualData'] },
    haveHazardousProperties: { type: 'boolean' },
    containsPop: { type: 'boolean' },
  },
  optionalProperties: {
    hazardousPropertiesCode: { type: 'string' },
    popDetails: { type: 'string' },
  },
};

export const validateSubmissionsRequest: SchemaObject = {
  properties: {
    accountId: { type: 'string' },
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
        },
        optionalProperties: {
          producerAddressLine2: { type: 'string' },
          producerPostcode: { type: 'string' },
          producerSicCode: { type: 'string' },
          receiverAuthorizationType: { type: 'string' },
          receiverEnvironmentalPermitNumber: { type: 'string' },
          receiverOrganisationName: { type: 'string' },
          receiverContactName: { type: 'string' },
          receiverContactEmail: { type: 'string' },
          receiverContactPhone: { type: 'string' },
          receiverAddressLine1: { type: 'string' },
          receiverAddressLine2: { type: 'string' },
          receiverTownCity: { type: 'string' },
          receiverPostcode: { type: 'string' },
          receiverCountry: { type: 'string' },
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
          receiver: receiver,
          wasteTypeDetails: {
            elements: {
              ...wasteTypeDetails,
            },
          },
          index: { type: 'uint16' },
          fieldFormatErrors: {
            elements: {
              properties: {
                field: {
                  enum: [
                    'WasteCollectionDetails',
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
