import * as dto from '@wts/api/waste-tracking-gateway';
import { v4 as uuidv4 } from 'uuid';

export type Submission = dto.Submission;
export type CustomerReference = dto.CustomerReference;
export type WasteDescription = dto.WasteDescription;

export class ValdiationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface SubmissionBackend {
  listSubmissions(): Promise<Submission[]>;
  createSubmission(reference?: string): Promise<Submission>;
  getSubmissionById(id: string): Promise<Submission | undefined>;
  getWasteDescriptionById(
    submissionId: string
  ): Promise<WasteDescription | undefined>;
  setWasteDescriptionById(
    submissionId: string,
    wasteDescription: WasteDescription
  ): Promise<WasteDescription | undefined>;
}

/**
 * This is a mock backend and should not be used in production.
 */
export class InMemorySubmissionBackend implements SubmissionBackend {
  readonly submissions = new Map<string, Submission>();

  listSubmissions(): Promise<Submission[]> {
    return Promise.resolve(Array.from(this.submissions.values()));
  }

  createSubmission(reference?: string): Promise<Submission> {
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

  getSubmissionById(id: string): Promise<Submission | undefined> {
    return Promise.resolve(this.submissions.get(id));
  }

  async getWasteDescriptionById(
    submissionId: string
  ): Promise<WasteDescription | undefined> {
    const submission = await this.getSubmissionById(submissionId);
    if (submission === undefined) {
      return undefined;
    }

    return submission.wasteDescription;
  }

  async setWasteDescriptionById(
    submissionId: string,
    wasteDescription: WasteDescription
  ): Promise<WasteDescription | undefined> {
    const submission = await this.getSubmissionById(submissionId);
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

    this.submissions.set(submissionId, submission);
    return wasteDescription;
  }
}
