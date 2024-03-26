import {
  CosmosClient,
  Database,
  PatchOperation,
  SqlQuerySpec,
} from '@azure/cosmos';
import { v4 as uuidv4 } from 'uuid';
import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { TemplateRepository } from './templates-repository';
import {
  SubmissionBase,
  Template,
  TemplatePageMetadata,
  TemplateSummary,
  TemplateSummaryPage,
} from '../model';
import { CosmosBaseRepository } from './cosmos-base';

type TemplateData = Template & { accountId: string };

export default class CosmosTemplateRepository
  extends CosmosBaseRepository
  implements TemplateRepository
{
  private cosmosDb: Database;

  constructor(
    private cosmosClient: CosmosClient,
    private cosmosDbName: string,
    private templateContainerName: string,
    private draftContainerName: string,
    private logger: Logger
  ) {
    super();
    this.cosmosDb = this.cosmosClient.database(this.cosmosDbName);
  }

  async getTemplate(id: string, accountId: string): Promise<Template> {
    const { resource: item } = await this.cosmosDb
      .container(this.templateContainerName)
      .item(id, accountId)
      .read();
    if (!item) {
      throw Boom.notFound();
    }

    const data = item.value as TemplateData;
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
  }

  async getNumberOfTemplates(accountId: string): Promise<number> {
    const querySpec: SqlQuerySpec = {
      query: `SELECT value count(c.id) FROM c
              WHERE
                c["value"].accountId = @accountId`,
      parameters: [
        {
          name: '@accountId',
          value: accountId,
        },
      ],
    };
    const results = await this.cosmosDb
      .container(this.templateContainerName)
      .items.query(querySpec)
      .fetchNext();

    return results.resources[0];
  }

  async getTemplates(
    accountId: string,
    order: 'ASC' | 'DESC',
    pageLimit = 15,
    token?: string
  ): Promise<TemplateSummaryPage> {
    const querySpec: SqlQuerySpec = {
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

    let hasMorePages = true;
    let totalSubmissions = 0;
    let totalPages = 0;
    let currentPage = 0;
    let pageNumber = 0;
    let contToken = '';
    const metadataArray: TemplatePageMetadata[] = [];
    let values: ReadonlyArray<TemplateSummary> = [];

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
        .container(this.templateContainerName)
        .items.query(querySpec, options)
        .fetchNext();

      if (results === undefined) {
        return {
          totalTemplates: 0,
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
          const s = r.value as TemplateData;
          return {
            id: s.id,
            templateDetails: s.templateDetails,
            wasteDescription: s.wasteDescription,
            exporterDetail: { status: s.exporterDetail.status },
            importerDetail: { status: s.importerDetail.status },
            carriers: { status: s.carriers.status },
            collectionDetail: { status: s.collectionDetail.status },
            ukExitLocation: { status: s.ukExitLocation.status },
            transitCountries: { status: s.transitCountries.status },
            recoveryFacilityDetail: { status: s.recoveryFacilityDetail.status },
          };
        });
        currentPage = pageNumber;
      }

      contToken = continuationToken;

      const pageMetadata: TemplatePageMetadata = {
        pageNumber: pageNumber,
        token: continuationToken ?? '',
      };
      metadataArray.push(pageMetadata);

      if (!hasMoreResults && token === '') {
        break;
      }
    }

    return {
      totalTemplates: totalSubmissions,
      totalPages: totalPages,
      currentPage: currentPage,
      pages: metadataArray,
      values: values,
    };
  }

  async saveTemplate(template: Template, accountId: string): Promise<void> {
    const data: TemplateData = { ...template, accountId };
    try {
      const { resource: item } = await this.cosmosDb
        .container(this.templateContainerName)
        .item(data.id, data.accountId)
        .read();

      if (!item) {
        const createItem = {
          id: data.id,
          value: data,
          partitionKey: data.accountId,
        };
        await this.cosmosDb
          .container(this.templateContainerName)
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
          .container(this.templateContainerName)
          .item(data.id, data.accountId)
          .patch(replaceOperation);
      }
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        err.code === 409
      ) {
        throw Boom.conflict('A template with this name already exists');
      }
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }

  async deleteTemplate(id: string, accountId: string): Promise<void> {
    try {
      await this.cosmosDb
        .container(this.templateContainerName)
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

  async createTemplateFromDraft(
    id: string,
    accountId: string,
    templateName: string,
    templateDescription: string
  ): Promise<Template> {
    const { resource: item } = await this.cosmosDb
      .container(this.draftContainerName)
      .item(id, accountId)
      .read();
    if (!item) {
      throw Boom.notFound();
    }

    const data = item.value as SubmissionBase;
    const template: Template = {
      id: uuidv4(),
      templateDetails: {
        name: templateName,
        description: templateDescription,
        created: new Date(),
        lastModified: new Date(),
      },
      wasteDescription: data.wasteDescription,
      exporterDetail: data.exporterDetail,
      importerDetail: data.importerDetail,
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
    };
    const templateData: TemplateData = { ...template, accountId };

    try {
      const { resource: item } = await this.cosmosDb
        .container(this.templateContainerName)
        .item(template.id, accountId)
        .read();

      if (!item) {
        const createItem = {
          id: template.id,
          value: templateData,
          partitionKey: accountId,
        };
        await this.cosmosDb
          .container(this.templateContainerName)
          .items.create(createItem);
      } else {
        const replaceOperation: PatchOperation[] = [
          {
            op: 'replace',
            path: '/value',
            value: templateData,
          },
        ];
        await this.cosmosDb
          .container(this.templateContainerName)
          .item(template.id, accountId)
          .patch(replaceOperation);
      }
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
    return template;
  }
}
