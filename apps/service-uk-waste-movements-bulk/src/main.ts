import { DaprServer, HttpMethod, LogLevel } from '@dapr/dapr';
import Boom from '@hapi/boom';
import * as api from '@wts/api/uk-waste-movements-bulk';
import { LoggerService } from '@wts/util/dapr-winston-logging';
import { fromBoom } from '@wts/util/invocation';
import * as winston from 'winston';
import { BatchController, parse } from './controller';
import { CosmosClient } from '@azure/cosmos';
import {
  AzureCliCredential,
  ChainedTokenCredential,
  WorkloadIdentityCredential,
} from '@azure/identity';
import { CosmosBatchRepository } from './data';
import { CloudEvent, HTTP } from 'cloudevents';
import { v4 as uuidv4 } from 'uuid';
import {
  BulkSubmission,
  ContentProcessingTask,
  ContentToBeProcessedTask,
  ContentToBeSubmittedTask,
  ContentSubmissionTask,
} from './model';
import * as taskValidate from './lib/task-validation';
import { CsvValidator } from './lib/csv-validator';
import {
  ProcessErrorArgs,
  ServiceBusClient,
  delay,
  isServiceBusError,
} from '@azure/service-bus';
import {
  CreateSubmissionsResponse,
  ValidateSubmissionsResponse,
} from '@wts/api/uk-waste-movements';
import { DaprUkWasteMovementsClient } from '@wts/client/uk-waste-movements';

if (!process.env['COSMOS_DB_ACCOUNT_URI']) {
  throw new Error('Missing COSMOS_DB_ACCOUNT_URI configuration.');
}

if (!process.env['SERVICE_BUS_HOST_NAME']) {
  throw new Error('Missing SERVICE_BUS_HOST_NAME configuration.');
}

const appId = process.env['APP_ID'] || 'service-uk-waste-movements-bulk';
const ukwmAppId = process.env['UKWM_APP_ID'] || 'service-uk-waste-movements';
const tasksQueueName =
  process.env['TASKS_QUEUE_NAME'] || 'uk-waste-movements-bulk-tasks';
const submissionsQueueName =
  process.env['SUBMISSIONS_QUEUE_NAME'] ||
  'uk-waste-movements-bulk-submissions';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  defaultMeta: { appId },
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

const serviceBusClient = new ServiceBusClient(
  process.env['SERVICE_BUS_HOST_NAME'],
  aadCredentials
);

const repository = new CosmosBatchRepository(
  dbClient,
  process.env['COSMOS_DATABASE_NAME'] || 'uk-waste-movements-bulk',
  process.env['COSMOS_DRAFTS_CONTAINER_NAME'] || 'drafts',
  logger
);

const batchController = new BatchController(repository, logger);
const csvValidator = new CsvValidator(logger);
const daprUkwmClient = new DaprUkWasteMovementsClient(server.client, ukwmAppId);

await server.invoker.listen(
  api.addContentToBatch.name,
  async ({ body, headers }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.AddContentToBatchRequest;
    if (!parse.addContentToBatchRequest(request)) {
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
  api.finalizeBatch.name,
  async ({ body, headers }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = parse.finalizeBatchRequest(body);
    if (request === undefined) {
      return fromBoom(Boom.badRequest());
    }

    const response = await batchController.finalizeBatch(request);

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
        `Sent a batch of messages to the queue: ${submissionsQueueName}`
      );
      await sender.close();
    } catch (err) {
      logger.error('Error publishing work item', { error: err });
      return fromBoom(Boom.internal());
    }

    return response;
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
            const submissions: api.PartialSubmission[] = [];
            const rowErrors: api.BulkSubmissionValidationRowCodeError[] = [];

            const chunkSize = 50;
            for (let i = 0; i < records.value.rows.length; i += chunkSize) {
              const chunk = records.value.rows.slice(i, i + chunkSize);

              let response: ValidateSubmissionsResponse;
              try {
                response = await daprUkwmClient.validateSubmissions({
                  accountId: body.data.accountId,
                  padIndex: i + 2,
                  values: chunk,
                });
              } catch (err) {
                logger.error(
                  `Error receiving response from ${ukwmAppId} service`,
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
                response.value.values.forEach((v) => {
                  rowErrors.push({
                    rowNumber: v.index,
                    errorAmount: v.fieldFormatErrors.length,
                    errorCodes: v.fieldFormatErrors
                      .map((f) =>
                        f.args?.length ? { code: f.code, args: f.args } : f.code
                      )
                      .concat(v.invalidStructureErrors.map((i) => i.code)),
                  });
                });
              } else {
                submissions.push(...response.value.values);
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
                    },
                  }
                : {
                    id: body.data.batchId,
                    state: {
                      status: 'PassedValidation',
                      timestamp: new Date(),
                      hasEstimates: submissions.some((s) =>
                        s.wasteTypes.some(
                          (wasteType) =>
                            wasteType.wasteQuantityType === 'EstimateData'
                        )
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

  const submissionsReceiver =
    serviceBusClient.createReceiver(submissionsQueueName);
  const submissionsSubscription = submissionsReceiver.subscribe({
    processMessage: async (brokeredMessage) => {
      if (HTTP.isEvent(brokeredMessage.body)) {
        const body = JSON.parse(
          brokeredMessage.body.body
        ) as ContentToBeSubmittedTask;

        if (!taskValidate.receiveContentToBeSubmittedTask(body)) {
          const message = `Data validation failed for queue message ID: ${brokeredMessage.messageId}`;
          logger.error(message);
          throw Boom.internal(message);
        }

        const batch = await repository.getBatch(
          body.data.batchId,
          body.data.accountId
        );

        if (batch.state.status !== 'Submitting') {
          const message = `The fetched batch ${batch.id} does not have the correct status. Status expected: 'Submitting'. Status received: '${batch.state.status}'.`;
          logger.error(message);
          throw Boom.internal(message);
        }

        let response: CreateSubmissionsResponse;
        try {
          response = await daprUkwmClient.createSubmissions({
            id: body.data.batchId,
            accountId: body.data.accountId,
            values: batch.state.submissions,
          });
        } catch (err) {
          logger.error(
            `Error receiving response from ${daprUkwmClient} service`,
            { error: err }
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
            hasEstimates: batch.state.hasEstimates,
            transactionId: batch.state.transactionId,
            submissions: response.value.map((s) => {
              return {
                id: s.id,
                transactionId: s.transactionId,
                producerAndCollection: s.producerAndCollection,
                wasteInformation: s.wasteInformation,
                carrier: s.carrier,
                submissionState: s.submissionState,
                submissionDeclaration: s.submissionDeclaration,
                hasEstimates:
                  s.submissionState.status == 'SubmittedWithEstimates'
                    ? true
                    : false,
              };
            }),
          },
        };
        await repository.saveBatch(value, body.data.accountId);
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
