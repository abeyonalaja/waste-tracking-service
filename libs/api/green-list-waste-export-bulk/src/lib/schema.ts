import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  AddContentToBatchRequest,
  GetBatchContentRequest,
  GetBatchRequest,
  UpdateBatchRequest,
} from './dto';
import { submission } from '@wts/api/green-list-waste-export';

const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

export const wasteDescription: SchemaObject = {
  properties: {
    wasteCode: {
      discriminator: 'type',
      mapping: {
        NotApplicable: { properties: {} },
        BaselAnnexIX: { properties: { code: { type: 'string' } } },
        OECD: { properties: { code: { type: 'string' } } },
        AnnexIIIA: { properties: { code: { type: 'string' } } },
        AnnexIIIB: { properties: { code: { type: 'string' } } },
      },
    },
    ewcCodes: {
      elements: {
        properties: {
          code: {
            type: 'string',
          },
        },
      },
    },
    description: { type: 'string' },
  },
  optionalProperties: {
    nationalCode: {
      discriminator: 'provided',
      mapping: {
        Yes: { properties: { value: { type: 'string' } } },
        No: { properties: {} },
      },
    },
  },
};

export const wasteQuantity: SchemaObject = {
  discriminator: 'type',
  mapping: {
    NotApplicable: { properties: {} },
    EstimateData: {
      properties: {
        estimateData: {
          optionalProperties: {
            quantityType: { enum: ['Volume', 'Weight'] },
            unit: {
              enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
            },
            value: { type: 'float64' },
          },
        },
        actualData: {
          optionalProperties: {
            quantityType: { enum: ['Volume', 'Weight'] },
            unit: {
              enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
            },
            value: { type: 'float64' },
          },
        },
      },
    },
    ActualData: {
      properties: {
        estimateData: {
          optionalProperties: {
            quantityType: { enum: ['Volume', 'Weight'] },
            unit: {
              enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
            },
            value: { type: 'float64' },
          },
        },
        actualData: {
          optionalProperties: {
            quantityType: { enum: ['Volume', 'Weight'] },
            unit: {
              enum: ['Tonne', 'Cubic Metre', 'Kilogram', 'Litre'],
            },
            value: { type: 'float64' },
          },
        },
      },
    },
  },
};

export const exporterDetail: SchemaObject = {
  properties: {
    exporterAddress: {
      properties: {
        addressLine1: { type: 'string' },
        townCity: { type: 'string' },
        country: { type: 'string' },
      },
      optionalProperties: {
        addressLine2: { type: 'string' },
        postcode: { type: 'string' },
      },
    },
    exporterContactDetails: {
      properties: {
        organisationName: { type: 'string' },
        fullName: { type: 'string' },
        emailAddress: { type: 'string' },
        phoneNumber: { type: 'string' },
      },
      optionalProperties: {
        faxNumber: { type: 'string' },
      },
    },
  },
};

export const importerDetail: SchemaObject = {
  properties: {
    importerAddressDetails: {
      properties: {
        organisationName: { type: 'string' },
        address: { type: 'string' },
        country: { type: 'string' },
      },
    },
    importerContactDetails: {
      properties: {
        fullName: { type: 'string' },
        emailAddress: { type: 'string' },
        phoneNumber: { type: 'string' },
      },
      optionalProperties: {
        faxNumber: { type: 'string' },
      },
    },
  },
};

export const collectionDate: SchemaObject = {
  properties: {
    type: { enum: ['EstimateDate', 'ActualDate'] },
    estimateDate: {
      optionalProperties: {
        day: { type: 'string' },
        month: { type: 'string' },
        year: { type: 'string' },
      },
    },
    actualDate: {
      optionalProperties: {
        day: { type: 'string' },
        month: { type: 'string' },
        year: { type: 'string' },
      },
    },
  },
};

export const carriers: SchemaObject = {
  elements: {
    properties: {
      addressDetails: {
        properties: {
          organisationName: { type: 'string' },
          address: { type: 'string' },
          country: { type: 'string' },
        },
      },
      contactDetails: {
        properties: {
          fullName: { type: 'string' },
          emailAddress: { type: 'string' },
          phoneNumber: { type: 'string' },
        },
        optionalProperties: {
          faxNumber: { type: 'string' },
        },
      },
    },
    optionalProperties: {
      transportDetails: {
        properties: {
          type: { enum: ['Road', 'Air', 'Sea', 'Rail', 'InlandWaterways'] },
        },
        optionalProperties: {
          description: { type: 'string' },
        },
      },
    },
  },
};

export const collectionDetail: SchemaObject = {
  properties: {
    address: {
      properties: {
        addressLine1: { type: 'string' },
        townCity: { type: 'string' },
        country: { type: 'string' },
      },
      optionalProperties: {
        addressLine2: { type: 'string' },
        postcode: { type: 'string' },
      },
    },
    contactDetails: {
      properties: {
        organisationName: { type: 'string' },
        fullName: { type: 'string' },
        emailAddress: { type: 'string' },
        phoneNumber: { type: 'string' },
      },
      optionalProperties: {
        faxNumber: { type: 'string' },
      },
    },
  },
};

export const ukExitLocation: SchemaObject = {
  discriminator: 'provided',
  mapping: {
    Yes: { properties: { value: { type: 'string' } } },
    No: { properties: {} },
  },
};

export const transitCountries: SchemaObject = {
  elements: { type: 'string' },
};

export const recoveryFacilityDetail: SchemaObject = {
  elements: {
    properties: {
      addressDetails: {
        properties: {
          name: { type: 'string' },
          address: { type: 'string' },
          country: { type: 'string' },
        },
      },
      contactDetails: {
        properties: {
          fullName: { type: 'string' },
          emailAddress: { type: 'string' },
          phoneNumber: { type: 'string' },
        },
        optionalProperties: {
          faxNumber: { type: 'string' },
        },
      },
      recoveryFacilityType: {
        discriminator: 'type',
        mapping: {
          Laboratory: {
            properties: {
              disposalCode: { type: 'string' },
            },
          },
          InterimSite: {
            properties: {
              recoveryCode: { type: 'string' },
            },
          },
          RecoveryFacility: {
            properties: {
              recoveryCode: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

const bulkSubmissionState: SchemaObject = {
  discriminator: 'status',
  mapping: {
    Processing: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
    FailedCsvValidation: {
      properties: {
        timestamp: { type: 'timestamp' },
        error: { type: 'string' },
      },
    },
    FailedValidation: {
      properties: {
        timestamp: { type: 'timestamp' },
        rowErrors: {
          elements: {
            properties: {
              rowNumber: { type: 'uint16' },
              errorAmount: { type: 'uint16' },
              errorDetails: { elements: { type: 'string' } },
            },
          },
        },
        columnErrors: {
          elements: {
            properties: {
              errorAmount: { type: 'uint16' },
              columnName: { type: 'string' },
              errorDetails: {
                elements: {
                  properties: {
                    rowNumber: { type: 'uint16' },
                    errorReason: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    PassedValidation: {
      properties: {
        timestamp: { type: 'timestamp' },
        hasEstimates: { type: 'boolean' },
        submissions: {
          elements: {
            properties: {
              reference: { type: 'string' },
              wasteDescription: wasteDescription,
              wasteQuantity: wasteQuantity,
              exporterDetail: exporterDetail,
              importerDetail: importerDetail,
              collectionDate: collectionDate,
              carriers: carriers,
              collectionDetail: collectionDetail,
              ukExitLocation: ukExitLocation,
              transitCountries: transitCountries,
              recoveryFacilityDetail: recoveryFacilityDetail,
            },
          },
        },
      },
    },
    Submitting: {
      properties: {
        timestamp: { type: 'timestamp' },
        hasEstimates: { type: 'boolean' },
        transactionId: { type: 'string' },
        submissions: {
          elements: {
            properties: {
              reference: { type: 'string' },
              wasteDescription: wasteDescription,
              wasteQuantity: wasteQuantity,
              exporterDetail: exporterDetail,
              importerDetail: importerDetail,
              collectionDate: collectionDate,
              carriers: carriers,
              collectionDetail: collectionDetail,
              ukExitLocation: ukExitLocation,
              transitCountries: transitCountries,
              recoveryFacilityDetail: recoveryFacilityDetail,
            },
          },
        },
      },
    },
    Submitted: {
      properties: {
        timestamp: { type: 'timestamp' },
        transactionId: { type: 'string' },
        hasEstimates: { type: 'boolean' },
        submissions: {
          elements: {
            properties: {
              id: { type: 'string' },
              submissionDeclaration: {
                properties: {
                  declarationTimestamp: { type: 'timestamp' },
                  transactionId: { type: 'string' },
                },
              },
              hasEstimates: { type: 'boolean' },
              collectionDate: collectionDate,
              wasteDescription: wasteDescription,
              reference: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

const bulkSubmission: SchemaObject = {
  properties: {
    id: { type: 'string' },
    state: bulkSubmissionState,
  },
};

export const addContentToBatchRequest: JTDSchemaType<AddContentToBatchRequest> =
  {
    properties: {
      accountId: { type: 'string' },
      content: {
        properties: {
          type: { enum: ['text/csv'] },
          compression: { enum: ['Snappy', 'None'] },
          value: { type: 'string' },
        },
      },
    },
    optionalProperties: {
      batchId: { type: 'string' },
    },
  };

export const addContentToBatchResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      properties: {
        batchId: { type: 'string' },
      },
    },
  },
};

export const getBatchRequest: JTDSchemaType<GetBatchRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const getBatchResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: bulkSubmission,
  },
};

export const updateBatchRequest: JTDSchemaType<UpdateBatchRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const updateBatchResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: { properties: {} },
  },
};

export const getBatchContentRequest: JTDSchemaType<GetBatchContentRequest> = {
  properties: {
    id: { type: 'string' },
    accountId: { type: 'string' },
  },
};

export const getBatchContentResponse: SchemaObject = {
  properties: { success: { type: 'boolean' } },
  optionalProperties: {
    error: errorResponseValue,
    value: {
      elements: {
        ...submission.schema.submission,
      },
    },
  },
};
