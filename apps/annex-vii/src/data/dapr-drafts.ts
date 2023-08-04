import { DaprClient } from '@dapr/dapr';
import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { DraftSubmission, DraftSubmissionSummary } from '../model';
import { DraftRepository } from './repository';

type DraftSubmissionData = DraftSubmission & { accountId: string };

export default class DaprDraftRepository implements DraftRepository {
  constructor(
    private daprClient: DaprClient,
    private logger: Logger,
    private stateStoreName: string
  ) {}

  async getDrafts(accountId: string): Promise<DraftSubmissionSummary[]> {
    const response = await this.daprClient.state.query(this.stateStoreName, {
      filter: { EQ: { accountId } },
      sort: [],
      page: { limit: 10 },
    });

    if (response.results === undefined) {
      return [];
    }

    return response.results.map((r) => {
      const s = r.data as DraftSubmissionData;
      return {
        id: s.id,
        reference: s.reference,
        wasteDescription: s.wasteDescription,
        wasteQuantity: { status: s.wasteQuantity.status },
        exporterDetail: { status: s.exporterDetail.status },
        importerDetail: { status: s.exporterDetail.status },
        collectionDate: { status: s.collectionDetail.status },
        carriers: { status: s.carriers.status },
        collectionDetail: { status: s.collectionDetail.status },
        ukExitLocation: { status: s.ukExitLocation.status },
        transitCountries: { status: s.transitCountries.status },
        recoveryFacilityDetail: { status: s.recoveryFacilityDetail.status },
        submissionConfirmation: { status: s.submissionConfirmation.status },
        submissionDeclaration: s.submissionDeclaration,
        submissionState: s.submissionState,
      };
    });
  }

  async getDraft(id: string, accountId: string): Promise<DraftSubmission> {
    const response = await this.daprClient.state.getBulk(
      this.stateStoreName,
      [id],
      {
        metadata: {
          partitionKey: accountId,
        },
      }
    );

    if (response.length === 0) {
      this.logger.error('Expected singleton response from Dapr state store', {
        storeName: this.stateStoreName,
      });

      throw Boom.internal();
    }

    if (response[0].data === undefined) {
      throw Boom.notFound();
    }

    const data = response[0].data as DraftSubmissionData;
    return {
      id: data.id,
      reference: data.reference,
      wasteDescription: data.wasteDescription,
      wasteQuantity: data.wasteQuantity,
      exporterDetail: data.exporterDetail,
      importerDetail: data.importerDetail,
      collectionDate: data.collectionDate,
      carriers: data.carriers,
      collectionDetail: data.collectionDetail,
      ukExitLocation: data.ukExitLocation,
      transitCountries: data.transitCountries,
      recoveryFacilityDetail: data.recoveryFacilityDetail,
      submissionConfirmation: data.submissionConfirmation,
      submissionDeclaration: data.submissionDeclaration,
      submissionState: data.submissionState,
    };
  }

  async saveDraft(value: DraftSubmission, accountId: string): Promise<void> {
    const data: DraftSubmissionData = { ...value, accountId };
    const response = await this.daprClient.state.save(this.stateStoreName, [
      { key: data.id, value: data, metadata: { partitionKey: accountId } },
    ]);

    if (response.error !== undefined) {
      this.logger.error('Error response from Dapr state store', {
        storeName: this.stateStoreName,
        message: response.error.message,
      });

      throw Boom.internal(response.error);
    }
  }
}
