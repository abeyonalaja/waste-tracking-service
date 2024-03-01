import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/annex-vii';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import {
  DraftController,
  TemplateController,
  parseDraft,
  parseTemplate,
  validateDraft,
  validateSubmission,
} from './controller';
import { CosmosClient } from '@azure/cosmos';
import {
  AzureCliCredential,
  ChainedTokenCredential,
  WorkloadIdentityCredential,
} from '@azure/identity';
import { CosmosDraftRepository } from './data';
import CosmosTemplateRepository from './data/cosmos-templates';
import SubmissionController from './controller/submission-controller';
import { DaprReferenceDataClient } from '@wts/client/reference-data';

if (!process.env['COSMOS_DB_ACCOUNT_URI']) {
  throw new Error('Missing COSMOS_DB_ACCOUNT_URI configuration.');
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: process.env['APP_ID'] },
  transports: [new winston.transports.Console()],
});

const server = new DaprServer({
  serverHost: '127.0.0.1',
  clientOptions: {
    daprHost: '127.0.0.1',
  },
  logger: {
    level: LogLevel.Info,
    service: new LoggerService(logger),
  },
});

const aadCredentials = new ChainedTokenCredential(
  new AzureCliCredential(),
  new WorkloadIdentityCredential()
);

const dbClient = new CosmosClient({
  endpoint: process.env['COSMOS_DB_ACCOUNT_URI'],
  aadCredentials,
});

const draftController = new DraftController(
  new CosmosDraftRepository(
    dbClient,
    process.env['COSMOS_DATABASE_NAME'] || 'annex-vii',
    process.env['COSMOS_DRAFTS_CONTAINER_NAME'] || 'drafts',
    process.env['COSMOS_SUBMISSIONS_CONTAINER_NAME'] || 'submissions',
    process.env['COSMOS_TEMPLATES_CONTAINER_NAME'] || 'templates',
    logger
  ),
  logger
);

const templateController = new TemplateController(
  new CosmosTemplateRepository(
    dbClient,
    process.env['COSMOS_DATABASE_NAME'] || 'annex-vii',
    process.env['COSMOS_TEMPLATES_CONTAINER_NAME'] || 'templates',
    process.env['COSMOS_DRAFTS_CONTAINER_NAME'] || 'drafts',
    logger
  ),
  logger
);

const submissionController = new SubmissionController(
  new DaprReferenceDataClient(
    server.client,
    process.env['REFERENCE_DATA_APP_ID'] || 'reference-data'
  ),
  logger
);

await server.invoker.listen(
  api.getDraftById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDrafts.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDrafts(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createDraft.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.createDraftRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.createDraft(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createDraftFromTemplate.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateDraftFromTemplateRequest;
    if (!validateDraft.createDraftFromTemplateRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.createDraftFromTemplate(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteDraft.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.deleteDraftRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.deleteDraft(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.cancelDraft.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CancelDraftByIdRequest;
    if (!validateDraft.setDraftSubmissionCancellationByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.cancelDraft(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftCustomerReferenceById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftCustomerReferenceByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftCustomerReferenceById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftCustomerReferenceById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(
      body
    ) as api.SetDraftCustomerReferenceByIdRequest;
    if (!validateDraft.setDraftCustomerReferenceByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftCustomerReferenceById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftWasteDescriptionById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftWasteDescriptionByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftWasteDescriptionById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftWasteDescriptionById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftWasteDescriptionByIdRequest;
    if (!validateDraft.setDraftWasteDescriptionByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftWasteDescriptionById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftWasteQuantityById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftWasteQuantityByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftWasteQuantityById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftWasteQuantityById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftWasteQuantityByIdRequest;
    if (!validateDraft.setDraftWasteQuantityByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftWasteQuantityById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftExporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftExporterDetailByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftExporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftExporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftExporterDetailByIdRequest;
    if (!validateDraft.setDraftExporterDetailByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftExporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftImporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftImporterDetailByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftImporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftImporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftImporterDetailByIdRequest;
    if (!validateDraft.setDraftImporterDetailByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftImporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftCollectionDateById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftCollectionDateByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftCollectionDateById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftCollectionDateById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftCollectionDateByIdRequest;
    if (!validateDraft.setDraftCollectionDateByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftCollectionDateById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.listDraftCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.listDraftCarriersRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.listDraftCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftCarriersRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createDraftCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateDraftCarriersRequest;
    if (!validateDraft.createDraftCarriersRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.createDraftCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftCarriersRequest;
    if (!validateDraft.setDraftCarriersRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteDraftCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.deleteDraftCarriersRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.deleteDraftCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftCollectionDetail.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftCollectionDetailRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftCollectionDetail(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftCollectionDetail.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftCollectionDetailRequest;
    if (!validateDraft.setDraftCollectionDetailRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftCollectionDetail(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftExitLocationById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftExitLocationByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftExitLocationById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftExitLocationById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftExitLocationByIdRequest;
    if (!validateDraft.setDraftExitLocationByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftExitLocationById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftTransitCountries.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftTransitCountriesRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftTransitCountries(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftTransitCountries.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftTransitCountriesRequest;
    if (!validateDraft.setDraftTransitCountriesRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftTransitCountries(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.listDraftRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.listDraftRecoveryFacilityDetailsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.listDraftRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftRecoveryFacilityDetailsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createDraftRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(
      body
    ) as api.CreateDraftRecoveryFacilityDetailsRequest;
    if (!validateDraft.createDraftRecoveryFacilityDetailsRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.createDraftRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(
      body
    ) as api.SetDraftRecoveryFacilityDetailsRequest;
    if (!validateDraft.setDraftRecoveryFacilityDetailsRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteDraftRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.deleteDraftRecoveryFacilityDetailsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.deleteDraftRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftSubmissionConfirmationById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftSubmissionConfirmationByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftSubmissionConfirmationById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftSubmissionConfirmationById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(
      body
    ) as api.SetDraftSubmissionConfirmationByIdRequest;
    if (!validateDraft.setDraftSubmissionConfirmationByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftSubmissionConfirmationById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getDraftSubmissionDeclarationById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftSubmissionDeclarationByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getDraftSubmissionDeclarationById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setDraftSubmissionDeclarationById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(
      body
    ) as api.SetDraftSubmissionDeclarationByIdRequest;
    if (!validateDraft.setDraftSubmissionDeclarationByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.setDraftSubmissionDeclarationById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getTemplateById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseTemplate.getTemplateByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.getTemplateById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getTemplates.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseTemplate.getTemplatesRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.getTemplates(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getNumberOfTemplates.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseTemplate.getNumberOfTemplatesRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.getNumberOfTemplates(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createTemplate.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateTemplateRequest;
    if (!validateDraft.createTemplateRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.createTemplate(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createTemplateFromSubmission.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateTemplateFromSubmissionRequest;
    if (!validateDraft.createTemplateFromSubmissionRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.createTemplateFromSubmission(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createTemplateFromTemplate.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateTemplateFromTemplateRequest;
    if (!validateDraft.createTemplateFromTemplateRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.createTemplateFromTemplate(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.updateTemplate.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.UpdateTemplateRequest;
    if (!validateDraft.updateTemplateRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.updateTemplate(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteTemplate.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.DeleteTemplateRequest;
    if (!validateDraft.deleteTemplateRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.deleteTemplate(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getTemplateWasteDescriptionById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftWasteDescriptionByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.getTemplateWasteDescriptionById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setTemplateWasteDescriptionById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftWasteDescriptionByIdRequest;
    if (!validateDraft.setDraftWasteDescriptionByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.setTemplateWasteDescriptionById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getTemplateExporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftExporterDetailByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.getTemplateExporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setTemplateExporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftExporterDetailByIdRequest;
    if (!validateDraft.setDraftExporterDetailByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.setTemplateExporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getTemplateImporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftImporterDetailByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.getTemplateImporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setTemplateImporterDetailById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftImporterDetailByIdRequest;
    if (!validateDraft.setDraftImporterDetailByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.setTemplateImporterDetailById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.listTemplateCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.listDraftCarriersRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.listTemplateCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getTemplateCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftCarriersRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.getTemplateCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createTemplateCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.CreateDraftCarriersRequest;
    if (!validateDraft.createDraftCarriersRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.createTemplateCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setTemplateCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftCarriersRequest;
    if (!validateDraft.setDraftCarriersRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.setTemplateCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteTemplateCarriers.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.deleteDraftCarriersRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.deleteTemplateCarriers(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getTemplateCollectionDetail.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftCollectionDetailRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.getTemplateCollectionDetail(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setTemplateCollectionDetail.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftCollectionDetailRequest;
    if (!validateDraft.setDraftCollectionDetailRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.setTemplateCollectionDetail(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getTemplateExitLocationById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftExitLocationByIdRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.getTemplateExitLocationById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setTemplateExitLocationById.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftExitLocationByIdRequest;
    if (!validateDraft.setDraftExitLocationByIdRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.setTemplateExitLocationById(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getTemplateTransitCountries.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftTransitCountriesRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.getTemplateTransitCountries(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setTemplateTransitCountries.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.SetDraftTransitCountriesRequest;
    if (!validateDraft.setDraftTransitCountriesRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.setTemplateTransitCountries(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.listTemplateRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.listDraftRecoveryFacilityDetailsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.listTemplateRecoveryFacilityDetails(
      request
    );
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getTemplateRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getDraftRecoveryFacilityDetailsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.getTemplateRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.createTemplateRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(
      body
    ) as api.CreateDraftRecoveryFacilityDetailsRequest;
    if (!validateDraft.createDraftRecoveryFacilityDetailsRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.createTemplateRecoveryFacilityDetails(
      request
    );
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.setTemplateRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(
      body
    ) as api.SetDraftRecoveryFacilityDetailsRequest;
    if (!validateDraft.setDraftRecoveryFacilityDetailsRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.setTemplateRecoveryFacilityDetails(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.deleteTemplateRecoveryFacilityDetails.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.deleteDraftRecoveryFacilityDetailsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await templateController.deleteTemplateRecoveryFacilityDetails(
      request
    );
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.getNumberOfSubmissions.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parseDraft.getNumberOfSubmissionsRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await draftController.getNumberOfSubmissions(request);
  },
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.validateSubmissions.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.ValidateSubmissionsRequest;
    if (!validateSubmission.validateSubmissionsRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    return await submissionController.validateSubmissions(request);
  },
  { method: HttpMethod.POST }
);

await server.start();
