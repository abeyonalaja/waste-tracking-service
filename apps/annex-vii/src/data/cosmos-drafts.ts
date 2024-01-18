import {
  CosmosClient,
  Database,
  PatchOperation,
  SqlQuerySpec,
} from '@azure/cosmos';
import { v4 as uuidv4 } from 'uuid';
import Boom from '@hapi/boom';
import { Logger } from 'winston';
import {
  DraftSubmission,
  DraftSubmissionPageMetadata,
  DraftSubmissionSummary,
  DraftSubmissionSummaryPage,
  SubmissionBase,
} from '../model';
import { DraftRepository } from './repository';
import { CosmosBaseRepository, DraftSubmissionData } from './cosmos-base';

export default class CosmosDraftRepository
  extends CosmosBaseRepository
  implements DraftRepository
{
  private cosmosDb: Database;

  constructor(
    private cosmosClient: CosmosClient,
    private cosmosDbName: string,
    private draftContainerName: string,
    private templateContainerName: string,
    private logger: Logger
  ) {
    super();
    this.cosmosDb = this.cosmosClient.database(this.cosmosDbName);
  }

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

    let hasMorePages = true;
    let totalSubmissions = 0;
    let totalPages = 0;
    let currentPage = 0;
    let pageNumber = 0;
    let contToken = '';
    const metadataArray: DraftSubmissionPageMetadata[] = [];
    let values: ReadonlyArray<DraftSubmissionSummary> = [];

    while (hasMorePages) {
      totalPages += 1;
      pageNumber += 1;

      const options = {
        maxItemCount: pageLimit,
        partitionKey: accountId,
        continuationToken: contToken,
      };

      const {
        resources: results,
        hasMoreResults,
        continuationToken,
      } = await this.cosmosDb
        .container(this.draftContainerName)
        .items.query(querySpec, options)
        .fetchNext();

      if (results === undefined) {
        return {
          totalSubmissions: 0,
          totalPages: 0,
          currentPage: 0,
          pages: [],
          values: [],
        };
      }

      hasMorePages = hasMoreResults;
      totalSubmissions += results.length;

      if ((!token && pageNumber === 1) || token === contToken) {
        values = results.map((r) => {
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

      contToken = continuationToken;

      const pageMetadata: DraftSubmissionPageMetadata = {
        pageNumber: pageNumber,
        token: continuationToken ?? '',
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
    const { resource: item } = await this.cosmosDb
      .container(this.draftContainerName)
      .item(id, accountId)
      .read();
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
      const { resource: item } = await this.cosmosDb
        .container(this.draftContainerName)
        .item(data.id, data.accountId)
        .read();

      if (!item) {
        const createItem = {
          id: data.id,
          value: data,
          partitionKey: data.accountId,
        };
        await this.cosmosDb
          .container(this.draftContainerName)
          .items.create(createItem);
      } else {
        const replaceOperation: PatchOperation[] = [
          {
            op: 'replace',
            path: '/value',
            value: data,
          },
        ];
        await this.cosmosDb
          .container(this.draftContainerName)
          .item(data.id, data.accountId)
          .patch(replaceOperation);
      }
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }

  async createDraftFromTemplate(
    id: string,
    accountId: string,
    reference: string
  ): Promise<DraftSubmission> {
    const { resource: item } = await this.cosmosDb
      .container(this.templateContainerName)
      .item(id, accountId)
      .read();
    if (!item) {
      throw Boom.notFound();
    }

    const data = item.value as SubmissionBase;
    const submission: DraftSubmission = {
      id: uuidv4(),
      reference,
      wasteDescription: data.wasteDescription,
      wasteQuantity:
        data.wasteDescription.status === 'NotStarted'
          ? { status: 'CannotStart' }
          : { status: 'NotStarted' },
      exporterDetail: data.exporterDetail,
      importerDetail: data.importerDetail,
      collectionDate: { status: 'NotStarted' },
      carriers: this.copyCarriersNoTransport(
        data.carriers,
        this.isSmallWaste(data.wasteDescription)
      ),
      collectionDetail: data.collectionDetail,
      ukExitLocation: data.ukExitLocation,
      transitCountries: data.transitCountries,
      recoveryFacilityDetail: this.copyRecoveryFacilities(
        data.recoveryFacilityDetail
      ),
      submissionConfirmation: { status: 'CannotStart' },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };
    const submissionData: DraftSubmissionData = { ...submission, accountId };

    try {
      const { resource: item } = await this.cosmosDb
        .container(this.draftContainerName)
        .item(submission.id, accountId)
        .read();

      if (!item) {
        const createItem = {
          id: submission.id,
          value: submissionData,
          partitionKey: accountId,
        };
        await this.cosmosDb
          .container(this.draftContainerName)
          .items.create(createItem);
      } else {
        const replaceOperation: PatchOperation[] = [
          {
            op: 'replace',
            path: '/value',
            value: submissionData,
          },
        ];
        await this.cosmosDb
          .container(this.draftContainerName)
          .item(submission.id, accountId)
          .patch(replaceOperation);
      }
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
    return submission;
  }
}
