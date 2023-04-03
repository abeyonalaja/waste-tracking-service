import * as dto from '@wts/api/waste-tracking-gateway';
import { SubmissionBackend } from './submission.backend';

export default class SubmissionController {
  constructor(private backend: SubmissionBackend) {}

  async listSubmissions(): Promise<dto.ListSubmissionsResponse> {
    return await this.backend.listSubmissions();
  }

  async getSubmission(
    id: string
  ): Promise<dto.GetSubmissionResponse | undefined> {
    return await this.backend.getSubmissionById(id);
  }

  async createSubmission({
    reference,
  }: dto.CreateSubmissionRequest): Promise<dto.CreateSubmissionResponse> {
    return await this.backend.createSubmission(reference);
  }

  async getWasteDescription(
    id: string
  ): Promise<dto.GetWasteDescriptionResponse | undefined> {
    return await this.backend.getWasteDescriptionById(id);
  }

  async putWasteDescription(
    id: string,
    request: dto.PutWasteDescriptionRequest
  ): Promise<dto.PutWasteDescriptionResponse | undefined> {
    return await this.backend.setWasteDescriptionById(id, request);
  }
}
