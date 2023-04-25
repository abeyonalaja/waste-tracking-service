import * as dto from '@wts/api/waste-tracking-gateway';
import { v4 as uuidv4 } from 'uuid';

export type Submission = dto.Submission;
export type CustomerReference = dto.CustomerReference;
export type WasteDescription = dto.WasteDescription;
export type WasteQuantity = dto.WasteQuantity;

export class ValdiationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface SubmissionBackend {
  listSubmissions(): Promise<Submission[]>;
  createSubmission(reference: CustomerReference): Promise<Submission>;
  getSubmission(id: string): Promise<Submission | undefined>;
  getWasteDescription(
    submissionId: string
  ): Promise<WasteDescription | undefined>;
  setWasteDescription(
    submissionId: string,
    wasteDescription: WasteDescription
  ): Promise<WasteDescription | undefined>;
  getWasteQuantity(submissionId: string): Promise<WasteQuantity | undefined>;
  setWasteQuantity(
    submissionId: string,
    WasteQuantity: WasteQuantity
  ): Promise<WasteQuantity | undefined>;
  getCustomerReference(
    submissionId: string
  ): Promise<CustomerReference | undefined>;
  setCustomerReference(
    submissionId: string,
    reference: CustomerReference
  ): Promise<CustomerReference | undefined>;
}

/**
 * This is a mock backend and should not be used in production.
 */
export class InMemorySubmissionBackend implements SubmissionBackend {
  readonly submissions = new Map<string, Submission>();

  listSubmissions(): Promise<Submission[]> {
    return Promise.resolve(Array.from(this.submissions.values()));
  }

  createSubmission(reference: CustomerReference): Promise<Submission> {
    if (reference && reference.length > 50) {
      return Promise.reject(
        new ValdiationError('Supplied reference cannot exceed 50 characters')
      );
    }

    const id = uuidv4();
    const value: Submission = {
      id,
      reference,
      wasteDescription: { status: 'NotStarted' },
      wasteQuantity: { status: 'CannotStart' },
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      collectionDate: { status: 'NotStarted' },
      carriers: { status: 'NotStarted' },
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
      recoveryFacilityDetail: { status: 'CannotStart' },
    };

    this.submissions.set(id, value);
    return Promise.resolve(value);
  }

  getSubmission(id: string): Promise<Submission | undefined> {
    return Promise.resolve(this.submissions.get(id));
  }

  async getWasteDescription(
    submissionId: string
  ): Promise<WasteDescription | undefined> {
    const submission = await this.getSubmission(submissionId);
    if (submission === undefined) {
      return undefined;
    }

    return submission.wasteDescription;
  }

  async setWasteDescription(
    submissionId: string,
    wasteDescription: WasteDescription
  ): Promise<WasteDescription | undefined> {
    const submission = await this.getSubmission(submissionId);
    if (submission === undefined) {
      return undefined;
    }

    submission.wasteDescription = wasteDescription;

    if (
      wasteDescription.status === 'Complete' &&
      submission.wasteQuantity.status === 'CannotStart'
    ) {
      submission.wasteQuantity = { status: 'NotStarted' };
    }

    if (
      submission.recoveryFacilityDetail.status === 'CannotStart' &&
      wasteDescription.status !== 'NotStarted' &&
      wasteDescription.wasteCode !== undefined
    ) {
      submission.recoveryFacilityDetail = { status: 'NotStarted' };
    }

    this.submissions.set(submissionId, submission);
    return wasteDescription;
  }

  async getWasteQuantity(
    submissionId: string
  ): Promise<WasteQuantity | undefined> {
    const submission = await this.getSubmission(submissionId);
    if (submission === undefined) {
      return undefined;
    }

    return submission.wasteQuantity;
  }

  async setWasteQuantity(
    submissionId: string,
    wasteQuantity: WasteQuantity
  ): Promise<WasteQuantity | undefined> {
    const submission = await this.getSubmission(submissionId);
    if (submission === undefined) {
      return undefined;
    }
    submission.wasteQuantity = wasteQuantity;
    this.submissions.set(submissionId, submission);
    return wasteQuantity;
  }

  async getCustomerReference(
    submissionId: string
  ): Promise<CustomerReference | undefined> {
    const submission = await this.getSubmission(submissionId);
    if (submission === undefined) {
      return undefined;
    }

    return submission.reference;
  }

  async setCustomerReference(
    submissionId: string,
    reference: CustomerReference
  ): Promise<CustomerReference | undefined> {
    const submission = await this.getSubmission(submissionId);
    if (submission === undefined) {
      return undefined;
    }

    submission.reference = reference;
    this.submissions.set(submissionId, submission);
    return submission.reference;
  }
}
