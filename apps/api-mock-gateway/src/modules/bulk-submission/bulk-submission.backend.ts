import { v4 as uuidv4 } from 'uuid';
import { BulkSubmission } from '@wts/api/waste-tracking-gateway';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import { BulkWithAccount, db } from '../../db';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../../libs/errors';

export type BatchRef = {
  id: string;
  accountId: string;
};

export type Input = {
  type: string;
  data: Buffer;
};

type TestCsvRow = {
  state: string;
};

export async function createBatch(
  accountId: string,
  inputs: Input[]
): Promise<{ id: string }> {
  const id = uuidv4();

  const records: TestCsvRow[] = [];

  try {
    for (const input of inputs) {
      const stream = Readable.from(input.data);

      const parser = stream.pipe(
        parse({
          columns: ['state'],
          fromLine: 3,
          relax_quotes: true,
          escape: '\\',
          ltrim: true,
          rtrim: true,
        })
      );

      parser.on('readable', function () {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });

      await finished(parser);
    }
  } catch (err) {
    if (err instanceof Error) {
      return Promise.reject(err);
    }

    if (err instanceof Error && 'code' in err && typeof err.code === 'string') {
      return Promise.reject(new BadRequestError('Bad Request error.'));
    }

    return Promise.reject(new InternalServerError('Internal error.'));
  }

  const timestamp = new Date();
  const transactionId =
    timestamp.getFullYear().toString().substring(2) +
    (timestamp.getMonth() + 1).toString().padStart(2, '0') +
    '_' +
    id.substring(0, 8).toUpperCase();

  let value: BulkWithAccount = {
    id: id,
    state: {
      status: 'Processing',
      timestamp: timestamp,
    },
    accountId: accountId,
  };
  console.log(records[0].state);
  switch (records[0].state) {
    case 'Processing':
      value = {
        id: id,
        state: {
          status: 'Processing',
          timestamp: timestamp,
        },
        accountId: accountId,
      };
      break;
    case 'FailedValidation':
      value = {
        id: uuidv4(),
        state: {
          status: 'FailedValidation',
          timestamp: new Date(),
          rowErrors: [
            {
              rowNumber: 3,
              errorAmount: 9,
              errorDetails: [
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
              errorDetails: [
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
              errorDetails: [
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
              errorDetails: [
                'Waste description must be less than 100 characheters',
              ],
            },
          ],
          columnErrors: [
            {
              errorAmount: 9,
              columnName: 'Organisation contact person phone number',
              errorDetails: [
                {
                  rowNumber: 2,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 3,
                  errorReason: 'Enter a valid contact phone number',
                },
                {
                  rowNumber: 12,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 24,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 27,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 32,
                  errorReason: 'Enter a valid contact phone number',
                },
                {
                  rowNumber: 41,
                  errorReason: 'Enter a valid contact phone number',
                },
                {
                  rowNumber: 56,
                  errorReason: 'Enter contact phone number',
                },
                {
                  rowNumber: 63,
                  errorReason: 'Enter a valid contact phone number',
                },
              ],
            },
          ],
        },
        accountId: accountId,
      };
      break;
    case 'PassedValidation':
      value = {
        id: uuidv4(),
        state: {
          status: 'PassedValidation',
          timestamp: timestamp,
          hasEstimates: true,
          submissions: [
            {
              reference: 'ref1',

              wasteDescription: {
                wasteCode: {
                  type: 'BaselAnnexIX',
                  code: 'B1010',
                },
                ewcCodes: [
                  {
                    code: '101213',
                  },
                ],
                nationalCode: {
                  provided: 'Yes',
                  value: 'NatCode',
                },
                description: 'WasteDescription',
              },
              wasteQuantity: {
                type: 'EstimateData',
                estimateData: {
                  quantityType: 'Volume',
                  unit: 'Cubic Metre',
                  value: 10,
                },
                actualData: {},
              },
              exporterDetail: {
                exporterAddress: {
                  country: 'United Kingdom [GB]',
                  postcode: 'SW1A 1AA',
                  townCity: 'London',
                  addressLine1: '123 Real Street',
                  addressLine2: 'Real Avenue',
                },
                exporterContactDetails: {
                  organisationName: 'Waste Ltd',
                  fullName: 'Waste Limited',
                  emailAddress: 'exporter@wasteltd.com',
                  phoneNumber: '07142345304',
                },
              },
              importerDetail: {
                importerAddressDetails: {
                  address: '123 Importer Street, Importer Road',
                  country: 'France [FR]',
                  organisationName: 'Waste Importers',
                },
                importerContactDetails: {
                  fullName: 'Steve Importer',
                  emailAddress: 'steve@importers.com',
                  phoneNumber: '03456203945',
                },
              },
              collectionDate: {
                type: 'ActualDate',
                actualDate: {
                  year: '01',
                  month: '01',
                  day: '2025',
                },
                estimateDate: {},
              },
              carriers: [
                {
                  id: uuidv4(),
                  transportDetails: {
                    type: 'Air',
                    description: 'RyanAir',
                  },
                  addressDetails: {
                    address: '132 Carrier Road',
                    country: 'United Kingdom [GB]',
                    organisationName: 'Carriers Ltd',
                  },
                  contactDetails: {
                    emailAddress: 'steve@carriers.com',
                    faxNumber: 'abc123',
                    fullName: 'Steve Carrier',
                    phoneNumber: '012345987654',
                  },
                },
              ],
              collectionDetail: {
                address: {
                  addressLine1: 'Collector Road',
                  addressLine2: 'Collector Avenue',
                  townCity: 'Paris',
                  postcode: 'SW1A 1AA',
                  country: 'France [FR]',
                },
                contactDetails: {
                  organisationName: 'Collectors Ltd',
                  fullName: 'Steve Collector',
                  emailAddress: 'steve@collectors.com',
                  phoneNumber: '04938493029',
                },
              },
              exitLocation: {
                provided: 'Yes',
                value: 'Dover',
              },
              transitCountries: ['Albania (AL)'],
              recoveryFacilityDetail: [
                {
                  addressDetails: {
                    address: 'Recovery Road, Paris',
                    country: 'France [FR]',
                    name: 'Recovery Labs',
                  },
                  contactDetails: {
                    emailAddress: 'technician@recoverylabs.com',
                    faxNumber: 'abc123',
                    fullName: 'Recovery Technician',
                    phoneNumber: '02938493939',
                  },
                  recoveryFacilityType: {
                    type: 'Laboratory',
                    disposalCode: 'D1',
                  },
                },
              ],
            },
          ],
        },
        accountId: accountId,
      };
      break;

    case 'Submitting':
      value = {
        id: uuidv4(),
        state: {
          status: 'Submitting',
          timestamp: timestamp,
          hasEstimates: true,
          submissions: [
            {
              reference: 'ref1',
              wasteDescription: {
                wasteCode: {
                  type: 'BaselAnnexIX',
                  code: 'B1010',
                },
                ewcCodes: [
                  {
                    code: '101213',
                  },
                ],
                nationalCode: {
                  provided: 'No',
                },
                description: 'WasteDescription',
              },
              wasteQuantity: {
                type: 'EstimateData',
                estimateData: {
                  quantityType: 'Volume',
                  unit: 'Cubic Metre',
                  value: 10,
                },
                actualData: {},
              },
              exporterDetail: {
                exporterAddress: {
                  country: 'United Kingdom [GB]',
                  postcode: 'SW1A 1AA',
                  townCity: 'London',
                  addressLine1: '123 Real Street',
                  addressLine2: 'Real Avenue',
                },
                exporterContactDetails: {
                  organisationName: 'Waste Ltd',
                  fullName: 'Waste Limited',
                  emailAddress: 'exporter@wasteltd.com',
                  phoneNumber: '07142345304',
                },
              },
              importerDetail: {
                importerAddressDetails: {
                  address: '123 Importer Street, Importer Road',
                  country: 'France [FR]',
                  organisationName: 'Waste Importers',
                },
                importerContactDetails: {
                  fullName: 'Steve Importer',
                  emailAddress: 'steve@importers.com',
                  phoneNumber: '03456203945',
                },
              },
              collectionDate: {
                type: 'ActualDate',
                actualDate: {
                  year: '01',
                  month: '01',
                  day: '2025',
                },
                estimateDate: {},
              },
              carriers: [
                {
                  id: uuidv4(),
                  transportDetails: {
                    type: 'Air',
                    description: 'RyanAir',
                  },
                  addressDetails: {
                    address: '132 Carrier Road',
                    country: 'United Kingdom [GB]',
                    organisationName: 'Carriers Ltd',
                  },
                  contactDetails: {
                    emailAddress: 'steve@carriers.com',
                    faxNumber: 'abc123',
                    fullName: 'Steve Carrier',
                    phoneNumber: '012345987654',
                  },
                },
              ],
              collectionDetail: {
                address: {
                  addressLine1: 'Collector Road',
                  addressLine2: 'Collector Avenue',
                  townCity: 'Paris',
                  postcode: 'SW1A 1AA',
                  country: 'France [FR]',
                },
                contactDetails: {
                  organisationName: 'Collectors Ltd',
                  fullName: 'Steve Collector',
                  emailAddress: 'steve@collectors.com',
                  phoneNumber: '04938493029',
                },
              },
              exitLocation: {
                provided: 'Yes',
                value: 'Dover',
              },
              transitCountries: ['Albania (AL)'],
              recoveryFacilityDetail: [
                {
                  addressDetails: {
                    address: 'Recovery Road, Paris',
                    country: 'France [FR]',
                    name: 'Recovery Labs',
                  },
                  contactDetails: {
                    emailAddress: 'technician@recoverylabs.com',
                    faxNumber: 'abc123',
                    fullName: 'Recovery Technician',
                    phoneNumber: '02938493939',
                  },
                  recoveryFacilityType: {
                    type: 'Laboratory',
                    disposalCode: 'D1',
                  },
                },
              ],
            },
          ],
        },
        accountId: accountId,
      };
      break;

    case 'Submitted':
      value = {
        id: uuidv4(),
        state: {
          status: 'Submitted',
          transactionId: transactionId,
          timestamp: timestamp,
          hasEstimates: true,
          submissions: [
            {
              id: uuidv4(),
              submissionDeclaration: {
                declarationTimestamp: new Date(),
                transactionId: '3497_1224DCBA',
              },
              hasEstimates: false,
              collectionDate: {
                type: 'ActualDate',
                estimateDate: {},
                actualDate: {
                  day: '10',
                  month: '10',
                  year: '2029',
                },
              },
              wasteDescription: {
                wasteCode: {
                  type: 'NotApplicable',
                },
                ewcCodes: [
                  {
                    code: '101213',
                  },
                ],
                description: 'metal',
              },
              reference: 'ref1',
            },
            {
              id: uuidv4(),
              submissionDeclaration: {
                declarationTimestamp: new Date(),
                transactionId: '3497_1224DCBA',
              },
              hasEstimates: true,
              collectionDate: {
                type: 'ActualDate',
                estimateDate: {
                  day: '10',
                  month: '11',
                  year: '2028',
                },
                actualDate: {
                  day: '01',
                  month: '01',
                  year: '2030',
                },
              },
              wasteDescription: {
                wasteCode: {
                  type: 'NotApplicable',
                },
                ewcCodes: [
                  {
                    code: '010101',
                  },
                ],
                description: 'Collection of metal',
              },
              reference: 'export7822',
            },
          ],
        },
        accountId: accountId,
      };
      break;
  }
  db.batches.push(value);

  return Promise.resolve({ id: value.id });
}

export async function getBatch({
  id,
  accountId,
}: BatchRef): Promise<BulkSubmission> {
  const value = db.batches.find((b) => b.id == id && b.accountId == accountId);

  if (value === undefined) {
    return Promise.reject(new NotFoundError());
  }
  const batch: BulkSubmission = {
    id: value.id,
    state: value.state,
  };
  return Promise.resolve(batch);
}

export async function finalizeBatch({
  id,
  accountId,
}: BatchRef): Promise<void> {
  const value = db.batches.find((b) => b.id == id && b.accountId == accountId);
  if (value === undefined) {
    return Promise.reject(new NotFoundError());
  }

  const timestamp = new Date();

  value.state = {
    status: 'Submitting',
    timestamp: timestamp,
    hasEstimates: true,
    submissions: [
      {
        reference: 'ref1',
        wasteDescription: {
          wasteCode: {
            type: 'BaselAnnexIX',
            code: 'B1010',
          },
          ewcCodes: [
            {
              code: '101213',
            },
          ],
          nationalCode: {
            provided: 'No',
          },
          description: 'WasteDescription',
        },
        wasteQuantity: {
          type: 'EstimateData',
          estimateData: {
            quantityType: 'Volume',
            unit: 'Cubic Metre',
            value: 10,
          },
          actualData: {},
        },
        exporterDetail: {
          exporterAddress: {
            country: 'United Kingdom [GB]',
            postcode: 'SW1A 1AA',
            townCity: 'London',
            addressLine1: '123 Real Street',
            addressLine2: 'Real Avenue',
          },
          exporterContactDetails: {
            organisationName: 'Waste Ltd',
            fullName: 'Waste Limited',
            emailAddress: 'exporter@wasteltd.com',
            phoneNumber: '07142345304',
          },
        },
        importerDetail: {
          importerAddressDetails: {
            address: '123 Importer Street, Importer Road',
            country: 'France [FR]',
            organisationName: 'Waste Importers',
          },
          importerContactDetails: {
            fullName: 'Steve Importer',
            emailAddress: 'steve@importers.com',
            phoneNumber: '03456203945',
          },
        },
        collectionDate: {
          type: 'ActualDate',
          actualDate: {
            year: '12',
            month: '12',
            day: '2026',
          },
          estimateDate: {},
        },
        carriers: [
          {
            id: uuidv4(),
            transportDetails: {
              type: 'Air',
              description: 'RyanAir',
            },
            addressDetails: {
              address: '132 Carrier Road',
              country: 'United Kingdom [GB]',
              organisationName: 'Carriers Ltd',
            },
            contactDetails: {
              emailAddress: 'steve@carriers.com',
              faxNumber: 'abc123',
              fullName: 'Steve Carrier',
              phoneNumber: '012345987654',
            },
          },
        ],
        collectionDetail: {
          address: {
            addressLine1: 'Collector Road',
            addressLine2: 'Collector Avenue',
            townCity: 'Paris',
            postcode: 'SW1A 1AA',
            country: 'France [FR]',
          },
          contactDetails: {
            organisationName: 'Collectors Ltd',
            fullName: 'Steve Collector',
            emailAddress: 'steve@collectors.com',
            phoneNumber: '04938493029',
          },
        },
        exitLocation: {
          provided: 'Yes',
          value: 'Dover',
        },
        transitCountries: ['Albania (AL)'],
        recoveryFacilityDetail: [
          {
            addressDetails: {
              address: 'Recovery Road, Paris',
              country: 'France [FR]',
              name: 'Recovery Labs',
            },
            contactDetails: {
              emailAddress: 'technician@recoverylabs.com',
              faxNumber: 'abc123',
              fullName: 'Recovery Technician',
              phoneNumber: '02938493939',
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D1',
            },
          },
        ],
      },
    ],
  };

  return Promise.resolve();
}
