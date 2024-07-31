import {
  UkwmSubmission,
  UkwmGetDraftsResult,
  UkwmDraft,
} from '@wts/api/waste-tracking-gateway';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import { ukwm as ukwmValidation } from '@wts/util/shared-validation';

export interface UkwmSubmissionRef {
  id: string;
  accountId: string;
}

const submissions: UkwmSubmission[] = [...Array(155).keys()].map((i) => ({
  id: uuidv4(),
  transactionId: `WM24_${i.toString().padStart(3, '0')}9ACAD`,
  producer: {
    contact: {
      organisationName: `Producer Org ${i}`,
      email: `email${i}@example.com`,
      name: `Producer ${i}`,
      phone: `0123456789${i}`,
    },
    address: {
      addressLine1: `Address Line 1 ${i}`,
      addressLine2: `Address Line 2 ${i}`,
      townCity: `City ${i}`,
      country: `Country ${i}`,
      postcode: `Postcode ${i}`,
    },
    reference: `Producer Ref ${i}`,
    sicCode: i.toString().padStart(6, '0'),
  },
  receiver: {
    contact: {
      organisationName: `Receiver Org ${i}`,
      email: `email${i}@example.com`,
      name: `Receiver ${i}`,
      phone: `0123456789${i}`,
    },
    address: {
      addressLine1: `Address Line 1 ${i}`,
      addressLine2: `Address Line 2 ${i}`,
      townCity: `City ${i}`,
      country: `Country ${i}`,
      postcode: `Postcode ${i}`,
    },
    authorizationType: 'permit',
    environmentalPermitNumber: `EPN ${i}`,
  },
  wasteTransportation: {
    numberAndTypeOfContainers: `Containers ${i}`,
    specialHandlingRequirements: `Special Handling ${i}`,
  },
  wasteCollection: {
    expectedWasteCollectionDate: {
      day: ((i % 31) + 1).toString(),
      month: ((i % 12) + 1).toString(),
      year: '2024',
    },
    address: {
      addressLine1: `Address Line 1 ${i}`,
      addressLine2: `Address Line 2 ${i}`,
      country: `Country ${i}`,
      postcode: `Postcode ${i}`,
      townCity: `Town City ${i}`,
    },
    localAuthority: 'Local authority 1',
    wasteSource: 'commercial',
    brokerRegistrationNumber: `BRN ${i}`,
    carrierRegistrationNumber: `CRN ${i}`,
  },
  wasteTypes: [
    {
      ewcCode: `${i.toString().padStart(3, '0')}012`,
      physicalForm: 'Solid',
      wasteQuantity: 1000,
      wasteQuantityType: 'ActualData',
      quantityUnit: 'Kilogram',
      wasteDescription: `Waste Description ${i}`,
      chemicalAndBiologicalComponents: [
        {
          concentration: 1,
          concentrationUnit: 'Microgram',
          name: `Chemical ${i}`,
        },
      ],
      hasHazardousProperties: true,
      hazardousWasteCodes: [
        {
          code: `HWC ${i}`,
          name: `HWC Name ${i}`,
        },
      ],
      containsPops: true,
      pops: [
        {
          concentration: 1,
          concentrationUnit: 'Microgram',
          name: `POP ${i}`,
        },
      ],
    },
  ],
  submissionState: {
    status: 'SubmittedWithActuals',
    timestamp: new Date(),
  },
}));

export function getDrafts(
  page: number,
  pageSize: number,
  collectionDate?: Date,
  ewcCode?: string,
  producerName?: string,
  wasteMovementId?: string,
): UkwmGetDraftsResult {
  let filteredSubmissions = submissions;

  if (wasteMovementId) {
    filteredSubmissions = filteredSubmissions.filter(
      (s) => s.transactionId === wasteMovementId,
    );
  }

  if (collectionDate) {
    filteredSubmissions = filteredSubmissions.filter(
      (s) =>
        s.wasteCollection.expectedWasteCollectionDate.day ===
          collectionDate.getDate().toString() &&
        s.wasteCollection.expectedWasteCollectionDate.month ===
          (collectionDate.getMonth() + 1).toString() &&
        s.wasteCollection.expectedWasteCollectionDate.year ===
          collectionDate.getFullYear().toString(),
    );
  }

  if (ewcCode) {
    filteredSubmissions = filteredSubmissions.filter((s) =>
      s.wasteTypes.some((wt) => wt.ewcCode === ewcCode),
    );
  }

  if (producerName) {
    filteredSubmissions = filteredSubmissions.filter((s) =>
      s.producer.contact.organisationName.includes(producerName),
    );
  }

  const pagedSubmissions = filteredSubmissions.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return {
    totalRecords: filteredSubmissions.length,
    totalPages: Math.ceil(filteredSubmissions.length / pageSize),
    page,
    values: pagedSubmissions.map((s) => ({
      id: s.id,
      wasteMovementId: s.transactionId,
      producerName: s.producer.contact.organisationName,
      ewcCode: s.wasteTypes[0].ewcCode,
      collectionDate: s.wasteCollection.expectedWasteCollectionDate,
    })),
  };
}

export function getDraft({
  id,
  accountId,
}: UkwmSubmissionRef): Promise<UkwmDraft> {
  const value = db.ukwmDrafts.find(
    (d) => d.id === id && d.accountId === accountId,
  );
  if (value === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  const submission: UkwmDraft = {
    id: value.id,
    wasteInformation: value.wasteInformation,
    receiver: value.receiver,
    carrier: value.carrier,
    producerAndCollection: value.producerAndCollection,
    declaration: value.declaration,
    state: value.state,
  } as UkwmDraft;

  return Promise.resolve(submission);
}

export function createDraft(
  reference: string,
  accountId: string,
): Promise<UkwmDraft> {
  const referenceValidationResult =
    ukwmValidation.validationRules.validateProducerReference(reference);
  if (!referenceValidationResult.valid) {
    return Promise.reject(
      new BadRequestError('Validation error', referenceValidationResult.errors),
    );
  }

  const draft: UkwmDraft = {
    id: uuidv4(),
    producerAndCollection: {
      status: 'Started',
      producer: {
        contact: {
          status: 'NotStarted',
        },
        address: {
          status: 'NotStarted',
        },
        sicCode: '',
        reference: reference,
      },
      wasteCollection: {
        status: 'NotStarted',
      },
    },
    carrier: {
      status: 'NotStarted',
    },
    declaration: {
      status: 'CannotStart',
    },
    receiver: {
      status: 'NotStarted',
    },
    wasteInformation: {
      status: 'NotStarted',
    },
    state: {
      status: 'InProgress',
      timestamp: new Date(),
    },
  };

  db.ukwmDrafts.push({
    ...draft,
    accountId,
  });

  return Promise.resolve(draft);
}
