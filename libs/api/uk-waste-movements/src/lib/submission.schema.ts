import { SchemaObject } from 'ajv/dist/jtd';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

export const address: SchemaObject = {
  properties: {
    addressLine1: { type: 'string' },
    addressLine2: { type: 'string' },
    townCity: { type: 'string' },
    postcode: { type: 'string' },
    country: { type: 'string' },
  },
};

export const contact: SchemaObject = {
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
    sicCode: { type: 'string' },
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
      enum: ['Kilograms', 'Litres', 'Tonnes', 'Cubic metres'],
    },
    wasteQuantityType: { enum: ['EstimateData', 'ActualData'] },
    haveHazardousProperties: { type: 'boolean' },
    containsPop: { type: 'boolean' },
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
          producerAddressLine2: { type: 'string' },
          producerTownCity: { type: 'string' },
          producerPostcode: { type: 'string' },
          producerCountry: { type: 'string' },
          producerSicCode: { type: 'string' },
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
                    'Receiver',
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
                          'WasteCollectionDetails',
                          'Receiver',
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
