import { DraftCarriers, DraftRecoveryFacilityDetail } from '@wts/api/annex-vii';
import { DraftSubmission, Template } from '../model';

export interface BaseRepository {
  createTemplateFromSubmission(
    id: string,
    accountId: string,
    templateName: string,
    templateDescription?: string
  ): Promise<Template>;
  createSubmissionFromTemplate(
    id: string,
    accountId: string,
    reference: string
  ): Promise<DraftSubmission>;
  copyCarriers(sourceCarriers: DraftCarriers): DraftCarriers;
  copyRecoveryFacilities(
    sourceFacilities: DraftRecoveryFacilityDetail
  ): DraftRecoveryFacilityDetail;
}
