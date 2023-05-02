import * as dto from '@wts/api/waste-tracking-gateway';
import Boom from '@hapi/boom';
import { v4 as uuidv4 } from 'uuid';
import { DaprAnnexViiClient } from '@wts/client/annex-vii';
import { Logger } from 'winston';

export type Submission = dto.Submission;
export type CustomerReference = dto.CustomerReference;
export type WasteDescription = dto.WasteDescription;
export type WasteQuantity = dto.WasteQuantity;
export type ExporterDetail = dto.ExporterDetail;

export type SubmissionRef = {
  id: string;
  accountId: string;
};

export interface SubmissionBackend {
  createSubmission(
    accountId: string,
    reference: CustomerReference
  ): Promise<Submission>;
  getSubmission(ref: SubmissionRef): Promise<Submission>;
  getCustomerReference(ref: SubmissionRef): Promise<CustomerReference>;
  setCustomerReference(
    ref: SubmissionRef,
    value: CustomerReference
  ): Promise<void>;
  getWasteDescription(ref: SubmissionRef): Promise<WasteDescription>;
  setWasteDescription(
    ref: SubmissionRef,
    value: WasteDescription
  ): Promise<void>;
  getWasteQuantity(ref: SubmissionRef): Promise<WasteQuantity>;
  setWasteQuantity(ref: SubmissionRef, value: WasteQuantity): Promise<void>;
  getExporterDetail(ref: SubmissionRef): Promise<ExporterDetail>;
  setExporterDetail(ref: SubmissionRef, value: ExporterDetail): Promise<void>;
}

/**
 * This is a mock backend and should not be used in production.
 */
export class InMemorySubmissionBackend implements SubmissionBackend {
  readonly submissions = new Map<string, Submission>();

  createSubmission(
    _: string,
    reference: CustomerReference
  ): Promise<Submission> {
    if (reference && reference.length > 50) {
      return Promise.reject(
        Boom.badRequest('Supplied reference cannot exceed 50 characters')
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

  getSubmission({ id }: SubmissionRef): Promise<Submission> {
    const value = this.submissions.get(id);
    if (value === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(value);
  }

  getCustomerReference({ id }: SubmissionRef): Promise<CustomerReference> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.reference);
  }

  setCustomerReference(
    { id }: SubmissionRef,
    value: CustomerReference
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (value && value.length > 50) {
      return Promise.reject(
        Boom.badRequest('Supplied reference cannot exceed 50 characters')
      );
    }

    submission.reference = value;
    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getWasteDescription({ id }: SubmissionRef): Promise<WasteDescription> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.wasteDescription);
  }

  setWasteDescription(
    { id }: SubmissionRef,
    value: WasteDescription
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.wasteDescription = value;

    if (
      (value.status === 'Started' || value.status === 'Complete') &&
      submission.wasteQuantity.status === 'CannotStart'
    ) {
      submission.wasteQuantity = { status: 'NotStarted' };
    }

    if (
      submission.recoveryFacilityDetail.status === 'CannotStart' &&
      value.status !== 'NotStarted' &&
      value.wasteCode !== undefined
    ) {
      submission.recoveryFacilityDetail = { status: 'NotStarted' };
    }

    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getWasteQuantity({ id }: SubmissionRef): Promise<WasteQuantity> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.wasteQuantity);
  }

  setWasteQuantity({ id }: SubmissionRef, value: WasteQuantity): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.wasteQuantity = value;
    this.submissions.set(id, submission);
    return Promise.resolve();
  }

  getExporterDetail({ id }: SubmissionRef): Promise<ExporterDetail> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(submission.exporterDetail);
  }

  setExporterDetail(
    { id }: SubmissionRef,
    value: ExporterDetail
  ): Promise<void> {
    const submission = this.submissions.get(id);
    if (submission === undefined) {
      return Promise.reject(Boom.notFound());
    }

    submission.exporterDetail = value;
    this.submissions.set(id, submission);
    return Promise.resolve();
  }
}

export class AnnexViiServiceBackend implements SubmissionBackend {
  constructor(private client: DaprAnnexViiClient, private logger: Logger) {}

  async createSubmission(
    accountId: string,
    reference: CustomerReference
  ): Promise<Submission> {
    try {
      const response = await this.client.createDraft({ accountId, reference });
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }

      return response.value;
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
  }

  async getSubmission({ id, accountId }: SubmissionRef): Promise<Submission> {
    try {
      const response = await this.client.getDraftById({ id, accountId });
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }

      return response.value;
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
  }

  async getCustomerReference({
    id,
    accountId,
  }: SubmissionRef): Promise<CustomerReference> {
    try {
      const response = await this.client.getDraftCustomerReferenceById({
        id,
        accountId,
      });
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }

      return response.value;
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
  }

  async setCustomerReference(
    { id, accountId }: SubmissionRef,
    value: CustomerReference
  ): Promise<void> {
    try {
      const response = await this.client.setDraftCustomerReferenceById({
        id,
        accountId,
        value,
      });
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
  }

  async getWasteDescription({
    id,
    accountId,
  }: SubmissionRef): Promise<WasteDescription> {
    try {
      const response = await this.client.getDraftWasteDescriptionById({
        id,
        accountId,
      });
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }

      return response.value;
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
  }

  async setWasteDescription(
    { id, accountId }: SubmissionRef,
    value: WasteDescription
  ): Promise<void> {
    try {
      const response = await this.client.setDraftWasteDescriptionById({
        id,
        accountId,
        value,
      });
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
  }

  async getWasteQuantity({
    id,
    accountId,
  }: SubmissionRef): Promise<WasteQuantity> {
    try {
      const response = await this.client.getDraftWasteQuantityById({
        id,
        accountId,
      });
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }

      return response.value;
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
  }

  async setWasteQuantity(
    { id, accountId }: SubmissionRef,
    value: WasteQuantity
  ): Promise<void> {
    try {
      const response = await this.client.setDraftWasteQuantityById({
        id,
        accountId,
        value,
      });
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
  }

  async getExporterDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<ExporterDetail> {
    try {
      const response = await this.client.getDraftExporterDetailById({
        id,
        accountId,
      });
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }

      return response.value;
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
  }

  async setExporterDetail(
    { id, accountId }: SubmissionRef,
    value: ExporterDetail
  ): Promise<void> {
    try {
      const response = await this.client.setDraftExporterDetailById({
        id,
        accountId,
        value,
      });
      if (!response.success) {
        throw new Boom.Boom(response.error.message, {
          statusCode: response.error.statusCode,
        });
      }
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }
  }
}
