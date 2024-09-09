import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/green-list-waste-export';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import { draft, submission, template } from './controller';
import { CosmosClient } from '@azure/cosmos';
import {
  AzureCliCredential,
  ChainedTokenCredential,
  WorkloadIdentityCredential,
} from '@azure/identity';
import { CosmosRepository } from './data';
import { DaprReferenceDataClient } from '@wts/client/reference-data';
import { DbContainerNameKey } from './model';
import {
  GetWasteCodesResponse,
  GetEWCCodesResponse,
  GetCountriesResponse,
  GetRecoveryCodesResponse,
  GetDisposalCodesResponse,
} from '@wts/api/reference-data';

if (!process.env['COSMOS_DB_ACCOUNT_URI']) {
  throw new Error('Missing COSMOS_DB_ACCOUNT_URI configuration.');
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: {
    appId: process.env['APP_ID'] || 'service-green-list-waste-export',
  },
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
  new WorkloadIdentityCredential(),
);

const dbClient = new CosmosClient({
  endpoint: process.env['COSMOS_DB_ACCOUNT_URI'],
  aadCredentials,
});

const cosmosContainerMap = new Map<DbContainerNameKey, string>([
  ['drafts', process.env['COSMOS_DRAFTS_CONTAINER_NAME'] || 'drafts'],
  [
    'submissions',
    process.env['COSMOS_SUBMISSIONS_CONTAINER_NAME'] || 'submissions',
  ],
  ['templates', process.env['COSMOS_TEMPLATES_CONTAINER_NAME'] || 'templates'],
]);

const repository = new CosmosRepository(
  dbClient,
  process.env['COSMOS_DATABASE_NAME'] || 'annex-vii',
  cosmosContainerMap,
  logger,
);

const referenceDataClient = new DaprReferenceDataClient(
  server.client,
  process.env['REFERENCE_DATA_APP_ID'] || 'service-reference-data',
);

async function init() {
  let wasteCodesResponse: GetWasteCodesResponse;
  let ewcCodesResponse: GetEWCCodesResponse;
  let countriesResponse: GetCountriesResponse;
  let countriesIncludingUkResponse: GetCountriesResponse;
  let recoveryCodesResponse: GetRecoveryCodesResponse;
  let disposalCodesResponse: GetDisposalCodesResponse;

  try {
    wasteCodesResponse = await referenceDataClient.getWasteCodes();
    ewcCodesResponse = await referenceDataClient.getEWCCodes({});
    countriesResponse = await referenceDataClient.getCountries({});
    countriesIncludingUkResponse = await referenceDataClient.getCountries({
      includeUk: true,
    });
    recoveryCodesResponse = await referenceDataClient.getRecoveryCodes();
    disposalCodesResponse = await referenceDataClient.getDisposalCodes();
  } catch (error) {
    logger.error(error);
    throw new Error('Failed to get reference datasets');
  }

  if (
    !wasteCodesResponse.success ||
    !ewcCodesResponse.success ||
    !countriesResponse.success ||
    !countriesIncludingUkResponse.success ||
    !recoveryCodesResponse.success ||
    !disposalCodesResponse.success
  ) {
    throw new Error('Failed to get reference datasets');
  }

  const draftController = new draft.DraftController(
    repository,
    wasteCodesResponse.value,
    ewcCodesResponse.value,
    countriesResponse.value,
    logger,
  );
  const templateController = new template.TemplateController(
    repository,
    wasteCodesResponse.value,
    ewcCodesResponse.value,
    countriesResponse.value,
    logger,
  );

  const submissionController = new submission.SubmissionController(
    repository,
    wasteCodesResponse.value,
    ewcCodesResponse.value,
    countriesResponse.value,
    countriesIncludingUkResponse.value,
    recoveryCodesResponse.value,
    disposalCodesResponse.value,
    logger,
  );

  await server.invoker.listen(
    api.draft.getDraft.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraft(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDrafts.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftsRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDrafts(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.createDraft.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(body) as api.draft.CreateDraftRequest;
      if (!draft.validate.createDraftRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.createDraft(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.createDraftFromTemplate.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.template.CreateDraftFromTemplateRequest;
      if (!template.validate.createDraftFromTemplateRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.createDraftFromTemplate(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.deleteDraft.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.deleteDraftRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.deleteDraft(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.submission.cancelSubmission.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.submission.CancelSubmissionRequest;
      if (!submission.validate.cancelSubmissionRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.cancelSubmission(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftCustomerReference.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftCustomerReferenceRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftCustomerReference(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftCustomerReference.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftCustomerReferenceRequest;
      if (!draft.validate.setDraftCustomerReferenceRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftCustomerReference(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftWasteDescription.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftWasteDescriptionRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftWasteDescription(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftWasteDescription.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftWasteDescriptionRequest;
      if (!draft.validate.setDraftWasteDescriptionRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftWasteDescription(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftWasteQuantity.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftWasteQuantityRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftWasteQuantity(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftWasteQuantity.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftWasteQuantityRequest;
      if (!draft.validate.setDraftWasteQuantityRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftWasteQuantity(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftExporterDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftExporterDetailRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftExporterDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftExporterDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftExporterDetailRequest;
      if (!draft.validate.setDraftExporterDetailRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftExporterDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftImporterDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftImporterDetailRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftImporterDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftImporterDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftImporterDetailRequest;
      if (!draft.validate.setDraftImporterDetailRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftImporterDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftCollectionDate.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftCollectionDateRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftCollectionDate(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftCollectionDate.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftCollectionDateRequest;
      if (!draft.validate.setDraftCollectionDateRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftCollectionDate(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.listDraftCarriers.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.listDraftCarriersRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.listDraftCarriers(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftCarriers.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftCarriersRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftCarriers(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.createDraftCarriers.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(body) as api.draft.CreateDraftCarriersRequest;
      if (!draft.validate.createDraftCarriersRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.createDraftCarriers(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftCarriers.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(body) as api.draft.SetDraftCarriersRequest;
      if (!draft.validate.setDraftCarriersRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftCarriers(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.deleteDraftCarriers.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.deleteDraftCarriersRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.deleteDraftCarriers(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftCollectionDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftCollectionDetailRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftCollectionDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftCollectionDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftCollectionDetailRequest;
      if (!draft.validate.setDraftCollectionDetailRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftCollectionDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftUkExitLocation.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftExitLocationRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftUkExitLocation(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftUkExitLocation.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftUkExitLocationRequest;
      if (!draft.validate.setDraftExitLocationRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftUkExitLocation(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftTransitCountries.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftTransitCountriesRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftTransitCountries(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftTransitCountries.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftTransitCountriesRequest;
      if (!draft.validate.setDraftTransitCountriesRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftTransitCountries(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.listDraftRecoveryFacilityDetails.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.listDraftRecoveryFacilityDetailsRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.listDraftRecoveryFacilityDetails(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftRecoveryFacilityDetails.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftRecoveryFacilityDetailsRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftRecoveryFacilityDetails(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.createDraftRecoveryFacilityDetails.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.CreateDraftRecoveryFacilityDetailsRequest;
      if (!draft.validate.createDraftRecoveryFacilityDetailsRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.createDraftRecoveryFacilityDetails(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftRecoveryFacilityDetails.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftRecoveryFacilityDetailsRequest;
      if (!draft.validate.setDraftRecoveryFacilityDetailsRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftRecoveryFacilityDetails(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.deleteDraftRecoveryFacilityDetails.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request =
        draft.parse.deleteDraftRecoveryFacilityDetailsRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.deleteDraftRecoveryFacilityDetails(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftSubmissionConfirmation.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftSubmissionConfirmationRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftSubmissionConfirmation(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftSubmissionConfirmation.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftSubmissionConfirmationRequest;
      if (!draft.validate.setDraftSubmissionConfirmationRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftSubmissionConfirmation(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.getDraftSubmissionDeclaration.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftSubmissionDeclarationRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.getDraftSubmissionDeclaration(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.draft.setDraftSubmissionDeclaration.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftSubmissionDeclarationRequest;
      if (!draft.validate.setDraftSubmissionDeclarationRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await draftController.setDraftSubmissionDeclaration(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.getTemplate.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = template.parse.getTemplateRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.getTemplate(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.getTemplates.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = template.parse.getTemplatesRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.getTemplates(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.getNumberOfTemplates.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = template.parse.getNumberOfTemplatesRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.getNumberOfTemplates(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.createTemplate.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(body) as api.template.CreateTemplateRequest;
      if (!template.validate.createTemplateRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.createTemplate(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.createTemplateFromSubmission.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.template.CreateTemplateFromSubmissionRequest;
      if (!template.validate.createTemplateFromSubmissionRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.createTemplateFromSubmission(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.createTemplateFromTemplate.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.template.CreateTemplateFromTemplateRequest;
      if (!template.validate.createTemplateFromTemplateRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.createTemplateFromTemplate(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.updateTemplate.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(body) as api.template.UpdateTemplateRequest;
      if (!template.validate.updateTemplateRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.updateTemplate(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.deleteTemplate.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = template.parse.deleteTemplateRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.deleteTemplate(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.getTemplateWasteDescription.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftWasteDescriptionRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.getTemplateWasteDescription(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.setTemplateWasteDescription.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftWasteDescriptionRequest;
      if (!draft.validate.setDraftWasteDescriptionRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.setTemplateWasteDescription(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.getTemplateExporterDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftExporterDetailRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.getTemplateExporterDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.setTemplateExporterDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftExporterDetailRequest;
      if (!draft.validate.setDraftExporterDetailRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.setTemplateExporterDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.getTemplateImporterDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftImporterDetailRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.getTemplateImporterDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.setTemplateImporterDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftImporterDetailRequest;
      if (!draft.validate.setDraftImporterDetailRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.setTemplateImporterDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.listTemplateCarriers.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.listDraftCarriersRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.listTemplateCarriers(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.getTemplateCarriers.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftCarriersRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.getTemplateCarriers(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.createTemplateCarriers.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(body) as api.draft.CreateDraftCarriersRequest;
      if (!draft.validate.createDraftCarriersRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.createTemplateCarriers(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.setTemplateCarriers.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(body) as api.draft.SetDraftCarriersRequest;
      if (!draft.validate.setDraftCarriersRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.setTemplateCarriers(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.deleteTemplateCarriers.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.deleteDraftCarriersRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.deleteTemplateCarriers(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.getTemplateCollectionDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftCollectionDetailRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.getTemplateCollectionDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.setTemplateCollectionDetail.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftCollectionDetailRequest;
      if (!draft.validate.setDraftCollectionDetailRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.setTemplateCollectionDetail(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.getTemplateUkExitLocation.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftExitLocationRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.getTemplateUkExitLocation(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.setTemplateUkExitLocation.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftUkExitLocationRequest;
      if (!draft.validate.setDraftExitLocationRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.setTemplateUkExitLocation(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.getTemplateTransitCountries.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftTransitCountriesRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.getTemplateTransitCountries(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.setTemplateTransitCountries.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftTransitCountriesRequest;
      if (!draft.validate.setDraftTransitCountriesRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.setTemplateTransitCountries(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.listTemplateRecoveryFacilityDetails.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.listDraftRecoveryFacilityDetailsRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.listTemplateRecoveryFacilityDetails(
        request,
      );
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.getTemplateRecoveryFacilityDetails.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = draft.parse.getDraftRecoveryFacilityDetailsRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.getTemplateRecoveryFacilityDetails(
        request,
      );
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.createTemplateRecoveryFacilityDetails.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.CreateDraftRecoveryFacilityDetailsRequest;
      if (!draft.validate.createDraftRecoveryFacilityDetailsRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.createTemplateRecoveryFacilityDetails(
        request,
      );
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.setTemplateRecoveryFacilityDetails.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.draft.SetDraftRecoveryFacilityDetailsRequest;
      if (!draft.validate.setDraftRecoveryFacilityDetailsRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.setTemplateRecoveryFacilityDetails(
        request,
      );
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.template.deleteTemplateRecoveryFacilityDetails.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request =
        draft.parse.deleteDraftRecoveryFacilityDetailsRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await templateController.deleteTemplateRecoveryFacilityDetails(
        request,
      );
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.submission.getNumberOfSubmissions.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = submission.parse.getNumberOfSubmissionsRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.getNumberOfSubmissions(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.submission.getSubmission.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = submission.parse.getSubmissionRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.getSubmission(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.submission.getSubmissions.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = submission.parse.getSubmissionsRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.getSubmissions(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.submission.getWasteQuantity.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = submission.parse.getWasteQuantityRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.getWasteQuantity(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.submission.setWasteQuantity.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.submission.SetWasteQuantityRequest;
      if (!submission.validate.setWasteQuantityRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.setWasteQuantity(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.submission.getCollectionDate.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = submission.parse.getCollectionDateRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.getCollectionDate(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.submission.setCollectionDate.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.submission.SetCollectionDateRequest;
      if (!submission.validate.setCollectionDateRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.setCollectionDate(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.submission.validateSubmissions.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.submission.ValidateSubmissionsRequest;
      if (!submission.validate.validateSubmissionsRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.validateSubmissions(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.submission.createSubmissions.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = JSON.parse(
        body,
      ) as api.submission.CreateSubmissionsRequest;
      if (!submission.validate.validateCreateSubmissionsRequest(request)) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.createSubmissions(request);
    },
    { method: HttpMethod.POST },
  );

  await server.invoker.listen(
    api.submission.getBulkSubmissions.name,
    async ({ body }) => {
      if (body === undefined) {
        return fromBoom(Boom.badRequest('Missing body'));
      }

      const request = submission.parse.getBulkSubmissionsRequest(body);
      if (request === undefined) {
        return fromBoom(Boom.badRequest());
      }

      return await submissionController.getBulkSubmissions(request);
    },
    { method: HttpMethod.POST },
  );

  await server.start();
}

init();
