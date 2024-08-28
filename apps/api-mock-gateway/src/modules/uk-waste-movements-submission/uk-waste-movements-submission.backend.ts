import {
  UkwmSubmission,
  UkwmGetDraftsResult,
  UkwmDraft,
  UkwmDraftAddress,
  UkwmAddress,
  UkwmDraftContact,
  UkwmContact,
  UkwmDraftWasteSource,
  UkwmDraftSicCodes,
  UkwmDeleteDraftSicCodeResponse,
} from '@wts/api/waste-tracking-gateway';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../db';
import { BadRequestError, NotFoundError } from '../../lib/errors';
import { ukwm as ukwmValidation } from '@wts/util/shared-validation';

export interface UkwmDraftRef {
  id: string;
  accountId: string;
}

export interface UkwmSubmissionRef {
  id: string;
  accountId: string;
}

export interface UkwmSetWasteSourceRef {
  id: string;
  accountId: string;
  wasteSource: string;
}

export interface UkwmCreateSicCodeRef {
  id: string;
  accountId: string;
  sicCode: string;
}

export interface UkwmDeleteSicCodeRef {
  id: string;
  accountId: string;
  code: string;
}

export interface UkwmDraftConfrimationRef {
  id: string;
  accountId: string;
  isConfirmed: boolean;
}

const submissions: UkwmSubmission[] = [...Array(155).keys()].map((i) => ({
  id: uuidv4(),
  transactionId: `WM24_${i.toString().padStart(3, '0')}9ACAD`,
  reference: `Producer Ref ${i}`,
  producer: {
    contact: {
      organisationName: `Producer Org ${i}`,
      emailAddress: `email${i}@example.com`,
      fullName: `Producer ${i}`,
      phoneNumber: `0123456789${i}`,
    },
    address: {
      addressLine1: `Address Line 1 ${i}`,
      addressLine2: `Address Line 2 ${i}`,
      townCity: `City ${i}`,
      country: `Country ${i}`,
      postcode: `Postcode ${i}`,
    },
    sicCode: i.toString().padStart(6, '0'),
  },
  receiver: {
    contact: {
      organisationName: `Receiver Org ${i}`,
      emailAddress: `email${i}@example.com`,
      fullName: `Receiver ${i}`,
      phoneNumber: `0123456789${i}`,
    },
    address: {
      addressLine1: `Address Line 1 ${i}`,
      addressLine2: `Address Line 2 ${i}`,
      townCity: `City ${i}`,
      country: `Country ${i}`,
      postcode: `Postcode ${i}`,
    },
    permitDetails: {
      authorizationType: 'permit',
      environmentalPermitNumber: `EPN ${i}`,
    },
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
  let value = db.ukwmDrafts.find(
    (d) => d.id === id && d.accountId === accountId,
  );

  if (!value && id === '123') {
    value = db.ukwmDrafts.find((d) => d.id === id);
  }

  if (!value) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  const submission: UkwmDraft = {
    id: value.id,
    reference: value.reference,
    wasteInformation: value.wasteInformation,
    receiver: value.receiver,
    carrier: value.carrier,
    producerAndCollection: value.producerAndCollection,
    declaration: value.declaration,
    state: value.state,
  };

  return Promise.resolve(submission);
}

export function createDraft(
  reference: string,
  accountId: string,
): Promise<UkwmDraft> {
  const referenceValidationResult =
    ukwmValidation.validationRules.validateReference(reference);

  if (!referenceValidationResult.valid) {
    return Promise.reject(
      new BadRequestError('Validation error', referenceValidationResult.errors),
    );
  }

  const draft: UkwmDraft = {
    id: uuidv4(),
    reference: reference,
    producerAndCollection: {
      producer: {
        contact: {
          status: 'NotStarted',
        },
        address: {
          status: 'NotStarted',
        },
        sicCodes: {
          status: 'Complete',
          values: [],
        },
      },
      wasteCollection: {
        address: {
          status: 'NotStarted',
        },
        wasteSource: {
          status: 'NotStarted',
        },
      },
      confirmation: {
        status: 'NotStarted',
      },
    },
    carrier: {
      address: {
        status: 'NotStarted',
      },
      contact: {
        status: 'NotStarted',
      },
      modeOfTransport: {
        status: 'NotStarted',
      },
    },
    declaration: {
      status: 'CannotStart',
    },
    receiver: {
      permitDetails: {
        status: 'NotStarted',
      },
      address: {
        status: 'NotStarted',
      },
      contact: {
        status: 'NotStarted',
      },
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

export function getDraftProducerAddressDetails({
  id,
  accountId,
}: UkwmSubmissionRef): Promise<UkwmDraftAddress | undefined> {
  let draft = db.ukwmDrafts.find((d) => d.id == id && d.accountId == accountId);

  if (!draft && id === '123') {
    draft = db.ukwmDrafts.find((d) => d.id === id);
  }

  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Draft not found.'));
  }
  return Promise.resolve(draft.producerAndCollection.producer.address);
}

export function setDraftProducerAddressDetails(
  ref: UkwmSubmissionRef,
  value: Partial<UkwmAddress> | UkwmAddress,
  saveAsDraft: boolean,
): Promise<void> {
  const addressDetailsValidationResult =
    ukwmValidation.validationRules.validateAddressDetails(
      value,
      'Producer',
      saveAsDraft,
    );

  if (!addressDetailsValidationResult.valid) {
    return Promise.reject(
      new BadRequestError(
        'Validation error',
        addressDetailsValidationResult.errors,
      ),
    );
  }

  const { id, accountId } = ref;
  let draft = db.ukwmDrafts.find((d) => d.id == id && d.accountId == accountId);

  if (!draft && id === '123') {
    draft = db.ukwmDrafts.find((d) => d.id === id);
  }

  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Draft not found.'));
  }

  draft.producerAndCollection.producer.address = !saveAsDraft
    ? {
        status: 'Complete',
        ...(addressDetailsValidationResult.value as UkwmAddress),
      }
    : {
        status: 'Started',
        ...(addressDetailsValidationResult.value as Partial<UkwmAddress>),
      };

  return Promise.resolve();
}

export function getDraftProducerContactDetail({
  id,
  accountId,
}: UkwmDraftRef): Promise<UkwmDraftContact | undefined> {
  const draft = db.ukwmDrafts.find(
    (d) => d.id == id && d.accountId == accountId,
  );
  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(draft.producerAndCollection.producer.contact);
}

export function setDraftProducerContactDetail(
  ref: UkwmDraftRef,
  value: UkwmContact,
  saveAsDraft: boolean,
): Promise<void> {
  const contactDetailsValidationResult =
    ukwmValidation.validationRules.validateContactDetails(
      value,
      'Producer',
      saveAsDraft,
    );

  if (!contactDetailsValidationResult.valid) {
    return Promise.reject(
      new BadRequestError(
        'Validation error',
        contactDetailsValidationResult.errors,
      ),
    );
  }

  const { id, accountId } = ref;
  const draft = db.ukwmDrafts.find(
    (d) => d.id == id && d.accountId == accountId,
  );
  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (
    value.organisationName &&
    value.faxNumber &&
    value.emailAddress &&
    value.phoneNumber
  ) {
    saveAsDraft = false;
  }

  draft.producerAndCollection.producer.contact = !saveAsDraft
    ? {
        status: 'Complete',
        ...(contactDetailsValidationResult.value as UkwmContact),
      }
    : {
        status: 'Started',
        ...(contactDetailsValidationResult.value as Partial<UkwmContact>),
      };

  return Promise.resolve();
}

export function getDraftWasteSource({
  id,
  accountId,
}: UkwmDraftRef): Promise<UkwmDraftWasteSource> {
  const draft = db.ukwmDrafts.find(
    (d) => d.id == id && d.accountId == accountId,
  );
  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }
  return Promise.resolve(
    draft.producerAndCollection.wasteCollection.wasteSource,
  );
}

export function setDraftWasteSource(ref: UkwmSetWasteSourceRef): Promise<void> {
  const { id, accountId, wasteSource } = ref;
  const draft = db.ukwmDrafts.find(
    (d) => d.id == id && d.accountId == accountId,
  );
  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  const wasteSourceValidationResult =
    ukwmValidation.validationRules.validateWasteSourceSection(wasteSource);

  if (!wasteSourceValidationResult.valid) {
    return Promise.reject(
      new BadRequestError(
        'Validation error',
        wasteSourceValidationResult.errors,
      ),
    );
  }

  if (draft.producerAndCollection.wasteCollection) {
    draft.producerAndCollection.wasteCollection.wasteSource = {
      status: 'Complete',
      value: wasteSource,
    };
  }

  return Promise.resolve();
}

export function getDraftWasteCollectionAddressDetails({
  id,
  accountId,
}: UkwmSubmissionRef): Promise<UkwmDraftAddress | undefined> {
  let draft = db.ukwmDrafts.find((d) => d.id == id && d.accountId == accountId);

  if (!draft && id === '123') {
    draft = db.ukwmDrafts.find((d) => d.id === id);
  }

  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Draft not found.'));
  }

  return Promise.resolve(draft.producerAndCollection.wasteCollection.address);
}
export function setDraftWasteCollectionAddressDetails(
  ref: UkwmSubmissionRef,
  value: Partial<UkwmAddress> | UkwmAddress,
  saveAsDraft: boolean,
): Promise<void> {
  const addressDetailsValidationResult =
    ukwmValidation.validationRules.validateAddressDetails(
      value,
      'Waste collection',
      saveAsDraft,
    );

  if (!addressDetailsValidationResult.valid) {
    return Promise.reject(
      new BadRequestError(
        'Validation error',
        addressDetailsValidationResult.errors,
      ),
    );
  }

  const { id, accountId } = ref;
  let draft = db.ukwmDrafts.find((d) => d.id == id && d.accountId == accountId);

  if (!draft && id === '123') {
    draft = db.ukwmDrafts.find((d) => d.id === id);
  }

  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Draft not found.'));
  }

  draft.producerAndCollection.wasteCollection.address = !saveAsDraft
    ? {
        status: 'Complete',
        ...(addressDetailsValidationResult.value as UkwmAddress),
      }
    : {
        status: 'Started',
        ...(addressDetailsValidationResult.value as Partial<UkwmAddress>),
      };

  return Promise.resolve();
}

export function getDraftSicCodes({
  id,
  accountId,
}: UkwmDraftRef): Promise<UkwmDraftSicCodes> {
  const draft = db.ukwmDrafts.find(
    (d) => d.id == id && d.accountId == accountId,
  );
  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }
  return Promise.resolve(draft.producerAndCollection.producer.sicCodes);
}

export function createDraftSicCode(ref: UkwmCreateSicCodeRef): Promise<string> {
  const { id, accountId, sicCode } = ref;
  const draft = db.ukwmDrafts.find(
    (d) => d.id == id && d.accountId == accountId,
  );
  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  const draftSicCodesList =
    draft.producerAndCollection.producer.sicCodes.values;
  const sicCodesValidationResult =
    ukwmValidation.validationRules.validateSicCodesSection(
      sicCode,
      draftSicCodesList,
      db.sicCodes,
    );
  if (!sicCodesValidationResult.valid) {
    return Promise.reject(
      new BadRequestError('Validation error', sicCodesValidationResult.errors),
    );
  }
  draft.producerAndCollection.producer.sicCodes.values.push(sicCode);
  draft.producerAndCollection.producer.sicCodes.status = 'Complete';

  return Promise.resolve(sicCode);
}

export function getDraftCarrierAddressDetails({
  id,
  accountId,
}: UkwmSubmissionRef): Promise<UkwmDraftAddress | undefined> {
  let draft = db.ukwmDrafts.find((d) => d.id == id && d.accountId == accountId);

  if (!draft && id === '123') {
    draft = db.ukwmDrafts.find((d) => d.id === id);
  }

  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Draft not found.'));
  }

  return Promise.resolve(draft.carrier.address);
}

export function setDraftCarrierAddressDetails(
  ref: UkwmSubmissionRef,
  value: Partial<UkwmAddress> | UkwmAddress,
  saveAsDraft: boolean,
): Promise<void> {
  const addressDetailsValidationResult =
    ukwmValidation.validationRules.validateAddressDetails(
      value,
      'Carrier',
      saveAsDraft,
    );

  if (!addressDetailsValidationResult.valid) {
    return Promise.reject(
      new BadRequestError(
        'Validation error',
        addressDetailsValidationResult.errors,
      ),
    );
  }

  const { id, accountId } = ref;
  let draft = db.ukwmDrafts.find((d) => d.id == id && d.accountId == accountId);

  if (!draft && id === '123') {
    draft = db.ukwmDrafts.find((d) => d.id === id);
  }

  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Draft not found.'));
  }

  draft.carrier.address = !saveAsDraft
    ? {
        status: 'Complete',
        ...(addressDetailsValidationResult.value as UkwmAddress),
      }
    : {
        status: 'Started',
        ...(addressDetailsValidationResult.value as Partial<UkwmAddress>),
      };

  return Promise.resolve();
}

export function getDraftReceiverAddressDetails({
  id,
  accountId,
}: UkwmSubmissionRef): Promise<UkwmDraftAddress | undefined> {
  let draft = db.ukwmDrafts.find((d) => d.id == id && d.accountId == accountId);

  if (!draft && id === '123') {
    draft = db.ukwmDrafts.find((d) => d.id === id);
  }

  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Draft not found.'));
  }

  return Promise.resolve(draft.receiver.address);
}

export function setDraftReceiverAddressDetails(
  ref: UkwmSubmissionRef,
  value: Partial<UkwmAddress> | UkwmAddress,
  saveAsDraft: boolean,
): Promise<void> {
  const addressDetailsValidationResult =
    ukwmValidation.validationRules.validateAddressDetails(
      value,
      'Receiver',
      saveAsDraft,
    );

  if (!addressDetailsValidationResult.valid) {
    return Promise.reject(
      new BadRequestError(
        'Validation error',
        addressDetailsValidationResult.errors,
      ),
    );
  }

  const { id, accountId } = ref;
  let draft = db.ukwmDrafts.find((d) => d.id == id && d.accountId == accountId);

  if (!draft && id === '123') {
    draft = db.ukwmDrafts.find((d) => d.id === id);
  }

  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Draft not found.'));
  }

  draft.receiver.address = !saveAsDraft
    ? {
        status: 'Complete',
        ...(addressDetailsValidationResult.value as UkwmAddress),
      }
    : {
        status: 'Started',
        ...(addressDetailsValidationResult.value as Partial<UkwmAddress>),
      };

  return Promise.resolve();
}

export async function deleteDraftSicCode({
  id,
  accountId,
  code,
}: UkwmDeleteSicCodeRef): Promise<UkwmDeleteDraftSicCodeResponse> {
  const draft = db.ukwmDrafts.find(
    (d) => d.id == id && d.accountId == accountId,
  );
  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  const index = draft.producerAndCollection.producer.sicCodes.values.findIndex(
    (c) => c === code,
  );

  if (index === -1) {
    return Promise.reject(new NotFoundError('SIC Code not found.'));
  }

  draft.producerAndCollection.producer.sicCodes.values.splice(index, 1);

  if (draft.producerAndCollection.producer.sicCodes.values.length === 0) {
    draft.producerAndCollection.producer.sicCodes = {
      status: 'NotStarted',
      values: [],
    };
  }
  return Promise.resolve(draft.producerAndCollection.producer.sicCodes.values);
}

export function setDraftProducerConfirmation(
  ref: UkwmDraftConfrimationRef,
): Promise<void> {
  const { id, accountId, isConfirmed } = ref;
  const draft = db.ukwmDrafts.find(
    (d) => d.id == id && d.accountId == accountId,
  );
  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (
    !draft.reference ||
    draft.producerAndCollection.producer.contact.status !== 'Complete' ||
    draft.producerAndCollection.producer.sicCodes.status !== 'Complete' ||
    draft.producerAndCollection.wasteCollection.address.status !== 'Complete' ||
    draft.producerAndCollection.wasteCollection.wasteSource.status !==
      'Complete'
  ) {
    return Promise.reject(
      new BadRequestError(
        'Producer and waste collection section is not complete',
      ),
    );
  }

  draft.producerAndCollection.confirmation.status = isConfirmed
    ? 'Complete'
    : 'InProgress';

  return Promise.resolve();
}

export function setDraftReceiverContactDetail(
  ref: UkwmDraftRef,
  value: UkwmContact,
  saveAsDraft: boolean,
): Promise<void> {
  const contactDetailsValidationResult =
    ukwmValidation.validationRules.validateContactDetails(
      value,
      'Producer',
      saveAsDraft,
    );

  if (!contactDetailsValidationResult.valid) {
    return Promise.reject(
      new BadRequestError(
        'Validation error',
        contactDetailsValidationResult.errors,
      ),
    );
  }

  const { id, accountId } = ref;
  const draft = db.ukwmDrafts.find(
    (d) => d.id == id && d.accountId == accountId,
  );
  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  if (
    value.organisationName &&
    value.fullName &&
    value.emailAddress &&
    value.phoneNumber
  ) {
    saveAsDraft = false;
  }

  draft.receiver.contact = !saveAsDraft
    ? {
        status: 'Complete',
        ...(contactDetailsValidationResult.value as UkwmContact),
      }
    : {
        status: 'Started',
        ...(contactDetailsValidationResult.value as Partial<UkwmContact>),
      };

  return Promise.resolve();
}

export function getDraftReceiverContactDetail({
  id,
  accountId,
}: UkwmDraftRef): Promise<UkwmDraftContact | undefined> {
  const draft = db.ukwmDrafts.find(
    (d) => d.id == id && d.accountId == accountId,
  );
  if (draft === undefined) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }

  return Promise.resolve(draft.receiver.contact);
}
