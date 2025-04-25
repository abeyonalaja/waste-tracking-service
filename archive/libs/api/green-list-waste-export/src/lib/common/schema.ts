import { JTDSchemaType, SchemaObject } from 'ajv/dist/jtd';
import {
  AddressDetail,
  CancellationType,
  ContactDetail,
  CustomerReference,
  GetRecordsRequest,
  OptionalStringInput,
  OrganisationDetail,
  PageMetadata,
  UkAddressDetail,
  UkContactDetail,
  UkOrganisationDetail,
} from './dto';

export const errorResponseValue: SchemaObject = {
  properties: {
    statusCode: { type: 'uint16' },
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

export const customerReference: JTDSchemaType<CustomerReference> = {
  type: 'string',
};

export const ukAddressDetail: JTDSchemaType<UkAddressDetail> = {
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

export const ukContactDetail: JTDSchemaType<UkContactDetail> = {
  properties: {
    organisationName: { type: 'string' },
    fullName: { type: 'string' },
    emailAddress: { type: 'string' },
    phoneNumber: { type: 'string' },
  },
  optionalProperties: {
    faxNumber: { type: 'string' },
  },
};

export const ukOrganisationDetail: JTDSchemaType<UkOrganisationDetail> = {
  properties: {
    addressDetail: ukAddressDetail,
    contactDetail: ukContactDetail,
  },
};

export const addressDetail: JTDSchemaType<AddressDetail> = {
  properties: {
    organisationName: { type: 'string' },
    address: { type: 'string' },
    country: { type: 'string' },
  },
};

export const contactDetail: JTDSchemaType<ContactDetail> = {
  properties: {
    fullName: { type: 'string' },
    emailAddress: { type: 'string' },
    phoneNumber: { type: 'string' },
  },
  optionalProperties: {
    faxNumber: { type: 'string' },
  },
};

export const organisationDetail: JTDSchemaType<OrganisationDetail> = {
  properties: {
    addressDetail: addressDetail,
    contactDetail: contactDetail,
  },
};

export const optionalStringInput: JTDSchemaType<OptionalStringInput> = {
  discriminator: 'provided',
  mapping: {
    Yes: { properties: { value: { type: 'string' } } },
    No: { properties: {} },
  },
};

export const pageMetadata: JTDSchemaType<PageMetadata> = {
  properties: {
    pageNumber: { type: 'uint16' },
    token: { type: 'string' },
  },
};

export const cancellationType: JTDSchemaType<CancellationType> = {
  discriminator: 'type',
  mapping: {
    ChangeOfRecoveryFacilityOrLaboratory: {
      properties: {},
    },
    NoLongerExportingWaste: {
      properties: {},
    },
    Other: {
      properties: {
        reason: { type: 'string' },
      },
    },
  },
};

export const recordState: SchemaObject = {
  discriminator: 'status',
  mapping: {
    InProgress: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
    Cancelled: {
      properties: {
        timestamp: { type: 'timestamp' },
        cancellationType: cancellationType,
      },
    },
    Deleted: {
      properties: {
        timestamp: { type: 'timestamp' },
      },
    },
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

export const getRecordsRequest: JTDSchemaType<GetRecordsRequest> = {
  properties: {
    accountId: { type: 'string' },
    order: { enum: ['ASC', 'DESC'] },
  },
  optionalProperties: {
    pageLimit: { type: 'uint16' },
    state: {
      elements: {
        enum: [
          'InProgress',
          'Cancelled',
          'Deleted',
          'SubmittedWithEstimates',
          'SubmittedWithActuals',
          'UpdatedWithActuals',
        ],
      },
    },
    token: { type: 'string' },
  },
};
