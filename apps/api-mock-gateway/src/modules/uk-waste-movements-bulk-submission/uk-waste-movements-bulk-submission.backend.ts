import Boom from '@hapi/boom';
import {
  UkwmBulkSubmission,
  UkwmColumnWithMessage,
  UkwmPagedSubmissionData,
  UkwmRowWithMessage,
  UkwmSubmittedPartialSubmission,
} from '@wts/api/waste-tracking-gateway';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import { finished } from 'stream/promises';
import { UkwmBulkWithAccount, db } from '../../db';

const downloadSections = `Waste collection details,,,,,,,,,,,,,,,,,,,Receiver (person or business who receives the waste for recovery or disposal) details,,,,,,,,,,,Waste transportation details,,First waste type details (compulsory),,,,,,,,,,,,,,,Second waste type details if required (all waste details are compulsory if you enter a second EWC code),,,,,,,,,,,,,,,Third waste type details if required (all waste details are compulsory if you enter a third EWC code),,,,,,,,,,,,,,,"Fourth waste type details if required (all waste details are compulsory if you enter a fourth EWC code)						",,,,,,,,,,,,,,,"Fifth waste type details if required (all waste details are compulsory if you enter a fifth EWC code)						",,,,,,,,,,,,,,,"Sixth waste type details if required (all waste details are compulsory if you enter a sixth EWC code)						",,,,,,,,,,,,,,,Seventh waste type details if required (all waste details are compulsory if you enter a seventh EWC code),,,,,,,,,,,,,,,Eighth waste type details if required (all waste details are compulsory if you enter a eighth EWC code),,,,,,,,,,,,,,,Ninth waste type details if required (all waste details are compulsory if you enter a ninth EWC code),,,,,,,,,,,,,,,Tenth waste type details if required (all waste details are compulsory if you enter a tenth EWC code),,,,,,,,,,,,,,`;

const downloadHeaders = `Waste collection address Line 1 (only enter if different to producer address),Address Line 2,Town or city,Country,Waste collection postcode (only enter if different to producer address),Local authority,"Waste source (household, commercial, industrial, local authority, or demolition)",Broker registration number (only enter if applicable),"Carrier registration number (starts with CBD, then either U or L, followed by 4 to 6 numbers)","Expected waste collection date (only use numbers and slashes between the day, month and year, for example 13/01/25)",Carrier organisation name,Carrier address line 1,Carrier address line 2,Carrier town/city,Carrier country,Carrier postcode,Carrier contact name,Carrier contact email,Carrier contact phone,"Receiver  authorisation type (permit, licence, regulatory position statement, or other local agreement)",Receiver  environmental permit number or waste exepmtion number (if applicable),Receiver organisation name,Receiver address Line 1,Address Line 2,Town or city,Country,Receiver postcode,Receiver contact name,Receiver contact email,Receiver contact phone number,Number and type of transportation containers (max 250 characters),"Special handling requirements details (only enter if applicable, max 250 characters)","EWC code (six digits, only use numbers)",Enter waste description (maximum 100 charcaters),"Physical form of waste (gas, liquid, solid, powder, sludge, or mixed)",Waste quantity (numbers and decimal points only),"Quantity units (tonnes, kilograms, litres, or cubic metres)",Quantity of waste (actual or estimate),"Chemical and biological components of the waste (separate multiple components using a semi colon. For example, textured coatings; floor tiles)",Chemical or biological concentrations value (separate multiple amounts using a semi colon),"Chemical or biological concentrations unit of measure (% or mg/kg, separate multiple amounts using a semi colon)",Does the waste have hazardous properties? (Y/N),Enter all hazardous waste codes (if applicable),Does the waste contain persistent organic pollutants (POPs)? (Y/N),Enter persistent organic pollutants (POPs) details (if applicable),"Enter POPs concentration value, using only numbers and a full stop","Enter POPs concentration unit of measure, for example %","EWC code (six digits, only use numbers)",Enter waste description (maximum 100 charcaters),"Physical form of waste (gas, liquid, solid, powder, sludge, or mixed)",Waste quantity (numbers and decimal points only),"Quantity units (tonnes, kilograms, litres, or cubic metres)",Quantity of waste (actual or estimate),"Chemical and biological components of the waste (separate multiple components using a semi colon. For example, textured coatings; floor tiles)",Chemical or biological concentrations value (separate multiple amounts using a semi colon),"Chemical or biological concentrations unit of measure (% or mg/kg, separate multiple amounts using a semi colon)",Does the waste have hazardous properties? (Y/N),Enter all hazardous waste codes (if applicable),Does the waste contain persistent organic pollutants (POPs)? (Y/N),Enter persistent organic pollutants (POPs) details (if applicable),"Enter POPs concentration value, using only numbers and a full stop","Enter POPs concentration unit of measure, for example %","EWC code (six digits, only use numbers)",Enter waste description (maximum 100 charcaters),"Physical form of waste (gas, liquid, solid, powder, sludge, or mixed)",Waste quantity (numbers and decimal points only),"Quantity units (tonnes, kilograms, litres, or cubic metres)",Quantity of waste (actual or estimate),"Chemical and biological components of the waste (separate multiple components using a semi colon. For example, textured coatings; floor tiles)",Chemical or biological concentrations value (separate multiple amounts using a semi colon),"Chemical or biological concentrations unit of measure (% or mg/kg, separate multiple amounts using a semi colon)",Does the waste have hazardous properties? (Y/N),Enter all hazardous waste codes (if applicable),Does the waste contain persistent organic pollutants (POPs)? (Y/N),Enter persistent organic pollutants (POPs) details (if applicable),"Enter POPs concentration value, using only numbers and a full stop","Enter POPs concentration unit of measure, for example %","EWC code (six digits, only use numbers)",Enter waste description (maximum 100 charcaters),"Physical form of waste (gas, liquid, solid, powder, sludge, or mixed)",Waste quantity (numbers and decimal points only),"Quantity units (tonnes, kilograms, litres, or cubic metres)",Quantity of waste (actual or estimate),"Chemical and biological components of the waste (separate multiple components using a semi colon. For example, textured coatings; floor tiles)",Chemical or biological concentrations value (separate multiple amounts using a semi colon),"Chemical or biological concentrations unit of measure (% or mg/kg, separate multiple amounts using a semi colon)",Does the waste have hazardous properties? (Y/N),Enter all hazardous waste codes (if applicable),Does the waste contain persistent organic pollutants (POPs)? (Y/N),Enter persistent organic pollutants (POPs) details (if applicable),"Enter POPs concentration value, using only numbers and a full stop","Enter POPs concentration unit of measure, for example %","EWC code (six digits, only use numbers)",Enter waste description (maximum 100 charcaters),"Physical form of waste (gas, liquid, solid, powder, sludge, or mixed)",Waste quantity (numbers and decimal points only),"Quantity units (tonnes, kilograms, litres, or cubic metres)",Quantity of waste (actual or estimate),"Chemical and biological components of the waste (separate multiple components using a semi colon. For example, textured coatings; floor tiles)",Chemical or biological concentrations value (separate multiple amounts using a semi colon),"Chemical or biological concentrations unit of measure (% or mg/kg, separate multiple amounts using a semi colon)",Does the waste have hazardous properties? (Y/N),Enter all hazardous waste codes (if applicable),Does the waste contain persistent organic pollutants (POPs)? (Y/N),Enter persistent organic pollutants (POPs) details (if applicable),"Enter POPs concentration value, using only numbers and a full stop","Enter POPs concentration unit of measure, for example %","EWC code (six digits, only use numbers)",Enter waste description (maximum 100 charcaters),"Physical form of waste (gas, liquid, solid, powder, sludge, or mixed)",Waste quantity (numbers and decimal points only),"Quantity units (tonnes, kilograms, litres, or cubic metres)",Quantity of waste (actual or estimate),"Chemical and biological components of the waste (separate multiple components using a semi colon. For example, textured coatings; floor tiles)",Chemical or biological concentrations value (separate multiple amounts using a semi colon),"Chemical or biological concentrations unit of measure (% or mg/kg, separate multiple amounts using a semi colon)",Does the waste have hazardous properties? (Y/N),Enter all hazardous waste codes (if applicable),Does the waste contain persistent organic pollutants (POPs)? (Y/N),Enter persistent organic pollutants (POPs) details (if applicable),"Enter POPs concentration value, using only numbers and a full stop","Enter POPs concentration unit of measure, for example %","EWC code (six digits, only use numbers)",Enter waste description (maximum 100 charcaters),"Physical form of waste (gas, liquid, solid, powder, sludge, or mixed)",Waste quantity (numbers and decimal points only),"Quantity units (tonnes, kilograms, litres, or cubic metres)",Quantity of waste (actual or estimate),"Chemical and biological components of the waste (separate multiple components using a semi colon. For example, textured coatings; floor tiles)",Chemical or biological concentrations value (separate multiple amounts using a semi colon),"Chemical or biological concentrations unit of measure (% or mg/kg, separate multiple amounts using a semi colon)",Does the waste have hazardous properties? (Y/N),Enter all hazardous waste codes (if applicable),Does the waste contain persistent organic pollutants (POPs)? (Y/N),Enter persistent organic pollutants (POPs) details (if applicable),"Enter POPs concentration value, using only numbers and a full stop","Enter POPs concentration unit of measure, for example %","EWC code (six digits, only use numbers)",Enter waste description (maximum 100 charcaters),"Physical form of waste (gas, liquid, solid, powder, sludge, or mixed)",Waste quantity (numbers and decimal points only),"Quantity units (tonnes, kilograms, litres, or cubic metres)",Quantity of waste (actual or estimate),"Chemical and biological components of the waste (separate multiple components using a semi colon. For example, textured coatings; floor tiles)",Chemical or biological concentrations value (separate multiple amounts using a semi colon),"Chemical or biological concentrations unit of measure (% or mg/kg, separate multiple amounts using a semi colon)",Does the waste have hazardous properties? (Y/N),Enter all hazardous waste codes (if applicable),Does the waste contain persistent organic pollutants (POPs)? (Y/N),Enter persistent organic pollutants (POPs) details (if applicable),"Enter POPs concentration value, using only numbers and a full stop","Enter POPs concentration unit of measure, for example %","EWC code (six digits, only use numbers)",Enter waste description (maximum 100 charcaters),"Physical form of waste (gas, liquid, solid, powder, sludge, or mixed)",Waste quantity (numbers and decimal points only),"Quantity units (tonnes, kilograms, litres, or cubic metres)",Quantity of waste (actual or estimate),"Chemical and biological components of the waste (separate multiple components using a semi colon. For example, textured coatings; floor tiles)",Chemical or biological concentrations value (separate multiple amounts using a semi colon),"Chemical or biological concentrations unit of measure (% or mg/kg, separate multiple amounts using a semi colon)",Does the waste have hazardous properties? (Y/N),Enter all hazardous waste codes (if applicable),Does the waste contain persistent organic pollutants (POPs)? (Y/N),Enter persistent organic pollutants (POPs) details (if applicable),"Enter POPs concentration value, using only numbers and a full stop","Enter POPs concentration unit of measure, for example %","EWC code (six digits, only use numbers)",Enter waste description (maximum 100 charcaters),"Physical form of waste (gas, liquid, solid, powder, sludge, or mixed)",Waste quantity (numbers and decimal points only),"Quantity units (tonnes, kilograms, litres, or cubic metres)",Quantity of waste (actual or estimate),"Chemical and biological components of the waste (separate multiple components using a semi colon. For example, textured coatings; floor tiles)",Chemical or biological concentrations value (separate multiple amounts using a semi colon),"Chemical or biological concentrations unit of measure (% or mg/kg, separate multiple amounts using a semi colon)",Does the waste have hazardous properties? (Y/N),Enter all hazardous waste codes (if applicable),Does the waste contain persistent organic pollutants (POPs)? (Y/N),Enter persistent organic pollutants (POPs) details (if applicable),"Enter POPs concentration value, using only numbers and a full stop","Enter POPs concentration unit of measure, for example %","Service transaction ID (from the record creation, 13 characters, letters and numbers)","Your unique reference (maximum 20 characters, letters and numbers only)", Confirm the carrier details are correct (Y/N), Broker registration number (only enter if applicable), Carrier registration number, Enter the carrier organisation name, Enter the carrier address line 1 (if applicable), "The carrier address line 2 optional, (if applicable)", Enter the carrier town or city (if applicable), Enter the carrier country (if applicable), "Enter the carrier postcode in the correct format (optional, if applicable)", Enter the carrier contact name (if applicable), Enter the carrier contact email (if applicable), Enter the carrier phone number (if applicable), "Mode of waste transport (road, rail, air, sea, or inland waterway)", Vehicle registration number, Date waste collected, "Time waste collected (can be an estimate, for example 2:30pm)"`;

const submissions: UkwmSubmittedPartialSubmission[] = [
  ...Array(155).keys(),
].map((i) => ({
  id: uuidv4(),
  transactionId: `WM24_${i.toString().padStart(3, '0')}9ACAD`,
  reference: `Producer Ref ${i}`,
  producer: {
    contact: {
      organisationName: `Producer Org ${i}`,
      emailAddress: `email${i}@example.com`,
      fullName: `Producer ${i}`,
      phoneNumber: `0123456789${i}`,
    },
    address: {
      addressLine1: `Address Line 1 ${i}`,
      addressLine2: `Address Line 2 ${i}`,
      townCity: `City ${i}`,
      country: `Country ${i}`,
      postcode: `Postcode ${i}`,
    },
    sicCode: i.toString().padStart(6, '0'),
  },
  receiver: {
    contact: {
      organisationName: `Receiver Org ${i}`,
      emailAddress: `email${i}@example.com`,
      fullName: `Receiver ${i}`,
      phoneNumber: `0123456789${i}`,
    },
    address: {
      addressLine1: `Address Line 1 ${i}`,
      addressLine2: `Address Line 2 ${i}`,
      townCity: `City ${i}`,
      country: `Country ${i}`,
      postcode: `Postcode ${i}`,
    },
    permitDetails: {
      authorizationType: 'permit',
      environmentalPermitNumber: `EPN ${i}`,
    },
  },
  wasteTransportation: {
    numberAndTypeOfContainers: `Containers ${i}`,
    specialHandlingRequirements: `Special Handling ${i}`,
  },
  wasteCollection: {
    expectedWasteCollectionDate: {
      day: ((i % 31) + 1).toString(),
      month: ((i % 12) + 1).toString(),
      year: '2024',
    },
    address: {
      addressLine1: `Address Line 1 ${i}`,
      addressLine2: `Address Line 2 ${i}`,
      country: `Country ${i}`,
      postcode: `Postcode ${i}`,
      townCity: `Town City ${i}`,
    },
    localAuthority: 'Local authority 1',
    wasteSource: 'commercial',
    brokerRegistrationNumber: `BRN ${i}`,
    carrierRegistrationNumber: `CRN ${i}`,
  },
  wasteTypes: [
    {
      ewcCode: `${i.toString().padStart(3, '0')}012`,
      physicalForm: 'Solid',
      wasteQuantity: 1000,
      wasteQuantityType: 'ActualData',
      quantityUnit: 'Kilogram',
      wasteDescription: `Waste Description ${i}`,
      chemicalAndBiologicalComponents: [
        {
          concentration: 1,
          concentrationUnit: 'Microgram',
          name: `Chemical ${i}`,
        },
      ],
      hasHazardousProperties: true,
      hazardousWasteCodes: [
        {
          code: `HWC ${i}`,
          name: `HWC Name ${i}`,
        },
      ],
      containsPops: true,
      pops: [
        {
          concentration: 1,
          concentrationUnit: 'Microgram',
          name: `POP ${i}`,
        },
      ],
    },
  ],
  submissionState: {
    status: 'SubmittedWithActuals',
    timestamp: new Date(),
  },
}));

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

export interface RowRef {
  rowId: string;
  batchId: string;
}

export interface ColumnRef {
  columnRef: string;
  batchId: string;
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
    if (err instanceof Boom.Boom) {
      return Promise.reject(err);
    }

    if (err instanceof Error && 'code' in err && typeof err.code === 'string') {
      const value: UkwmBulkWithAccount = {
        id: id,
        state: {
          status: 'FailedCsvValidation',
          timestamp: new Date(),
          error: err.code,
        },
        accountId: accountId,
      };
      db.ukwmBatches.push(value);
      return Promise.resolve({ id: id });
    }

    return Promise.reject(Boom.internal());
  }

  const timestamp = new Date();
  const transactionId =
    timestamp.getFullYear().toString().substring(2) +
    (timestamp.getMonth() + 1).toString().padStart(2, '0') +
    '_' +
    id.substring(0, 8).toUpperCase();

  let value: UkwmBulkWithAccount = {
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
    case 'FailedCsvValidation':
      value = {
        id: id,
        accountId: accountId,
        state: {
          status: 'FailedCsvValidation',
          timestamp: timestamp,
          error: 'Invalid CSV',
        },
      };
      break;
    case 'FailedValidation':
      value = {
        id: id,
        accountId: accountId,
        state: {
          status: 'FailedValidation',
          timestamp: new Date(),
          errorSummary: {
            columnBased: [
              {
                columnRef: 'Producer contact phone number',
                count: 2,
              },
              {
                columnRef: 'Waste Collection Details Country',
                count: 1,
              },
            ],
            rowBased: [
              {
                rowNumber: 1,
                rowId: 'row1',
                count: 2,
              },
              {
                rowNumber: 2,
                rowId: 'row2',
                count: 1,
              },
            ],
          },
        },
      };
      break;
    case 'PassedValidation':
      value = {
        id: id,
        accountId: accountId,
        state: {
          status: 'PassedValidation',
          timestamp: timestamp,
          hasEstimates: true,
          rowsCount: 2,
        },
      };
      break;
    case 'Submitting':
      value = {
        id: id,
        accountId: accountId,
        state: {
          status: 'Submitting',
          timestamp: timestamp,
          hasEstimates: true,
          transactionId: transactionId,
        },
      };
      break;
    case 'Submitted':
      value = {
        id: id,
        accountId: accountId,
        state: {
          status: 'Submitted',
          transactionId: transactionId,
          timestamp: timestamp,
          hasEstimates: true,
          createdRowsCount: 3,
        },
      };
      break;
  }

  db.ukwmBatches.push(value);
  return { id: value.id };
}

export function getBatch({
  id,
  accountId,
}: BatchRef): Promise<UkwmBulkSubmission> {
  const value = db.ukwmBatches.find(
    (b) => b.id == id && b.accountId == accountId,
  );
  if (value === undefined) {
    return Promise.reject(Boom.notFound());
  }

  return Promise.resolve(value);
}

export function finalizeBatch({ id, accountId }: BatchRef): Promise<void> {
  const value = db.ukwmBatches.find(
    (b) => b.id == id && b.accountId == accountId,
  );
  if (value === undefined) {
    return Promise.reject(Boom.notFound());
  }

  const timestamp = new Date();
  const transactionId =
    'WM' +
    timestamp.getFullYear().toString().substring(2) +
    (timestamp.getMonth() + 1).toString().padStart(2, '0') +
    '_' +
    id.substring(0, 8).toUpperCase();

  value.state = {
    status: 'Submitted',
    transactionId: transactionId,
    timestamp: timestamp,
    hasEstimates: true,
    createdRowsCount: 5,
  };

  return Promise.resolve();
}

export async function downloadCsv(): Promise<string | Buffer> {
  const drafts = db.ukwmDownload;

  let csvText = downloadSections + '\n' + downloadHeaders + '\n';

  for (const submission of drafts) {
    const keys = Object.keys(submission);
    const values = keys.map((key) => {
      if (submission[key].includes(',')) {
        return `"${submission[key]}"`;
      }
      return submission[key];
    });
    csvText += values.join(',') + '\n';
  }
  const buffer = Buffer.from(csvText, 'utf-8');

  return buffer;
}

export function getRow({ rowId }: RowRef): Promise<UkwmRowWithMessage> {
  const rowWithMessage = db.ukwmRows.find((r) => r.id == rowId);
  if (rowWithMessage === undefined) {
    return Promise.reject(Boom.notFound());
  }

  return Promise.resolve(rowWithMessage);
}

export function getColumn({
  columnRef,
}: ColumnRef): Promise<UkwmColumnWithMessage> {
  const columnWithMessage = db.ukwmColumns.find(
    (r) => r.columnRef == columnRef,
  );
  if (columnWithMessage === undefined) {
    return Promise.reject(Boom.notFound());
  }
  return Promise.resolve(columnWithMessage);
}

export function getSubmissions(
  page: number,
  pageSize: number,
  collectionDate?: Date,
  ewcCode?: string,
  producerName?: string,
  wasteMovementId?: string,
): Promise<UkwmPagedSubmissionData> {
  let filteredSubmissions = submissions;

  if (wasteMovementId) {
    filteredSubmissions = filteredSubmissions.filter(
      (s) => s.transactionId === wasteMovementId,
    );
  }

  if (collectionDate) {
    filteredSubmissions = filteredSubmissions.filter(
      (s) =>
        s.wasteCollection.expectedWasteCollectionDate.day ===
          collectionDate.getDate().toString() &&
        s.wasteCollection.expectedWasteCollectionDate.month ===
          (collectionDate.getMonth() + 1).toString() &&
        s.wasteCollection.expectedWasteCollectionDate.year ===
          collectionDate.getFullYear().toString(),
    );
  }

  if (ewcCode) {
    filteredSubmissions = filteredSubmissions.filter((s) =>
      s.wasteTypes.some((wt) => wt.ewcCode === ewcCode),
    );
  }

  if (producerName) {
    filteredSubmissions = filteredSubmissions.filter((s) =>
      s.producer.contact.organisationName.includes(producerName),
    );
  }

  const pagedSubmissions = filteredSubmissions.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  return Promise.resolve({
    totalRecords: filteredSubmissions.length,
    totalPages: Math.ceil(filteredSubmissions.length / pageSize),
    page,
    values: pagedSubmissions.map((s) => ({
      id: s.id,
      wasteMovementId: s.transactionId,
      producerName: s.producer.contact.organisationName,
      ewcCode: s.wasteTypes[0].ewcCode,
      collectionDate: s.wasteCollection.expectedWasteCollectionDate,
    })),
  });
}
