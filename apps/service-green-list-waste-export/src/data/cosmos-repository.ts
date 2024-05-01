import {
  CosmosClient,
  Database,
  PatchOperation,
  SqlQuerySpec,
} from '@azure/cosmos';
import Boom from '@hapi/boom';
import { Logger } from 'winston';
import {
  DraftSubmission,
  PageMetadata,
  RecordStateStatus,
  RecordSummaryPage,
  Submission,
  Template,
  DraftSubmissionSummary,
  SubmissionSummary,
  TemplateSummary,
  DbContainerNameKey,
} from '../model';
import { IRepository } from './repository';

type RecordData<T> = T & { accountId: string };

const RecordStateStatusQueryMap = new Map<string, RecordStateStatus[]>([
  ['incomplete', ['InProgress']],
  ['completeWithEstimates', ['SubmittedWithEstimates']],
  ['completeWithActuals', ['UpdatedWithActuals', 'SubmittedWithActuals']],
]);

function getListQuery(
  containerName: DbContainerNameKey,
  accountId: string,
  order: 'ASC' | 'DESC',
  state?: RecordStateStatus[],
  ids?: string[]
): SqlQuerySpec {
  let querySpec: SqlQuerySpec;
  if (containerName === 'templates') {
    querySpec = {
      query: `SELECT * FROM c
                  WHERE
                    c["value"].accountId = @accountId
                  ORDER BY
                    c["value"]["templateDetails"].lastModified ${order}`,
      parameters: [
        {
          name: '@accountId',
          value: accountId,
        },
      ],
    };
  } else {
    if (!state) {
      if (!ids) {
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
                        c["value"].accountId = @accountId
                      AND
                        ARRAY_CONTAINS(@ids, c["value"].id)
                      ORDER BY
                        c["value"]["submissionState"].timestamp ${order}`,
          parameters: [
            {
              name: '@accountId',
              value: accountId,
            },
            {
              name: '@ids',
              value: ids,
            },
          ],
        };
      }
    } else {
      if (!ids) {
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
      } else {
        querySpec = {
          query: `SELECT * FROM c 
                      WHERE
                        c["value"].accountId = @accountId
                      AND
                        ARRAY_CONTAINS(@ids, c["value"].id)
                      AND
                        ARRAY_CONTAINS(@state, c["value"]["submissionState"].status)
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
            {
              name: '@ids',
              value: ids,
            },
          ],
        };
      }
    }
  }
  return querySpec;
}

function getTotalNumberQuery(
  containerName: DbContainerNameKey,
  accountId: string,
  estimate?: boolean
): SqlQuerySpec {
  let querySpec: SqlQuerySpec;
  if (containerName === 'templates') {
    querySpec = {
      query: `SELECT VALUE COUNT(1) FROM c
                  WHERE
                    c["value"].accountId = @accountId`,
      parameters: [
        {
          name: '@accountId',
          value: accountId,
        },
      ],
    };
  } else {
    const state =
      containerName === 'drafts'
        ? (RecordStateStatusQueryMap.get('incomplete') as RecordStateStatus[])
        : !estimate
        ? (RecordStateStatusQueryMap.get(
            'completeWithActuals'
          ) as RecordStateStatus[])
        : (RecordStateStatusQueryMap.get(
            'completeWithEstimates'
          ) as RecordStateStatus[]);

    querySpec = {
      query: `SELECT VALUE COUNT(1) FROM c
              WHERE
                ARRAY_CONTAINS(@state, c["value"]["submissionState"].status)
              AND
                c["value"].accountId = @accountId`,
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
  return querySpec;
}

export default class CosmosRepository
  implements IRepository<DraftSubmission | Submission | Template>
{
  private cosmosDb: Database;

  constructor(
    private cosmosClient: CosmosClient,
    private cosmosDbName: string,
    private cosmosContainerMap: Map<DbContainerNameKey, string>,
    private logger: Logger
  ) {
    this.cosmosDb = this.cosmosClient.database(this.cosmosDbName);
  }

  async getRecords(
    containerName: DbContainerNameKey,
    accountId: string,
    order: 'ASC' | 'DESC',
    pageLimit = 15,
    token?: string,
    state?: RecordStateStatus[],
    ids?: string[],
    includeAllData?: boolean
  ): Promise<
    RecordSummaryPage<
      | DraftSubmissionSummary
      | SubmissionSummary
      | TemplateSummary
      | DraftSubmission
      | Submission
      | Template
    >
  > {
    let hasMorePages = true;
    let totalRecords = 0;
    let totalPages = 0;
    let currentPage = 0;
    let pageNumber = 0;
    let contToken = '';
    const metadataArray: PageMetadata[] = [];
    let values: ReadonlyArray<
      DraftSubmissionSummary | SubmissionSummary | TemplateSummary
    > = [];

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
        .container(this.cosmosContainerMap.get(containerName) as string)
        .items.query(
          getListQuery(containerName, accountId, order, state, ids),
          options
        )
        .fetchNext();

      if (results === undefined) {
        return {
          totalRecords: 0,
          totalPages: 0,
          currentPage: 0,
          pages: [],
          values: [],
        };
      }

      hasMorePages = hasMoreResults;
      totalRecords += results.length;

      if ((!token && pageNumber === 1) || token === contToken) {
        values = results.map((r) => {
          if (containerName === 'templates') {
            const s = r.value as RecordData<Template>;
            if (!includeAllData) {
              return {
                id: s.id,
                templateDetails: s.templateDetails,
              };
            }

            return {
              id: s.id,
              templateDetails: s.templateDetails,
              wasteDescription: s.wasteDescription,
              exporterDetail: s.exporterDetail,
              importerDetail: s.importerDetail,
              carriers: s.carriers,
              collectionDetail: s.collectionDetail,
              ukExitLocation: s.ukExitLocation,
              transitCountries: s.transitCountries,
              recoveryFacilityDetail: s.recoveryFacilityDetail,
            };
          } else if (containerName === 'drafts') {
            const s = r.value as RecordData<DraftSubmission>;
            if (!includeAllData) {
              return {
                id: s.id,
                reference: s.reference,
                wasteDescription: s.wasteDescription,
                collectionDate: s.collectionDate,
                submissionDeclaration: s.submissionDeclaration,
                submissionState: s.submissionState,
              };
            }

            return {
              id: s.id,
              reference: s.reference,
              wasteDescription: s.wasteDescription,
              wasteQuantity: s.wasteQuantity,
              exporterDetail: s.exporterDetail,
              importerDetail: s.importerDetail,
              collectionDate: s.collectionDate,
              carriers: s.carriers,
              collectionDetail: s.collectionDetail,
              ukExitLocation: s.ukExitLocation,
              transitCountries: s.transitCountries,
              recoveryFacilityDetail: s.recoveryFacilityDetail,
              submissionConfirmation: s.submissionConfirmation,
              submissionDeclaration: s.submissionDeclaration,
              submissionState: s.submissionState,
            };
          } else {
            const s = r.value as RecordData<Submission>;
            if (!includeAllData) {
              return {
                id: s.id,
                reference: s.reference,
                wasteDescription: s.wasteDescription,
                collectionDate: s.collectionDate,
                submissionDeclaration: s.submissionDeclaration,
                submissionState: s.submissionState,
              };
            }

            return {
              id: s.id,
              reference: s.reference,
              wasteDescription: s.wasteDescription,
              wasteQuantity: s.wasteQuantity,
              exporterDetail: s.exporterDetail,
              importerDetail: s.importerDetail,
              collectionDate: s.collectionDate,
              carriers: s.carriers,
              collectionDetail: s.collectionDetail,
              ukExitLocation: s.ukExitLocation,
              transitCountries: s.transitCountries,
              recoveryFacilityDetail: s.recoveryFacilityDetail,
              submissionDeclaration: s.submissionDeclaration,
              submissionState: s.submissionState,
            };
          }
        });
        currentPage = pageNumber;
      }

      contToken = continuationToken;

      const pageMetadata: PageMetadata = {
        pageNumber: pageNumber,
        token: continuationToken ?? '',
      };
      metadataArray.push(pageMetadata);

      if (!hasMoreResults && token === '') {
        break;
      }
    }

    return {
      totalRecords: totalRecords,
      totalPages: totalPages,
      currentPage: currentPage,
      pages: metadataArray,
      values: values,
    };
  }

  async getRecord(
    containerName: DbContainerNameKey,
    id: string,
    accountId: string
  ): Promise<DraftSubmission | Submission | Template> {
    const { resource: item } = await this.cosmosDb
      .container(this.cosmosContainerMap.get(containerName) as string)
      .item(id, accountId)
      .read();
    if (!item) {
      throw Boom.notFound();
    }

    if (containerName === 'templates') {
      const data = item.value as RecordData<Template>;
      return {
        id: data.id,
        templateDetails: data.templateDetails,
        wasteDescription: data.wasteDescription,
        exporterDetail: data.exporterDetail,
        importerDetail: data.importerDetail,
        carriers: data.carriers,
        collectionDetail: data.collectionDetail,
        ukExitLocation: data.ukExitLocation,
        transitCountries: data.transitCountries,
        recoveryFacilityDetail: data.recoveryFacilityDetail,
      };
    } else if (containerName === 'drafts') {
      const data = item.value as RecordData<DraftSubmission>;
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
    } else {
      const data = item.value as RecordData<Submission>;
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
        submissionDeclaration: data.submissionDeclaration,
        submissionState: data.submissionState,
      };
    }
  }

  async saveRecord(
    containerName: DbContainerNameKey,
    value: DraftSubmission | Submission | Template,
    accountId: string
  ): Promise<void> {
    const data: RecordData<DraftSubmission | Submission | Template> = {
      ...value,
      accountId,
    };
    try {
      const { resource: item } = await this.cosmosDb
        .container(this.cosmosContainerMap.get(containerName) as string)
        .item(data.id, data.accountId)
        .read();

      if (!item) {
        const createItem = {
          id: data.id,
          value: data,
          partitionKey: data.accountId,
        };
        await this.cosmosDb
          .container(this.cosmosContainerMap.get(containerName) as string)
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
          .container(this.cosmosContainerMap.get(containerName) as string)
          .item(data.id, data.accountId)
          .patch(replaceOperation);
      }
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        err.code === 409
      ) {
        throw Boom.conflict(
          `A ${containerName.substring(
            0,
            containerName.length - 1
          )} with this name already exists`
        );
      }
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }

  async createBulkRecords(
    containerName: DbContainerNameKey,
    accountId: string,
    values: Submission[]
  ): Promise<void> {
    const submissions = values.map((s) => {
      return {
        value: {
          accountId,
          ...s,
        },
        id: s.id,
      };
    });

    try {
      const chunkSize = 50;
      for (let i = 0; i < submissions.length; i += chunkSize) {
        const chunk = submissions.slice(i, i + chunkSize);
        await this.cosmosDb
          .container(this.cosmosContainerMap.get(containerName) as string)
          .scripts.storedProcedure('createBulkSubmissions')
          .execute(accountId, [chunk]);
      }
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }

  async deleteRecord(
    containerName: DbContainerNameKey,
    id: string,
    accountId: string
  ): Promise<void> {
    try {
      await this.cosmosDb
        .container(this.cosmosContainerMap.get(containerName) as string)
        .item(id, accountId)
        .delete();
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        err.code === 404
      ) {
        throw Boom.notFound();
      }
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }

  async getTotalNumber(
    containerName: DbContainerNameKey,
    accountId: string,
    estimate?: boolean
  ): Promise<number> {
    const options = {
      maxItemCount: -1,
      partitionKey: accountId,
    };

    const { resources: results } = await this.cosmosDb
      .container(this.cosmosContainerMap.get(containerName) as string)
      .items.query(
        getTotalNumberQuery(containerName, accountId, estimate),
        options
      )
      .fetchNext();

    if (results === undefined) {
      return 0;
    }

    return results[0];
  }
}
