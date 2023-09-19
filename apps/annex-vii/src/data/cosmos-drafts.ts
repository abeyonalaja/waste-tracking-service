import { SqlQuerySpec } from '@azure/cosmos';
import Boom from '@hapi/boom';
import { Logger } from 'winston';
import {
  DraftSubmission,
  DraftSubmissionPageMetadata,
  DraftSubmissionSummary,
  DraftSubmissionSummaryPage,
} from '../model';
import { DraftRepository } from './repository';
import { CosmosAnnexViiClient } from '../clients';

type DraftSubmissionData = DraftSubmission & { accountId: string };

export default class CosmosDraftRepository implements DraftRepository {
  constructor(
    private cosmosClient: CosmosAnnexViiClient,
    private cosmosContainerName: string,
    private logger: Logger
  ) {}

  async getDrafts(
    accountId: string,
    order: 'ASC' | 'DESC',
    pageLimit = 15,
    state?: DraftSubmission['submissionState']['status'][],
    token?: string
  ): Promise<DraftSubmissionSummaryPage> {
    let querySpec: SqlQuerySpec;
    if (!state) {
      querySpec = {
        query: `SELECT * FROM c 
                WHERE
                  c["value"].accountId = @accountId
                ORDER BY
                  c["value"]["submissionState"].timestamp ${order}`,
        parameters: [
          {
            name: '@accountId',
            value: accountId,
          },
        ],
      };
    } else {
      querySpec = {
        query: `SELECT * FROM c 
                WHERE
                  ARRAY_CONTAINS(@state, c["value"]["submissionState"].status)
                AND
                  c["value"].accountId = @accountId
                ORDER BY
                  c["value"]["submissionState"].timestamp ${order}`,
        parameters: [
          {
            name: '@accountId',
            value: accountId,
          },
          {
            name: '@state',
            value: state,
          },
        ],
      };
    }

    let hasMoreResults = true;
    let totalSubmissions = 0;
    let totalPages = 0;
    let currentPage = 0;
    let pageNumber = 0;
    let contToken = '';
    const metadataArray: DraftSubmissionPageMetadata[] = [];
    let values: ReadonlyArray<DraftSubmissionSummary> = [];

    while (hasMoreResults) {
      totalPages += 1;
      pageNumber += 1;

      const options = {
        maxItemCount: pageLimit,
        partitionKey: accountId,
        continuationToken: contToken,
      };

      const response = await this.cosmosClient.queryContainerNext(
        this.cosmosContainerName,
        querySpec,
        options
      );

      if (response.results === undefined) {
        return {
          totalSubmissions: 0,
          totalPages: 0,
          currentPage: 0,
          pages: [],
          values: [],
        };
      }

      hasMoreResults = response.hasMoreResults;
      totalSubmissions += response.results.length;

      if ((!token && pageNumber === 1) || token === contToken) {
        values = response.results.map((r) => {
          const s = r.value as DraftSubmissionData;
          return {
            id: s.id,
            reference: s.reference,
            wasteDescription: s.wasteDescription,
            wasteQuantity: { status: s.wasteQuantity.status },
            exporterDetail: { status: s.exporterDetail.status },
            importerDetail: { status: s.importerDetail.status },
            collectionDate: s.collectionDate,
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
        currentPage = pageNumber;
      }

      contToken = response.continuationToken;

      const pageMetadata: DraftSubmissionPageMetadata = {
        pageNumber: pageNumber,
        token: response.continuationToken ?? '',
      };
      metadataArray.push(pageMetadata);

      if (!hasMoreResults && token === '') {
        break;
      }
    }

    return {
      totalSubmissions: totalSubmissions,
      totalPages: totalPages,
      currentPage: currentPage,
      pages: metadataArray,
      values: values,
    };
  }

  async getDraft(id: string, accountId: string): Promise<DraftSubmission> {
    const item = await this.cosmosClient.readItem(
      this.cosmosContainerName,
      id,
      accountId
    );
    if (!item) {
      throw Boom.notFound();
    }

    const data = item.value as DraftSubmissionData;
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
    try {
      await this.cosmosClient.createOrReplaceItem(
        this.cosmosContainerName,
        data.id,
        data.accountId,
        data
      );
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }
}
