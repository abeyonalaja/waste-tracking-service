import {
  CosmosClient,
  Database,
  SqlParameter,
  SqlQuerySpec,
} from '@azure/cosmos';
import Boom from '@hapi/boom';
import { QuantityUnit, WasteQuantityType } from '@wts/api/uk-waste-movements';
import {
  ErrorColumn,
  Row,
  SubmissionFlattenedDownload,
} from '@wts/api/uk-waste-movements-bulk';
import { Logger } from 'winston';
import {
  BulkSubmission,
  BulkSubmissionPartialSummary,
  PagedSubmissionData,
} from '../model';
import { BatchRepository } from './batch-repository';

type BulkSubmissionData = BulkSubmission & { accountId: string };

interface BulkContainersMap {
  batches: string;
  rows: string;
  columns: string;
}

const wasteQuantityTypesMap: { [key in WasteQuantityType]: string } = {
  ActualData: 'Actual',
  EstimateData: 'Estimate',
};

const wasteQuantityUnitsMap: { [key in QuantityUnit]: string } = {
  Tonne: 'tonnes',
  'Cubic Metre': 'cubic metres',
  Kilogram: 'kilograms',
  Litre: 'litre',
};

const containsMap = new Map<boolean, string>([
  [true, 'Y'],
  [false, 'N'],
]);

export class CosmosBatchRepository implements BatchRepository {
  private cosmosDb: Database;

  constructor(
    private cosmosClient: CosmosClient,
    private cosmosDbName: string,
    private containersMap: BulkContainersMap,
    private logger: Logger,
  ) {
    this.cosmosDb = this.cosmosClient.database(this.cosmosDbName);
  }

  async saveBatch(value: BulkSubmission, accountId: string): Promise<void> {
    const data: BulkSubmissionData = { ...value, accountId };
    try {
      const item = {
        id: data.id,
        value: data,
        partitionKey: data.accountId,
      };
      await this.cosmosDb
        .container(this.containersMap.batches)
        .scripts.storedProcedure('upsertRecords')
        .execute(accountId, [[item]]);
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }

  async getBatch(id: string, accountId: string): Promise<BulkSubmission> {
    const { resource: item } = await this.cosmosDb
      .container(this.containersMap.batches)
      .item(id, accountId)
      .read();

    if (!item) {
      throw Boom.notFound();
    }

    const data = item.value as BulkSubmissionData;
    return {
      id: data.id,
      state: data.state,
    };
  }

  async getBatchRows(batchId: string, accountId: string): Promise<Row[]> {
    const query: SqlQuerySpec = {
      query: `SELECT * FROM c 
                WHERE c['value']['batchId']= @batchId AND c['value']['accountId'] = @accountId`,
      parameters: [
        { name: '@batchId', value: batchId },
        { name: '@accountId', value: accountId },
      ],
    };

    const { resources: items } = await this.cosmosDb
      .container(this.containersMap.rows)
      .items.query(query)
      .fetchAll();

    if (!items?.length) {
      throw Boom.notFound();
    }

    return items.map((x) => x.value as Row);
  }

  async downloadProducerCsv(
    id: string,
    accountId: string,
  ): Promise<SubmissionFlattenedDownload[]> {
    const batch = await this.getBatch(id, accountId);
    const rows = await this.getBatchRows(id, accountId);

    const flattenedSubmissionArray: SubmissionFlattenedDownload[] = [];

    if (batch.state.status === 'Submitted') {
      for (const row of rows) {
        const submission =
          row.data.valid && row.data.submitted && row.data.content;
        if (!submission) {
          continue;
        }

        const producer = submission.producer;
        const wasteTypes = submission.wasteTypes;
        const wasteCollection = submission.wasteCollection;
        const carrier = submission.carrier;
        const receiver = submission.receiver;
        const wasteTransportation = submission.wasteTransportation;

        const flattenedSubmission: SubmissionFlattenedDownload = {
          producerOrganisationName: producer?.contact?.organisationName || '',
          producerAddressLine1: producer?.address?.addressLine1 || '',
          producerAddressLine2: producer?.address?.addressLine2 || '',
          producerTownCity: producer?.address.townCity || '',
          producerCountry: producer?.address?.country || '',
          producerPostcode: producer?.address?.postcode || '',
          producerContactName: producer?.contact?.name || '',
          producerContactEmail: producer?.contact?.email || '',
          producerContactPhone: producer?.contact?.phone || '',
          producerSicCode: producer?.sicCode || '',
          wasteCollectionAddressLine1:
            wasteCollection?.address?.addressLine1 || '',
          wasteCollectionAddressLine2:
            wasteCollection?.address?.addressLine2 || '',
          wasteCollectionTownCity: wasteCollection?.address?.townCity || '',
          wasteCollectionCountry: wasteCollection?.address?.country || '',
          wasteCollectionPostcode: wasteCollection?.address?.postcode || '',
          wasteCollectionLocalAuthority: wasteCollection?.localAuthority || '',
          wasteCollectionWasteSource: wasteCollection?.wasteSource || '',
          wasteCollectionBrokerRegistrationNumber:
            wasteCollection?.brokerRegistrationNumber || '',
          wasteCollectionCarrierRegistrationNumber:
            wasteCollection?.carrierRegistrationNumber || '',
          wasteCollectionExpectedWasteCollectionDate:
            wasteCollection?.expectedWasteCollectionDate
              ? `${wasteCollection?.expectedWasteCollectionDate?.day}/${wasteCollection?.expectedWasteCollectionDate?.month}/${wasteCollection?.expectedWasteCollectionDate?.year}`
              : '',
          carrierOrganisationName: carrier?.contact?.organisationName || '',
          carrierAddressLine1: carrier?.address?.addressLine1 || '',
          carrierAddressLine2: carrier?.address?.addressLine2 || '',
          carrierTownCity: carrier?.address?.townCity || '',
          carrierCountry: carrier?.address?.country || '',
          carrierPostcode: carrier?.address?.postcode || '',
          carrierContactName: carrier?.contact?.name || '',
          carrierContactEmail: carrier?.contact?.email || '',
          carrierContactPhone: carrier?.contact?.phone
            ? `'${carrier?.contact?.phone}'`
            : '',
          receiverAuthorizationType:
            receiver?.permitDetails?.authorizationType || '',
          receiverEnvironmentalPermitNumber:
            receiver?.permitDetails?.environmentalPermitNumber || '',
          receiverOrganisationName: receiver?.contact?.organisationName || '',
          receiverAddressLine1: receiver?.address?.addressLine1 || '',
          receiverAddressLine2: receiver?.address.addressLine2 || '',
          receiverTownCity: receiver?.address?.townCity || '',
          receiverCountry: receiver?.address?.country || '',
          receiverPostcode: receiver?.address?.postcode || '',
          receiverContactName: receiver?.contact?.name || '',
          receiverContactEmail: receiver?.contact?.email || '',
          receiverContactPhone: receiver?.contact?.phone
            ? `'${receiver?.contact?.phone}'`
            : '',
          wasteTransportationNumberAndTypeOfContainers:
            wasteTransportation?.numberAndTypeOfContainers || '',
          wasteTransportationSpecialHandlingRequirements:
            wasteTransportation?.specialHandlingRequirements || '',
          firstWasteTypeEwcCode: wasteTypes[0]?.ewcCode
            ? `'${wasteTypes[0]?.ewcCode}'`
            : '',
          firstWasteTypeWasteDescription: wasteTypes[0]?.wasteDescription || '',
          firstWasteTypePhysicalForm: wasteTypes[0]?.physicalForm || '',
          firstWasteTypeWasteQuantity:
            wasteTypes[0]?.wasteQuantity?.toString() || '',
          firstWasteTypeWasteQuantityUnit: wasteTypes[0]?.quantityUnit
            ? wasteQuantityUnitsMap[wasteTypes[0]?.quantityUnit]
            : '',
          firstWasteTypeWasteQuantityType: wasteTypes[0]?.wasteQuantityType
            ? wasteQuantityTypesMap[wasteTypes[0]?.wasteQuantityType]
            : '',
          firstWasteTypeChemicalAndBiologicalComponentsString:
            wasteTypes[0]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteTypes[0]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteTypes[0]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          firstWasteTypeHasHazardousProperties:
            wasteTypes[0]?.hasHazardousProperties?.toString()
              ? containsMap.get(wasteTypes[0]?.hasHazardousProperties) || ''
              : '',
          firstWasteTypeHazardousWasteCodesString:
            wasteTypes[0]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          firstWasteTypeContainsPops: wasteTypes[0]?.containsPops?.toString()
            ? containsMap.get(wasteTypes[0]?.containsPops) || ''
            : '',
          firstWasteTypePopsString:
            wasteTypes[0]?.pops?.map((p) => p?.name)?.join(';') || '',
          firstWasteTypePopsConcentrationsString:
            wasteTypes[0]?.pops?.map((p) => p?.concentration)?.join(';') || '',
          firstWasteTypePopsConcentrationUnitsString:
            wasteTypes[0]?.pops?.map((p) => p?.concentrationUnit)?.join(';') ||
            '',
          secondWasteTypeEwcCode: wasteTypes[1]?.ewcCode
            ? `'${wasteTypes[1]?.ewcCode}'`
            : '',
          secondWasteTypeWasteDescription:
            wasteTypes[1]?.wasteDescription || '',
          secondWasteTypePhysicalForm: wasteTypes[1]?.physicalForm || '',
          secondWasteTypeWasteQuantity:
            wasteTypes[1]?.wasteQuantity?.toString() || '',
          secondWasteTypeWasteQuantityUnit: wasteTypes[1]?.quantityUnit
            ? wasteQuantityUnitsMap[wasteTypes[1]?.quantityUnit]
            : '',
          secondWasteTypeWasteQuantityType: wasteTypes[1]?.wasteQuantityType
            ? wasteQuantityTypesMap[wasteTypes[1]?.wasteQuantityType]
            : '',
          secondWasteTypeChemicalAndBiologicalComponentsString:
            wasteTypes[1]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          secondWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteTypes[1]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          secondWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteTypes[1]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          secondWasteTypeHasHazardousProperties:
            wasteTypes[1]?.hasHazardousProperties?.toString()
              ? containsMap.get(wasteTypes[1]?.hasHazardousProperties) || ''
              : '',
          secondWasteTypeHazardousWasteCodesString:
            wasteTypes[1]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          secondWasteTypeContainsPops: wasteTypes[1]?.containsPops?.toString()
            ? containsMap.get(wasteTypes[1]?.containsPops) || ''
            : '',
          secondWasteTypePopsString:
            wasteTypes[1]?.pops?.map((p) => p?.name)?.join(';') || '',
          secondWasteTypePopsConcentrationsString:
            wasteTypes[1]?.pops?.map((p) => p?.concentration)?.join(';') || '',
          secondWasteTypePopsConcentrationUnitsString:
            wasteTypes[1]?.pops?.map((p) => p?.concentrationUnit)?.join(';') ||
            '',
          thirdWasteTypeEwcCode: wasteTypes[2]?.ewcCode
            ? `'${wasteTypes[2]?.ewcCode}'`
            : '',
          thirdWasteTypeWasteDescription: wasteTypes[2]?.wasteDescription || '',
          thirdWasteTypePhysicalForm: wasteTypes[2]?.physicalForm || '',
          thirdWasteTypeWasteQuantity:
            wasteTypes[2]?.wasteQuantity?.toString() || '',
          thirdWasteTypeWasteQuantityUnit: wasteTypes[2]?.quantityUnit
            ? wasteQuantityUnitsMap[wasteTypes[2]?.quantityUnit]
            : '',
          thirdWasteTypeWasteQuantityType: wasteTypes[2]?.wasteQuantityType
            ? wasteQuantityTypesMap[wasteTypes[2]?.wasteQuantityType]
            : '',
          thirdWasteTypeChemicalAndBiologicalComponentsString:
            wasteTypes[2]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          thirdWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteTypes[2]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          thirdWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteTypes[2]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          thirdWasteTypeHasHazardousProperties:
            wasteTypes[2]?.hasHazardousProperties?.toString()
              ? containsMap.get(wasteTypes[2]?.hasHazardousProperties) || ''
              : '',
          thirdWasteTypeHazardousWasteCodesString:
            wasteTypes[2]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          thirdWasteTypeContainsPops: wasteTypes[2]?.containsPops?.toString()
            ? containsMap.get(wasteTypes[2]?.containsPops) || ''
            : '',
          thirdWasteTypePopsString:
            wasteTypes[2]?.pops?.map((p) => p?.name)?.join(';') || '',
          thirdWasteTypePopsConcentrationsString:
            wasteTypes[2]?.pops?.map((p) => p?.concentration)?.join(';') || '',
          thirdWasteTypePopsConcentrationUnitsString:
            wasteTypes[2]?.pops?.map((p) => p?.concentrationUnit)?.join(';') ||
            '',
          fourthWasteTypeEwcCode: wasteTypes[3]?.ewcCode
            ? `'${wasteTypes[3]?.ewcCode}'`
            : '',
          fourthWasteTypeWasteDescription:
            wasteTypes[3]?.wasteDescription || '',
          fourthWasteTypePhysicalForm: wasteTypes[3]?.physicalForm || '',
          fourthWasteTypeWasteQuantity:
            wasteTypes[3]?.wasteQuantity?.toString() || '',
          fourthWasteTypeWasteQuantityUnit: wasteTypes[3]?.quantityUnit
            ? wasteQuantityUnitsMap[wasteTypes[3]?.quantityUnit]
            : '',
          fourthWasteTypeWasteQuantityType: wasteTypes[3]?.wasteQuantityType
            ? wasteQuantityTypesMap[wasteTypes[3]?.wasteQuantityType]
            : '',
          fourthWasteTypeChemicalAndBiologicalComponentsString:
            wasteTypes[3]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          fourthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteTypes[3]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          fourthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteTypes[3]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          fourthWasteTypeHasHazardousProperties:
            wasteTypes[3]?.hasHazardousProperties?.toString()
              ? containsMap.get(wasteTypes[3]?.hasHazardousProperties) || ''
              : '',

          fourthWasteTypeHazardousWasteCodesString:
            wasteTypes[3]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          fourthWasteTypeContainsPops: wasteTypes[3]?.containsPops?.toString()
            ? containsMap.get(wasteTypes[3]?.containsPops) || ''
            : '',
          fourthWasteTypePopsString:
            wasteTypes[3]?.pops?.map((p) => p?.name)?.join(';') || '',
          fourthWasteTypePopsConcentrationsString:
            wasteTypes[3]?.pops?.map((p) => p?.concentration)?.join(';') || '',
          fourthWasteTypePopsConcentrationUnitsString:
            wasteTypes[3]?.pops?.map((p) => p?.concentrationUnit)?.join(';') ||
            '',
          fifthWasteTypeEwcCode: wasteTypes[4]?.ewcCode
            ? `'${wasteTypes[4]?.ewcCode}'`
            : '',
          fifthWasteTypeWasteDescription: wasteTypes[4]?.wasteDescription || '',
          fifthWasteTypePhysicalForm: wasteTypes[4]?.physicalForm || '',
          fifthWasteTypeWasteQuantity:
            wasteTypes[4]?.wasteQuantity?.toString() || '',
          fifthWasteTypeWasteQuantityUnit: wasteTypes[4]?.quantityUnit
            ? wasteQuantityUnitsMap[wasteTypes[4]?.quantityUnit]
            : '',
          fifthWasteTypeWasteQuantityType: wasteTypes[4]?.wasteQuantityType
            ? wasteQuantityTypesMap[wasteTypes[4]?.wasteQuantityType]
            : '',
          fifthWasteTypeChemicalAndBiologicalComponentsString:
            wasteTypes[4]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          fifthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteTypes[4]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          fifthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteTypes[4]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          fifthWasteTypeHasHazardousProperties:
            wasteTypes[4]?.hasHazardousProperties?.toString()
              ? containsMap.get(wasteTypes[4]?.hasHazardousProperties) || ''
              : '',
          fifthWasteTypeHazardousWasteCodesString:
            wasteTypes[4]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          fifthWasteTypeContainsPops: wasteTypes[4]?.containsPops?.toString()
            ? containsMap.get(wasteTypes[4]?.containsPops) || ''
            : '',
          fifthWasteTypePopsString:
            wasteTypes[4]?.pops?.map((p) => p?.name)?.join(';') || '',
          fifthWasteTypePopsConcentrationsString:
            wasteTypes[4]?.pops?.map((p) => p?.concentration)?.join(';') || '',
          fifthWasteTypePopsConcentrationUnitsString:
            wasteTypes[4]?.pops?.map((p) => p?.concentrationUnit)?.join(';') ||
            '',
          sixthWasteTypeEwcCode: wasteTypes[5]?.ewcCode
            ? `'${wasteTypes[5]?.ewcCode}'`
            : '',
          sixthWasteTypeWasteDescription: wasteTypes[5]?.wasteDescription || '',
          sixthWasteTypePhysicalForm: wasteTypes[5]?.physicalForm || '',
          sixthWasteTypeWasteQuantity:
            wasteTypes[5]?.wasteQuantity?.toString() || '',
          sixthWasteTypeWasteQuantityUnit: wasteTypes[5]?.quantityUnit
            ? wasteQuantityUnitsMap[wasteTypes[5]?.quantityUnit]
            : '',
          sixthWasteTypeWasteQuantityType: wasteTypes[5]?.wasteQuantityType
            ? wasteQuantityTypesMap[wasteTypes[5]?.wasteQuantityType]
            : '',
          sixthWasteTypeChemicalAndBiologicalComponentsString:
            wasteTypes[5]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          sixthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteTypes[5]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          sixthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteTypes[5]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          sixthWasteTypeHasHazardousProperties:
            wasteTypes[5]?.hasHazardousProperties?.toString()
              ? containsMap.get(wasteTypes[5]?.hasHazardousProperties) || ''
              : '',
          sixthWasteTypeHazardousWasteCodesString:
            wasteTypes[5]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          sixthWasteTypeContainsPops: wasteTypes[5]?.containsPops?.toString()
            ? containsMap.get(wasteTypes[5]?.containsPops) || ''
            : '',
          sixthWasteTypePopsString:
            wasteTypes[5]?.pops?.map((p) => p?.name)?.join(';') || '',
          sixthWasteTypePopsConcentrationsString:
            wasteTypes[5]?.pops?.map((p) => p?.concentration)?.join(';') || '',
          sixthWasteTypePopsConcentrationUnitsString:
            wasteTypes[5]?.pops?.map((p) => p?.concentrationUnit)?.join(';') ||
            '',
          seventhWasteTypeEwcCode: wasteTypes[6]?.ewcCode
            ? `'${wasteTypes[6]?.ewcCode}'`
            : '',
          seventhWasteTypeWasteDescription:
            wasteTypes[6]?.wasteDescription || '',
          seventhWasteTypePhysicalForm: wasteTypes[6]?.physicalForm || '',
          seventhWasteTypeWasteQuantity:
            wasteTypes[6]?.wasteQuantity?.toString() || '',
          seventhWasteTypeWasteQuantityUnit: wasteTypes[6]?.quantityUnit
            ? wasteQuantityUnitsMap[wasteTypes[6]?.quantityUnit]
            : '',

          seventhWasteTypeWasteQuantityType: wasteTypes[6]?.wasteQuantityType
            ? wasteQuantityTypesMap[wasteTypes[6]?.wasteQuantityType]
            : '',
          seventhWasteTypeChemicalAndBiologicalComponentsString:
            wasteTypes[6]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          seventhWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteTypes[6]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          seventhWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteTypes[6]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          seventhWasteTypeHasHazardousProperties:
            wasteTypes[6]?.hasHazardousProperties?.toString()
              ? containsMap.get(wasteTypes[6]?.hasHazardousProperties) || ''
              : '',
          seventhWasteTypeHazardousWasteCodesString:
            wasteTypes[6]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          seventhWasteTypeContainsPops: wasteTypes[6]?.containsPops?.toString()
            ? containsMap.get(wasteTypes[6]?.containsPops) || ''
            : '',
          seventhWasteTypePopsString:
            wasteTypes[6]?.pops?.map((p) => p?.name)?.join(';') || '',
          seventhWasteTypePopsConcentrationsString:
            wasteTypes[6]?.pops?.map((p) => p?.concentration)?.join(';') || '',
          seventhWasteTypePopsConcentrationUnitsString:
            wasteTypes[6]?.pops?.map((p) => p?.concentrationUnit)?.join(';') ||
            '',
          eighthWasteTypeEwcCode: wasteTypes[7]?.ewcCode
            ? `'${wasteTypes[7]?.ewcCode}'`
            : '',
          eighthWasteTypeWasteDescription:
            wasteTypes[7]?.wasteDescription || '',
          eighthWasteTypePhysicalForm: wasteTypes[7]?.physicalForm || '',
          eighthWasteTypeWasteQuantity:
            wasteTypes[7]?.wasteQuantity?.toString() || '',
          eighthWasteTypeWasteQuantityUnit: wasteTypes[7]?.quantityUnit
            ? wasteQuantityUnitsMap[wasteTypes[7]?.quantityUnit]
            : '',
          eighthWasteTypeWasteQuantityType: wasteTypes[7]?.wasteQuantityType
            ? wasteQuantityTypesMap[wasteTypes[7]?.wasteQuantityType]
            : '',
          eighthWasteTypeChemicalAndBiologicalComponentsString:
            wasteTypes[7]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          eighthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteTypes[7]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          eighthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteTypes[7]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          eighthWasteTypeHasHazardousProperties:
            wasteTypes[7]?.hasHazardousProperties?.toString()
              ? containsMap.get(wasteTypes[7]?.hasHazardousProperties) || ''
              : '',
          eighthWasteTypeHazardousWasteCodesString:
            wasteTypes[7]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          eighthWasteTypeContainsPops: wasteTypes[7]?.containsPops?.toString()
            ? containsMap.get(wasteTypes[7]?.containsPops) || ''
            : '',
          eighthWasteTypePopsString:
            wasteTypes[7]?.pops?.map((p) => p?.name)?.join(';') || '',
          eighthWasteTypePopsConcentrationsString:
            wasteTypes[7]?.pops?.map((p) => p?.concentration)?.join(';') || '',
          eighthWasteTypePopsConcentrationUnitsString:
            wasteTypes[7]?.pops?.map((p) => p?.concentrationUnit)?.join(';') ||
            '',
          ninthWasteTypeEwcCode: wasteTypes[8]?.ewcCode
            ? `'${wasteTypes[8]?.ewcCode}'`
            : '',
          ninthWasteTypeWasteDescription: wasteTypes[8]?.wasteDescription || '',
          ninthWasteTypePhysicalForm: wasteTypes[8]?.physicalForm || '',
          ninthWasteTypeWasteQuantity:
            wasteTypes[8]?.wasteQuantity?.toString() || '',
          ninthWasteTypeWasteQuantityUnit: wasteTypes[8]?.quantityUnit
            ? wasteQuantityUnitsMap[wasteTypes[8]?.quantityUnit]
            : '',
          ninthWasteTypeWasteQuantityType: wasteTypes[8]?.wasteQuantityType
            ? wasteQuantityTypesMap[wasteTypes[8]?.wasteQuantityType]
            : '',
          ninthWasteTypeChemicalAndBiologicalComponentsString:
            wasteTypes[8]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          ninthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteTypes[8]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          ninthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteTypes[8]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          ninthWasteTypeHasHazardousProperties:
            wasteTypes[8]?.hasHazardousProperties?.toString()
              ? containsMap.get(wasteTypes[8]?.hasHazardousProperties) || ''
              : '',
          ninthWasteTypeHazardousWasteCodesString:
            wasteTypes[8]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          ninthWasteTypeContainsPops: wasteTypes[8]?.containsPops?.toString()
            ? containsMap.get(wasteTypes[8]?.containsPops) || ''
            : '',
          ninthWasteTypePopsString:
            wasteTypes[8]?.pops?.map((p) => p?.name)?.join(';') || '',
          ninthWasteTypePopsConcentrationsString:
            wasteTypes[8]?.pops?.map((p) => p?.concentration)?.join(';') || '',
          ninthWasteTypePopsConcentrationUnitsString:
            wasteTypes[8]?.pops?.map((p) => p?.concentrationUnit)?.join(';') ||
            '',
          tenthWasteTypeEwcCode: wasteTypes[9]?.ewcCode
            ? `'${wasteTypes[9]?.ewcCode}'`
            : '',
          tenthWasteTypeWasteDescription: wasteTypes[9]?.wasteDescription || '',
          tenthWasteTypePhysicalForm: wasteTypes[9]?.physicalForm || '',
          tenthWasteTypeWasteQuantity:
            wasteTypes[9]?.wasteQuantity?.toString() || '',
          tenthWasteTypeWasteQuantityUnit: wasteTypes[9]?.quantityUnit
            ? wasteQuantityUnitsMap[wasteTypes[9]?.quantityUnit]
            : '',
          tenthWasteTypeWasteQuantityType: wasteTypes[9]?.wasteQuantityType
            ? wasteQuantityTypesMap[wasteTypes[9]?.wasteQuantityType]
            : '',
          tenthWasteTypeChemicalAndBiologicalComponentsString:
            wasteTypes[9]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          tenthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteTypes[9]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          tenthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteTypes[9]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          tenthWasteTypeHasHazardousProperties:
            wasteTypes[9]?.hasHazardousProperties?.toString()
              ? containsMap.get(wasteTypes[9]?.hasHazardousProperties) || ''
              : '',
          tenthWasteTypeHazardousWasteCodesString:
            wasteTypes[9]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          tenthWasteTypeContainsPops: wasteTypes[9]?.containsPops?.toString()
            ? containsMap.get(wasteTypes[9]?.containsPops) || ''
            : '',
          tenthWasteTypePopsString:
            wasteTypes[9]?.pops?.map((p) => p?.name)?.join(';') || '',
          tenthWasteTypePopsConcentrationsString:
            wasteTypes[9]?.pops?.map((p) => p?.concentration)?.join(';') || '',
          tenthWasteTypePopsConcentrationUnitsString:
            wasteTypes[9]?.pops?.map((p) => p?.concentrationUnit)?.join(';') ||
            '',
          transactionId: submission?.transactionId,
          carrierConfirmationUniqueReference: '',
          carrierConfirmationCorrectDetails: '',
          carrierConfirmationBrokerRegistrationNumber: '',
          carrierConfirmationRegistrationNumber: '',
          carrierConfirmationOrganisationName: '',
          carrierConfirmationAddressLine1: '',
          carrierConfirmationAddressLine2: '',
          carrierConfirmationTownCity: '',
          carrierConfirmationCountry: '',
          carrierConfirmationPostcode: '',
          carrierConfirmationContactName: '',
          carrierConfirmationContactEmail: '',
          carrierConfirmationContactPhone: '',
          carrierModeOfTransport: '',
          carrierVehicleRegistrationNumber: '',
          carrierDateWasteCollected: '',
          carrierTimeWasteCollected: '',
        };

        flattenedSubmissionArray.push(flattenedSubmission);
      }
      return flattenedSubmissionArray;
    } else {
      throw Boom.badRequest('Batch has not been submitted');
    }
  }

  async saveRows(
    rows: Row[],
    accountId: string,
    batchId: string,
  ): Promise<void> {
    const chunkSize = 50;
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize).map((row) => ({
        id: row.id,
        value: row,
        partitionKey: {
          accountId: row.accountId,
          batchId: row.batchId,
        },
      }));

      const partitionKey = [batchId, accountId];

      await this.cosmosDb
        .container(this.containersMap.rows)
        .scripts.storedProcedure('upsertRecords')
        .execute(partitionKey, [chunk]);
    }
  }

  async saveColumns(
    columns: ErrorColumn[],
    accountId: string,
    batchId: string,
  ): Promise<void> {
    for (const column of columns) {
      const columnItem = {
        id: column.id,
        value: column,
        partitionKey: {
          accountId: column.accountId,
          batchId: column.batchId,
        },
      };

      const partitionKey = [batchId, accountId];

      await this.cosmosDb
        .container(this.containersMap.columns)
        .scripts.storedProcedure('upsertRecords')
        .execute(partitionKey, [[columnItem]]);
    }
  }

  async getRow(
    accountId: string,
    batchId: string,
    rowId: string,
  ): Promise<Row> {
    const partitionKey = [batchId, accountId];

    const { resource: item } = await this.cosmosDb
      .container(this.containersMap.rows)
      .item(rowId, partitionKey)
      .read();

    if (!item) {
      throw Boom.notFound();
    }

    return item.value as Row;
  }

  async getColumn(
    accountId: string,
    batchId: string,
    columnRef: string,
  ): Promise<ErrorColumn> {
    const partitionKey = [batchId, accountId];

    const { resource: item } = await this.cosmosDb
      .container(this.containersMap.columns)
      .item(columnRef, partitionKey)
      .read();

    if (!item) {
      throw Boom.notFound();
    }

    return item.value as ErrorColumn;
  }

  async getBulkSubmissions(
    batchId: string,
    accountId: string,
    page: number,
    pageSize: number,
    collectionDate?: Date,
    ewcCode?: string,
    producerName?: string,
    wasteMovementId?: string,
  ): Promise<PagedSubmissionData> {
    if (page <= 0) {
      page = 1;
    }

    let dataQuery = `SELECT distinct value {
                        id: c["value"].data.content.id,
                        wasteMovementId: c["value"].data.content.transactionId, 
                        name: c["value"].data.content.producer.contact.organisationName,
                        ewcCode: c["value"].data.content.wasteTypes[0].ewcCode,
                        collectionDate: {
                            day: c["value"].data.content.wasteCollection.expectedWasteCollectionDate.day,
                            month: c["value"].data.content.wasteCollection.expectedWasteCollectionDate.month,
                            year: c["value"].data.content.wasteCollection.expectedWasteCollectionDate.year
                        }
                    }
                     FROM c JOIN wt IN c["value"].data.content.wasteTypes
                     where c['value'].data.submitted
                       and c['value'].batchId = @batchId
                       and c['value'].accountId = @accountId`;

    const queryParameters: SqlParameter[] = [
      {
        name: '@batchId',
        value: batchId,
      },
      {
        name: '@accountId',
        value: accountId,
      },
    ];

    if (wasteMovementId) {
      dataQuery += ` and c["value"].data.content.transactionId = @wasteMovementId`;
      const dataByTransactionIdQuerySpec: SqlQuerySpec = {
        query: dataQuery,
        parameters: [
          ...queryParameters,
          {
            name: '@wasteMovementId',
            value: wasteMovementId,
          },
        ],
      };

      const { resources: dataByTransactionIdItems } = await this.cosmosDb
        .container(this.containersMap.rows)
        .items.query<BulkSubmissionPartialSummary>(dataByTransactionIdQuerySpec)
        .fetchAll();

      return {
        page: 1,
        totalPages: 1,
        totalRecords: dataByTransactionIdItems.length,
        values: dataByTransactionIdItems,
      };
    }

    const queryFilters: string[] = [];

    if (ewcCode) {
      queryFilters.push(`wt["ewcCode"] = @ewcCode`);
      queryParameters.push({
        name: '@ewcCode',
        value: ewcCode,
      });
    }

    if (producerName) {
      queryFilters.push(
        `LOWER(c["value"].data.content.producer.contact.organisationName) like @producerOrgName`,
      );
      queryParameters.push({
        name: '@producerOrgName',
        value: `%${producerName.toLowerCase()}%`,
      });
    }

    if (collectionDate) {
      queryFilters.push(
        `c["value"].data.content.wasteCollection.expectedWasteCollectionDate.day = @day AND 
         c["value"].data.content.wasteCollection.expectedWasteCollectionDate.month = @month AND 
         c["value"].data.content.wasteCollection.expectedWasteCollectionDate.year = @year`,
      );
      queryParameters.push({
        name: '@day',
        value: collectionDate.getDate().toString().padStart(2, '0'),
      });
      queryParameters.push({
        name: '@month',
        value: (collectionDate.getMonth() + 1).toString().padStart(2, '0'),
      });
      queryParameters.push({
        name: '@year',
        value: collectionDate.getFullYear().toString(),
      });
    }

    if (queryFilters.length > 0) {
      dataQuery += ` and ${queryFilters.join(' AND ')}`;
    }

    const countQuery = `SELECT VALUE count(data)
                      FROM (${dataQuery}) as data`;

    dataQuery += ` order by c["_ts"] desc OFFSET @offset LIMIT @limit`;

    const dataQuerySpec: SqlQuerySpec = {
      query: dataQuery,
      parameters: [
        {
          name: '@offset',
          value: (page - 1) * pageSize,
        },
        {
          name: '@limit',
          value: pageSize,
        },
        ...queryParameters,
      ],
    };

    const countQuerySpec: SqlQuerySpec = {
      query: countQuery,
      parameters: queryParameters,
    };

    const { resources: countItems } = await this.cosmosDb
      .container(this.containersMap.rows)
      .items.query(countQuerySpec)
      .fetchAll();

    const { resources: dataItems } = await this.cosmosDb
      .container(this.containersMap.rows)
      .items.query<BulkSubmissionPartialSummary>(dataQuerySpec)
      .fetchAll();

    return {
      page: page,
      totalPages: Math.ceil(countItems[0] / pageSize),
      totalRecords: countItems[0],
      values: dataItems,
    };
  }
}
