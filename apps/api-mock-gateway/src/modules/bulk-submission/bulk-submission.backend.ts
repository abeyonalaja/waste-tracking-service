import { v4 as uuidv4 } from 'uuid';
import { BulkSubmission, Submission } from '@wts/api/waste-tracking-gateway';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import { BulkWithAccount, db } from '../../db';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../../lib/errors';

export interface BatchRef {
  id: string;
  accountId: string;
}

export interface Input {
  type: string;
  data: Buffer;
}

interface TestCsvRow {
  state: string;
}

export async function createBatch(
  accountId: string,
  inputs: Input[],
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
        }),
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
              id: '8d1cb87d-9349-4d84-acf2-30aa4df4d2cb',
              submissionDeclaration: {
                declarationTimestamp: new Date(),
                transactionId: '2404_8D1CB87D',
              },
              hasEstimates: true,
              collectionDate: {
                type: 'EstimateDate',
                estimateDate: {
                  day: '15',
                  month: '01',
                  year: '3050',
                },
                actualDate: {},
              },
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
              reference: 'ref1',
            },
            {
              id: '4909acad-c100-4419-b73e-181dfd553bfe',
              submissionDeclaration: {
                declarationTimestamp: new Date(),
                transactionId: '2404_4909ACAD',
              },
              hasEstimates: false,
              collectionDate: {
                type: 'ActualDate',
                estimateDate: {},
                actualDate: {
                  day: '08',
                  month: '01',
                  year: '2050',
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
                nationalCode: {
                  provided: 'Yes',
                  value: 'NatCode',
                },
                description: 'WasteDescription',
              },
              reference: 'ref2',
            },
          ],
        },
        accountId: accountId,
      };

      db.submissions.push({
        accountId,
        id: '8d1cb87d-9349-4d84-acf2-30aa4df4d2cb',
        reference: 'ref1',
        wasteDescription: {
          wasteCode: {
            type: 'BaselAnnexIX',
            code: 'B1070',
          },
          ewcCodes: [
            {
              code: '101213',
            },
          ],
          nationalCode: {
            provided: 'No',
          },
          description: 'Bulk data,5 WC, No Transit and Countries',
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
            addressLine1: 'Armira Capital Ltd,,LONDON,EC2N 4AYUnited Kingdom',
            addressLine2: '110 Bishopsgate',
            townCity: 'London',
            postcode: 'EC2N4AY',
            country: 'England',
          },
          exporterContactDetails: {
            organisationName: 'Exporter TestOrg ltd',
            fullName: 'Exp Conn name',
            emailAddress: 'Testemail@gmail.com',
            phoneNumber: '07811111111',
            faxNumber: '0113598988555',
          },
        },
        importerDetail: {
          importerAddressDetails: {
            organisationName: 'Importer TestImpOrg ltd',
            address: '111,love avenue,Finalnd,500232',
            country: 'Finland [FI]',
          },
          importerContactDetails: {
            fullName: 'TestImpCont',
            emailAddress: 'impoter@gmail.com',
            phoneNumber: '012333434343',
            faxNumber: '01233430000000',
          },
        },
        collectionDate: {
          type: 'EstimateDate',
          estimateDate: {
            day: '15',
            month: '03',
            year: '2030',
          },
          actualDate: {},
        },
        carriers: [
          {
            addressDetails: {
              organisationName: 'First carrier',
              address: 'First carrier address',
              country: 'United Kingdom (Wales) [GB-WLS]',
            },
            contactDetails: {
              fullName: 'John David',
              emailAddress: 'mail@mail.com',
              phoneNumber: '+359-89 88-1(434)55 5',
            },
            transportDetails: {
              type: 'Road',
              description: 'road details',
            },
          },
          {
            addressDetails: {
              organisationName: 'org name',
              address:
                'test address 1, something , somehwere in this world, sl12rd,121213',
              country: 'France [FR]',
            },
            contactDetails: {
              fullName: 'Peter Banks',
              emailAddress: 'mail@mail.com',
              phoneNumber: '+359-89 88-1(434)55 5',
            },
            transportDetails: {
              type: 'Road',
              description: 'road details',
            },
          },
          {
            addressDetails: {
              organisationName: 'org name',
              address:
                'test address 1, something , somehwere in this world, sl12rd,121213',
              country: 'France [FR]',
            },
            contactDetails: {
              fullName: 'Ben Davies',
              emailAddress: 'mail@mail.com',
              phoneNumber: '+359-89 88-1(434)55 5',
            },
            transportDetails: {
              type: 'Air',
              description: 'Air details',
            },
          },
          {
            addressDetails: {
              organisationName: 'Org name',
              address: 'test address 1',
              country: 'France [FR]',
            },
            contactDetails: {
              fullName: 'Phil James',
              emailAddress: 'mail@mail.com',
              phoneNumber: '+359-89 88-1(434)55 5',
            },
            transportDetails: {
              type: 'Road',
              description: 'road details',
            },
          },
          {
            addressDetails: {
              organisationName: 'org name',
              address: ', 98273 , *^*^&@,jsdfj',
              country: 'France [FR]',
            },
            contactDetails: {
              fullName: 'Peter Banks',
              emailAddress: 'mail@mail.com',
              phoneNumber: '+359-89 88-1(434)55 5',
            },
            transportDetails: {
              type: 'Road',
              description: 'road details',
            },
          },
        ],
        collectionDetail: {
          address: {
            addressLine1: 'Test address 1',
            addressLine2: 'Test address 83',
            townCity: 'London',
            postcode: 'AL3 8QE',
            country: 'England',
          },
          contactDetails: {
            organisationName: 'org name',
            fullName: 'John Brooks',
            emailAddress: 'maill@mail.com',
            phoneNumber: '00442087599036',
          },
        },
        ukExitLocation: {
          provided: 'No',
        },
        transitCountries: [
          'Albania [AL]',
          'Cyprus [CY]',
          'Germany [DE]',
          'Mali [ML]',
          'Somalia [SO]',
          'Spain [ES]',
        ],
        recoveryFacilityDetail: [
          {
            addressDetails: {
              name: 'Org name',
              address: 'Test address 1',
              country: 'Albania [AL]',
            },
            contactDetails: {
              fullName: 'Dave Johns',
              emailAddress: 'mail@mail.com',
              phoneNumber: '+442081234567',
            },
            recoveryFacilityType: {
              type: 'InterimSite',
              recoveryCode: 'R12',
            },
          },
          {
            addressDetails: {
              name: 'Org name',
              address: "test address 1, 592038, 'street",
              country: 'Italy [IT]',
            },
            contactDetails: {
              fullName: 'Ben James',
              emailAddress: 'mail@mail.com',
              phoneNumber: '+359-89 88-1(434)55 5',
            },
            recoveryFacilityType: {
              type: 'RecoveryFacility',
              recoveryCode: 'R1',
            },
          },
        ],
        submissionDeclaration: {
          declarationTimestamp: new Date(),
          transactionId: '2405_A148B186',
        },
        submissionState: {
          status: 'SubmittedWithEstimates',
          timestamp: new Date(),
        },
      });
      db.submissions.push({
        accountId,
        id: '4909acad-c100-4419-b73e-181dfd553bfe',
        reference: 'ref2',
        wasteDescription: {
          wasteCode: {
            type: 'NotApplicable',
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
          type: 'ActualData',
          estimateData: {},
          actualData: {
            quantityType: 'Weight',
            unit: 'Kilogram',
            value: 12.5,
          },
        },
        exporterDetail: {
          exporterAddress: {
            addressLine1: 'Test organisation 1',
            townCity: 'London',
            country: 'England',
          },
          exporterContactDetails: {
            organisationName: 'Test organisation 1',
            fullName: 'John Smith',
            emailAddress: 'test1@test.com',
            phoneNumber: '07888888888',
          },
        },
        importerDetail: {
          importerAddressDetails: {
            organisationName: 'Test organisation 2',
            address: '2 Some Street, Paris, 75002',
            country: 'France [FR]',
          },
          importerContactDetails: {
            fullName: 'Jane Smith',
            emailAddress: 'test2@test.com',
            phoneNumber: '0033140000000',
          },
        },
        collectionDate: {
          type: 'ActualDate',
          estimateDate: {},
          actualDate: {
            day: '08',
            month: '01',
            year: '2050',
          },
        },
        carriers: [
          {
            addressDetails: {
              organisationName: 'Test organisation 2',
              address: '2 Some Street, Paris, 75002',
              country: 'France [FR]',
            },
            contactDetails: {
              fullName: 'Jane Smith',
              emailAddress: 'test2@test.com',
              phoneNumber: '0033140000000',
            },
          },
        ],
        collectionDetail: {
          address: {
            addressLine1: 'Test organisation 1',
            townCity: 'London',
            country: 'England',
          },
          contactDetails: {
            organisationName: 'Test organisation 1',
            fullName: 'John Smith',
            emailAddress: 'test1@test.com',
            phoneNumber: '07888888888',
          },
        },
        ukExitLocation: {
          provided: 'No',
        },
        transitCountries: [],
        recoveryFacilityDetail: [
          {
            addressDetails: {
              name: 'Test organisation 2',
              address: '2 Some Street, Paris, 75002',
              country: 'France [FR]',
            },
            contactDetails: {
              fullName: 'Jane Smith',
              emailAddress: 'test2@test.com',
              phoneNumber: '0033140000000',
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D2',
            },
          },
        ],
        submissionDeclaration: {
          declarationTimestamp: new Date(),
          transactionId: '2404_4909ACAD',
        },
        submissionState: {
          status: 'SubmittedWithActuals',
          timestamp: new Date(),
        },
      });
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

export async function getBatchSubmissions({
  id,
  accountId,
}: BatchRef): Promise<Submission[]> {
  const batch = db.batches.find((b) => b.id == id && b.accountId == accountId);
  const submissions = db.submissions.filter((b) => b.accountId == accountId);

  if (!batch || !submissions) {
    return Promise.reject(new NotFoundError());
  }

  if (batch.state.status !== 'Submitted') {
    return Promise.reject(
      new BadRequestError('Batch has not submitted records.'),
    );
  }

  const submissionIds = batch.state.submissions.map((s) => {
    return s.id;
  });

  const values = submissions
    .filter((x) => submissionIds.some((y) => y.valueOf() === x.id))
    .sort((x, y) => {
      return x.submissionState.timestamp > y.submissionState.timestamp ? 1 : -1;
    })
    .reverse();

  if (!Array.isArray(values) || values.length === 0) {
    return Promise.reject(new NotFoundError('Not found.'));
  }

  return Promise.resolve(
    values.map((s) => {
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
    }),
  );
}
