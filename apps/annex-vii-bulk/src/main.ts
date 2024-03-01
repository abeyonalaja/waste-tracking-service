import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import * as winston from 'winston';
import * as api from '@wts/api/annex-vii-bulk';
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
  ContentToBeProcessedTask,
} from './model';
import { v4 as uuidv4 } from 'uuid';
import { CloudEvent, HTTP } from 'cloudevents';
import * as taskValidate from './lib/task-validation';
import { DaprAnnexViiClient } from '@wts/client/annex-vii';
import { ValidateSubmissionsResponse } from '@wts/api/annex-vii';

if (!process.env['COSMOS_DB_ACCOUNT_URI']) {
  throw new Error('Missing COSMOS_DB_ACCOUNT_URI configuration.');
}

if (!process.env['SERVICE_BUS_HOST_NAME']) {
  throw new Error('Missing SERVICE_BUS_HOST_NAME configuration.');
}

const tasksQueueName =
  process.env['TASKS_QUEUE_NAME'] || 'annex-vii-bulk-tasks';
const appId = process.env['APP_ID'] || 'annex-vii-bulk';
const annexViiAppId = process.env['ANNEX_VII_APP_ID'] || 'annex-vii';

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
  new WorkloadIdentityCredential()
);
const repository = new CosmosBatchRepository(
  new CosmosClient({
    endpoint: process.env['COSMOS_DB_ACCOUNT_URI'],
    aadCredentials,
  }),
  process.env['COSMOS_DATABASE_NAME'] || 'annex-vii-bulk',
  process.env['COSMOS_DRAFTS_CONTAINER_NAME'] || 'drafts',
  logger
);
const serviceBusClient = new ServiceBusClient(
  process.env['SERVICE_BUS_HOST_NAME'],
  aadCredentials
);
const batchController = new BatchController(repository, logger);
const csvValidator = new CsvValidator(logger);
const daprAnnexViiClient = new DaprAnnexViiClient(server.client, annexViiAppId);

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
  }
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
  { method: HttpMethod.POST }
);

await server.invoker.listen(
  api.updateBatch.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.updateBatchRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    return await batchController.updateBatch(request);
  },
  { method: HttpMethod.POST }
);

await server.start();

const execute = true;
while (execute) {
  const receiver = serviceBusClient.createReceiver(tasksQueueName);
  const subscription = receiver.subscribe({
    processMessage: async (brokeredMessage) => {
      if (HTTP.isEvent(brokeredMessage.body)) {
        const body = JSON.parse(
          brokeredMessage.body.body
        ) as ContentToBeProcessedTask;

        if (!taskValidate.receiveContentToBeProcessedTask(body)) {
          const message = `Data validation failed for queue message ID: ${brokeredMessage.messageId}`;
          logger.error(message);
          throw Boom.internal(message);
        }

        try {
          const records = await csvValidator.validateBatch(body.data);
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
            const partialSubmission = records.value.rows.map((s) => {
              return {
                reference: s.reference,
                baselAnnexIXCode: s.baselAnnexIXCode,
                oecdCode: s.oecdCode,
                annexIIIACode: s.annexIIIACode,
                annexIIIBCode: s.annexIIIBCode,
                laboratory: s.laboratory,
                ewcCodes: s.ewcCodes,
                nationalCode: s.nationalCode,
                wasteDescription: s.wasteDescription,
                wasteQuantityTonnes: s.wasteQuantityTonnes,
                wasteQuantityCubicMetres: s.wasteQuantityCubicMetres,
                wasteQuantityKilograms: s.wasteQuantityKilograms,
                estimatedOrActualWasteQuantity:
                  s.estimatedOrActualWasteQuantity,
              };
            });
            const submissions: api.PartialSubmission[] = [];
            const rowErrors: api.BulkSubmissionValidationRowError[] = [];
            const chunkSize = 50;
            for (let i = 0; i < partialSubmission.length; i += chunkSize) {
              const chunk = partialSubmission.slice(i, i + chunkSize);
              let response: ValidateSubmissionsResponse;
              try {
                response = await daprAnnexViiClient.validateSubmissions({
                  accountId: body.data.accountId,
                  values: chunk,
                });
              } catch (err) {
                logger.error(
                  `Error receiving response from ${annexViiAppId} service`,
                  { error: err }
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
                  })
                );
              } else {
                response.value.values.map((v) => submissions.push(v));
              }
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
                        (s) => s.wasteQuantity.type === 'EstimateData'
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
        args.error
      );
      if (isServiceBusError(args.error)) {
        switch (args.error.code) {
          case 'MessagingEntityDisabled':
          case 'MessagingEntityNotFound':
          case 'UnauthorizedAccess':
            logger.error(
              `An unrecoverable error occurred. Stopping processing. ${args.error.code}`,
              args.error
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
}
