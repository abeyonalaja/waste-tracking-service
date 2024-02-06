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
import { BulkSubmission, ContentProcessingTask } from './model';
import { CsvValidator } from './lib/csv-validator';
import { v4 as uuidv4 } from 'uuid';

if (!process.env['COSMOS_DB_ACCOUNT_URI']) {
  throw new Error('Missing COSMOS_DB_ACCOUNT_URI configuration.');
}

if (!process.env['SERVICE_BUS_HOST_NAME']) {
  throw new Error('Missing SERVICE_BUS_HOST_NAME configuration.');
}

const tasksQueueName =
  process.env['SERVICE_BUS_TASKS_QUEUE_NAME'] || 'annex-vii-bulk-tasks';

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

await server.invoker.listen(
  api.addContentToBatch.name,
  async ({ body }) => {
    if (body === undefined) {
      return fromBoom(Boom.badRequest('Missing body'));
    }

    const request = JSON.parse(body) as api.AddContentToBatchRequest;
    if (!validate.addContentToBatchRequest(request)) {
      return fromBoom(Boom.badRequest());
    }

    const validateCsvResponse = await csvValidator.validateBatch(request);
    if (!validateCsvResponse.success) {
      return validateCsvResponse;
    }

    const response = await batchController.addContentToBatch(request);
    if (!response.success) {
      return response;
    }

    const message: ContentProcessingTask = {
      batchId: response.value.batchId,
      accountId: request.accountId,
      content: JSON.stringify(validateCsvResponse.value.rows),
    };

    try {
      const messages = [
        {
          body: message,
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
      const data = brokeredMessage.body as ContentProcessingTask;
      try {
        const value: BulkSubmission = {
          id: data.batchId,
          state: {
            status: 'PassedValidation',
            timestamp: new Date(),
            drafts: [
              {
                id: uuidv4(),
              },
            ],
          },
        };
        await repository.saveBatch(value, data.accountId);
      } catch (error) {
        logger.error('Unknown error', {
          batchId: data.batchId,
          accountId: data.accountId,
          error: error,
        });

        const value: BulkSubmission = {
          id: data.batchId,
          state: {
            status: 'FailedValidation',
            timestamp: new Date(),
            errors: [
              {
                rowNumber: 3,
                errorAmount: 9,
                errorDescriptions: [
                  'Enter a uniqure reference',
                  'Enter a second EWC code in correct format',
                  'Waste description must be less than 100 characheters',
                  'Enter a real phone number for the importer',
                  'Enter a real collection date',
                  'Enter the first carrier country',
                  'Enter the first carrier email address',
                  'Enter the first recovery facility or laboratory address',
                  'Enter the first recovery code of the first laboratory facility',
                ],
              },
              {
                rowNumber: 12,
                errorAmount: 6,
                errorDescriptions: [
                  'Enter a real phone number for the importer',
                  'Enter a real collection date',
                  'Enter the first carrier country',
                  'Enter the first carrier email address',
                  'Enter the first recovery facility or laboratory address',
                  'Enter the first recovery code of the first laboratory facility',
                ],
              },
              {
                rowNumber: 24,
                errorAmount: 5,
                errorDescriptions: [
                  'Enter a uniqure reference',
                  'Enter a second EWC code in correct format',
                  'Waste description must be less than 100 characheters',
                  'Enter a real phone number for the importer',
                  'Enter a real collection date',
                ],
              },
              {
                rowNumber: 34,
                errorAmount: 1,
                errorDescriptions: [
                  'Waste description must be less than 100 characheters',
                ],
              },
            ],
          },
        };
        try {
          await repository.saveBatch(value, data.accountId);
        } catch (error) {
          logger.error('Unknown error', {
            batchId: data.batchId,
            accountId: data.accountId,
            error: error,
          });
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
