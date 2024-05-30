import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import * as winston from 'winston';
import * as api from '@wts/api/green-list-waste-export-bulk';
import { fromBoom } from '@wts/util/invocation';
import Boom from '@hapi/boom';
import { BatchController, validate, parse } from './controller';
import {
  ProcessErrorArgs,
  ServiceBusClient,
  delay,
  isServiceBusError,
} from '@azure/service-bus';
import {
  AzureCliCredential,
  ChainedTokenCredential,
  WorkloadIdentityCredential,
} from '@azure/identity';
import { CosmosBatchRepository } from './data';
import { CosmosClient } from '@azure/cosmos';
import { CsvValidator } from './lib/csv-validator';
import {
  BulkSubmission,
  ContentProcessingTask,
  ContentSubmissionTask,
  ContentToBeProcessedTask,
  ContentToBeSubmittedTask,
} from './model';
import { v4 as uuidv4 } from 'uuid';
import { CloudEvent, HTTP } from 'cloudevents';
import * as taskValidate from './lib/task-validation';
import { DaprAnnexViiClient } from '@wts/client/green-list-waste-export';
import { submission } from '@wts/api/green-list-waste-export';

if (!process.env['COSMOS_DB_ACCOUNT_URI']) {
  throw new Error('Missing COSMOS_DB_ACCOUNT_URI configuration.');
}

if (!process.env['SERVICE_BUS_HOST_NAME']) {
  throw new Error('Missing SERVICE_BUS_HOST_NAME configuration.');
}

const tasksQueueName =
  process.env['TASKS_QUEUE_NAME'] || 'annex-vii-bulk-tasks';
const submissionsQueueName =
  process.env['SUBMISSIONS_QUEUE_NAME'] || 'annex-vii-bulk-submissions';
const appId = process.env['APP_ID'] || 'service-green-list-waste-export-bulk';
const annexViiAppId =
  process.env['GLW_EXPORT_APP_ID'] || 'service-green-list-waste-export';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId: appId },
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
const repository = new CosmosBatchRepository(
  new CosmosClient({
    endpoint: process.env['COSMOS_DB_ACCOUNT_URI'],
    aadCredentials,
  }),
  process.env['COSMOS_DATABASE_NAME'] || 'annex-vii-bulk',
  process.env['COSMOS_DRAFTS_CONTAINER_NAME'] || 'drafts',
  logger,
);
const serviceBusClient = new ServiceBusClient(
  process.env['SERVICE_BUS_HOST_NAME'],
  aadCredentials,
);

const daprAnnexViiClient = new DaprAnnexViiClient(server.client, annexViiAppId);
const batchController = new BatchController(
  repository,
  daprAnnexViiClient,
  logger,
);
const csvValidator = new CsvValidator(logger);

await server.invoker.listen(
  api.addContentToBatch.name,
  async ({ body, headers }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.AddContentToBatchRequest;
    if (!validate.addContentToBatchRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    const response = await batchController.addContentToBatch(request);
    if (!response.success) {
      return response;
    }

    try {
      const task: ContentProcessingTask = {
        batchId: response.value.batchId,
        accountId: request.accountId,
        content: request.content,
      };
      const cloudEvent = new CloudEvent({
        specversion: '1.0',
        type: `${appId}.event.sent.ContentToBeProcessed`,
        source: `${appId}.${api.addContentToBatch.name}`,
        id: uuidv4(),
        time: new Date().toJSON(),
        datacontenttype: 'application/cloudevents+json',
        data: task,
        pubsubname: process.env['SERVICE_BUS_HOST_NAME'],
        queue: tasksQueueName,
        traceparent: headers?.traceparent || '',
        tracestate: headers?.tracestate || '',
      });
      const messages = [
        {
          body: HTTP.structured(cloudEvent),
        },
      ];
      const sender = serviceBusClient.createSender(tasksQueueName);
      let batch = await sender.createMessageBatch();
      for (const message of messages) {
        if (!batch.tryAddMessage(message)) {
          await sender.sendMessages(batch);
          batch = await sender.createMessageBatch();
          if (!batch.tryAddMessage(message)) {
            const message = 'Message too big to fit in a batch';
            logger.error(message);
            throw Boom.internal(message);
          }
        }
      }

      await sender.sendMessages(batch);
      logger.info(`Sent a batch of messages to the queue: ${tasksQueueName}`);
      await sender.close();
    } catch (err) {
      logger.error('Error publishing work item', { error: err });
      return fromBoom(Boom.internal());
    }

    return response;
  },
  {
    method: HttpMethod.POST,
  },
);

await server.invoker.listen(
  api.getBatch.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getBatchRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await batchController.getBatch(request);
  },
  { method: HttpMethod.POST },
);

await server.invoker.listen(
  api.updateBatch.name,
  async ({ body, headers }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.updateBatchRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    const response = await batchController.updateBatch(request);
    if (!response.success) {
      return response;
    }

    try {
      const task: ContentSubmissionTask = {
        batchId: request.id,
        accountId: request.accountId,
      };
      const cloudEvent = new CloudEvent({
        specversion: '1.0',
        type: `${appId}.event.sent.ContentToBeSubmitted`,
        source: `${appId}.${api.addContentToBatch.name}`,
        id: uuidv4(),
        time: new Date().toJSON(),
        datacontenttype: 'application/cloudevents+json',
        data: task,
        pubsubname: process.env['SERVICE_BUS_HOST_NAME'],
        queue: submissionsQueueName,
        traceparent: headers?.traceparent || '',
        tracestate: headers?.tracestate || '',
      });
      const messages = [
        {
          body: HTTP.structured(cloudEvent),
        },
      ];
      const sender = serviceBusClient.createSender(submissionsQueueName);
      let batch = await sender.createMessageBatch();
      for (const message of messages) {
        if (!batch.tryAddMessage(message)) {
          await sender.sendMessages(batch);
          batch = await sender.createMessageBatch();
          if (!batch.tryAddMessage(message)) {
            const message = 'Message too big to fit in a batch';
            logger.error(message);
            throw Boom.internal(message);
          }
        }
      }

      await sender.sendMessages(batch);
      logger.info(
        `Sent a batch of messages to the queue: ${submissionsQueueName}`,
      );
      await sender.close();
    } catch (err) {
      logger.error('Error publishing work item', { error: err });
      return fromBoom(Boom.internal());
    }

    return response;
  },
  { method: HttpMethod.POST },
);

await server.invoker.listen(
  api.getBatchContent.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.getBatchContentRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await batchController.getBatchContent(request);
  },
  { method: HttpMethod.POST },
);

await server.start();

const execute = true;
while (execute) {
  const receiver = serviceBusClient.createReceiver(tasksQueueName);
  const subscription = receiver.subscribe({
    processMessage: async (brokeredMessage) => {
      if (HTTP.isEvent(brokeredMessage.body)) {
        const body = JSON.parse(
          brokeredMessage.body.body,
        ) as ContentToBeProcessedTask;

        if (!taskValidate.receiveContentToBeProcessedTask(body)) {
          const message = `Data validation failed for queue message ID: ${brokeredMessage.messageId}`;
          logger.error(message);
          throw Boom.internal(message);
        }

        try {
          const records = await csvValidator.validateBatch(
            body.data as ContentProcessingTask,
          );
          if (!records.success) {
            if (records.error.statusCode !== 400) {
              throw new Boom.Boom(records.error.message, {
                statusCode: records.error.statusCode,
              });
            }
            const value: BulkSubmission = {
              id: body.data.batchId,
              state: {
                status: 'FailedCsvValidation',
                timestamp: new Date(),
                error: records.error.message,
              },
            };
            await repository.saveBatch(value, body.data.accountId);
          } else {
            const submissions: Omit<submission.PartialSubmission, 'id'>[] = [];
            const rowErrors: api.BulkSubmissionValidationRowError[] = [];

            let response: submission.ValidateSubmissionsResponse;
            try {
              response = await daprAnnexViiClient.validateSubmissions({
                accountId: body.data.accountId,
                padIndex: 2,
                values: records.value.rows,
              });
            } catch (err) {
              logger.error(
                `Error receiving response from ${annexViiAppId} service`,
                { error: err },
              );
              throw Boom.internal();
            }

            if (!response.success) {
              throw new Boom.Boom(response.error.message, {
                statusCode: response.error.statusCode,
              });
            }

            if (!response.value.valid) {
              response.value.values.map((v) =>
                rowErrors.push({
                  rowNumber: v.index,
                  errorAmount:
                    v.fieldFormatErrors.length +
                    v.invalidStructureErrors.length,
                  errorDetails: v.fieldFormatErrors
                    .map((f) => f.message)
                    .concat(v.invalidStructureErrors.map((i) => i.message)),
                }),
              );
            } else {
              submissions.push(...response.value.values);
            }

            const value: BulkSubmission =
              rowErrors.length > 0
                ? {
                    id: body.data.batchId,
                    state: {
                      status: 'FailedValidation',
                      timestamp: new Date(),
                      rowErrors: rowErrors,
                      columnErrors: [],
                    },
                  }
                : {
                    id: body.data.batchId,
                    state: {
                      status: 'PassedValidation',
                      timestamp: new Date(),
                      hasEstimates: submissions.some(
                        (s) =>
                          s.wasteQuantity.type === 'EstimateData' ||
                          s.collectionDate.type === 'EstimateDate',
                      ),
                      submissions: submissions,
                    },
                  };

            await repository.saveBatch(value, body.data.accountId);
          }
        } catch (error) {
          if (error instanceof Boom.Boom) {
            logger.error('Error processing task from queue', {
              batchId: body.data.batchId,
              accountId: body.data.accountId,
              error: error,
            });
          } else {
            logger.error('Unknown error', {
              batchId: body.data.batchId,
              accountId: body.data.accountId,
              error: error,
            });
          }
        }
      }
    },

    processError: async (args: ProcessErrorArgs) => {
      logger.error(
        `Error from source ${args.errorSource} occurred: `,
        args.error,
      );
      if (isServiceBusError(args.error)) {
        switch (args.error.code) {
          case 'MessagingEntityDisabled':
          case 'MessagingEntityNotFound':
          case 'UnauthorizedAccess':
            logger.error(
              `An unrecoverable error occurred. Stopping processing. ${args.error.code}`,
              args.error,
            );
            await subscription.close();
            break;
          case 'MessageLockLost':
            logger.error(`Message lock lost for message`, args.error);
            break;
          case 'ServiceBusy':
            await delay(1000);
            break;
        }
      }
    },
  });

  await delay(20000);
  await receiver.close();

  const submissionsReceiver =
    serviceBusClient.createReceiver(submissionsQueueName);
  const submissionsSubscription = submissionsReceiver.subscribe({
    processMessage: async (brokeredMessage) => {
      if (HTTP.isEvent(brokeredMessage.body)) {
        const body = JSON.parse(
          brokeredMessage.body.body,
        ) as ContentToBeSubmittedTask;

        try {
          const batchData = await repository.getBatch(
            body.data.batchId,
            body.data.accountId,
          );
          if (batchData.state.status !== 'Submitting') {
            const message = `The fetched batch ${batchData.id} does not have the correct status. Status expected: 'Submitting'. Status received: '${batchData.state.status}'.`;
            logger.error(message);
            throw Boom.internal(message);
          }

          let response: submission.CreateSubmissionsResponse;
          try {
            response = await daprAnnexViiClient.createSubmissions({
              id: body.data.batchId,
              accountId: body.data.accountId,
              values: batchData.state.submissions,
            });
          } catch (err) {
            logger.error(
              `Error receiving response from ${annexViiAppId} service`,
              { error: err },
            );
            throw Boom.internal();
          }

          if (!response.success) {
            throw new Boom.Boom(response.error.message, {
              statusCode: response.error.statusCode,
            });
          }

          const value: BulkSubmission = {
            id: body.data.batchId,
            state: {
              status: 'Submitted',
              timestamp: new Date(),
              hasEstimates: batchData.state.hasEstimates,
              transactionId: batchData.state.transactionId,
              submissions: response.value.map((s) => {
                return {
                  id: s.id,
                  submissionDeclaration: s.submissionDeclaration,
                  hasEstimates:
                    s.submissionState.status == 'SubmittedWithEstimates'
                      ? true
                      : false,
                  collectionDate: s.collectionDate,
                  wasteDescription: s.wasteDescription,
                  reference: s.reference,
                };
              }),
            },
          };
          await repository.saveBatch(value, body.data.accountId);
        } catch (error) {
          if (error instanceof Boom.Boom) {
            logger.error('Error processing task from queue', {
              batchId: body.data.batchId,
              accountId: body.data.accountId,
              error: error,
            });
          } else {
            logger.error('Unknown error', {
              batchId: body.data.batchId,
              accountId: body.data.accountId,
              error: error,
            });
          }
        }
      }
    },

    processError: async (args: ProcessErrorArgs) => {
      logger.error(
        `Error from source ${args.errorSource} occurred: `,
        args.error,
      );
      if (isServiceBusError(args.error)) {
        switch (args.error.code) {
          case 'MessagingEntityDisabled':
          case 'MessagingEntityNotFound':
          case 'UnauthorizedAccess':
            logger.error(
              `An unrecoverable error occurred. Stopping processing. ${args.error.code}`,
              args.error,
            );
            await submissionsSubscription.close();
            break;
          case 'MessageLockLost':
            logger.error(`Message lock lost for message`, args.error);
            break;
          case 'ServiceBusy':
            await delay(1000);
            break;
        }
      }
    },
  });

  await delay(20000);
  await submissionsReceiver.close();
}
