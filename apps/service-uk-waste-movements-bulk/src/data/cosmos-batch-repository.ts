import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { BatchRepository } from './batch-repository';
import { BulkSubmission } from '../model';
import { CosmosClient, Database, PatchOperation } from '@azure/cosmos';
import { DraftSubmission } from '@wts/api/uk-waste-movements';
import { SubmissionFlattenedDownload } from '@wts/api/uk-waste-movements-bulk';

type BulkSubmissionData = BulkSubmission & { accountId: string };

export class CosmosBatchRepository implements BatchRepository {
  private cosmosDb: Database;

  constructor(
    private cosmosClient: CosmosClient,
    private cosmosDbName: string,
    private draftContainerName: string,
    private logger: Logger
  ) {
    this.cosmosDb = this.cosmosClient.database(this.cosmosDbName);
  }

  async saveBatch(value: BulkSubmission, accountId: string): Promise<void> {
    const data: BulkSubmissionData = { ...value, accountId };
    try {
      const { resource: item } = await this.cosmosDb
        .container(this.draftContainerName)
        .item(data.id, data.accountId)
        .read();

      if (!item) {
        const createItem = {
          id: data.id,
          value: data,
          partitionKey: data.accountId,
        };
        await this.cosmosDb
          .container(this.draftContainerName)
          .items.create(createItem);
      } else {
        const replaceOperation: PatchOperation[] = [
          {
            op: 'replace',
            path: '/value',
            value: data,
          },
        ];
        await this.cosmosDb
          .container(this.draftContainerName)
          .item(data.id, data.accountId)
          .patch(replaceOperation);
      }
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
  }

  async getBatch(id: string, accountId: string): Promise<BulkSubmission> {
    const { resource: item } = await this.cosmosDb
      .container(this.draftContainerName)
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

  async downloadProducerCsv(
    id: string
  ): Promise<SubmissionFlattenedDownload[]> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [
        {
          name: '@id',
          value: id,
        },
      ],
    };

    const { resources: items } = await this.cosmosDb
      .container(this.draftContainerName)
      .items.query(querySpec)
      .fetchAll();

    if (items.length === 0) {
      throw Boom.notFound();
    }

    const flattenedSubmissionArray: SubmissionFlattenedDownload[] = [];

    const batch = items[0].value as BulkSubmission;

    if (batch.state.status === 'Submitted') {
      const dataSubmissions = batch.state.submissions as DraftSubmission[];
      for (const submission of dataSubmissions) {
        const wasteInformation =
          submission?.wasteInformation?.status === 'Complete'
            ? submission?.wasteInformation
            : undefined;
        const producerAndCollection =
          submission?.producerAndCollection?.status === 'Complete'
            ? submission?.producerAndCollection
            : undefined;
        const carrier =
          submission?.carrier?.status === 'Complete'
            ? submission?.carrier
            : undefined;
        const receiver =
          submission?.receiver?.status === 'Complete'
            ? submission?.receiver
            : undefined;
        const flattenedSubmission: SubmissionFlattenedDownload = {
          wasteCollectionAddressLine1:
            producerAndCollection?.wasteCollection?.address?.addressLine1 || '',
          wasteCollectionAddressLine2:
            producerAndCollection?.wasteCollection?.address?.addressLine2 || '',
          wasteCollectionTownCity:
            producerAndCollection?.wasteCollection?.address?.townCity || '',
          wasteCollectionCountry:
            producerAndCollection?.wasteCollection?.address?.country || '',
          wasteCollectionPostcode:
            producerAndCollection?.wasteCollection?.address?.postcode || '',
          wasteCollectionLocalAuthority:
            producerAndCollection?.wasteCollection?.localAuthority || '',
          wasteCollectionWasteSource:
            producerAndCollection?.wasteCollection?.wasteSource || '',
          wasteCollectionBrokerRegistrationNumber:
            producerAndCollection?.wasteCollection?.carrierRegistrationNumber ||
            '',
          wasteCollectionCarrierRegistrationNumber:
            producerAndCollection?.wasteCollection?.carrierRegistrationNumber ||
            '',
          wasteCollectionExpectedWasteCollectionDate: producerAndCollection
            ?.wasteCollection?.expectedWasteCollectionDate
            ? `${producerAndCollection?.wasteCollection?.expectedWasteCollectionDate?.day}/${producerAndCollection?.wasteCollection?.expectedWasteCollectionDate?.month}/${producerAndCollection?.wasteCollection?.expectedWasteCollectionDate?.year}`
            : '',
          carrierOrganisationName:
            carrier?.value?.contact?.organisationName || '',
          carrierAddressLine1: carrier?.value?.address?.addressLine1 || '',
          carrierAddressLine2: carrier?.value?.address?.addressLine2 || '',
          carrierTownCity: carrier?.value?.address?.townCity || '',
          carrierCountry: carrier?.value?.address?.country || '',
          carrierPostcode: carrier?.value?.address?.postcode || '',
          carrierContactName: carrier?.value?.contact?.name || '',
          carrierContactEmail: carrier?.value?.contact?.email || '',
          carrierContactPhone: carrier?.value?.contact?.phone
            ? `'${carrier?.value?.contact?.phone}'`
            : '',
          receiverAuthorizationType: receiver?.value?.authorizationType || '',
          receiverEnvironmentalPermitNumber:
            receiver?.value?.environmentalPermitNumber || '',
          receiverOrganisationName:
            receiver?.value?.contact?.organisationName || '',
          receiverAddressLine1: receiver?.value?.address?.addressLine1 || '',
          receiverAddressLine2: receiver?.value?.address.addressLine2 || '',
          receiverTownCity: receiver?.value?.address?.townCity || '',
          receiverCountry: receiver?.value?.address?.country || '',
          receiverPostcode: receiver?.value?.address?.postcode || '',
          receiverContactName: receiver?.value?.contact?.name || '',
          receiverContactEmail: receiver?.value?.contact?.email || '',
          receiverContactPhone: receiver?.value?.contact?.phone
            ? `'${receiver?.value?.contact?.phone}'`
            : '',
          wasteTransportationNumberAndTypeOfContainers:
            wasteInformation?.wasteTransportation?.numberAndTypeOfContainers ||
            '',
          wasteTransportationSpecialHandlingRequirements:
            wasteInformation?.wasteTransportation
              ?.specialHandlingRequirements || '',
          firstWasteTypeEwcCode: wasteInformation?.wasteTypes[0]?.ewcCode
            ? `'${wasteInformation?.wasteTypes[0]?.ewcCode}'`
            : '',
          firstWasteTypeWasteDescription:
            wasteInformation?.wasteTypes[0]?.wasteDescription || '',
          firstWasteTypePhysicalForm:
            wasteInformation?.wasteTypes[0]?.physicalForm || '',
          firstWasteTypeWasteQuantity:
            wasteInformation?.wasteTypes[0]?.wasteQuantity?.toString() || '',
          firstWasteTypeWasteQuantityUnit:
            wasteInformation?.wasteTypes[0]?.quantityUnit || '',
          firstWasteTypeWasteQuantityType:
            wasteInformation?.wasteTypes[0]?.wasteQuantityType || '',
          firstWasteTypeChemicalAndBiologicalComponentsString:
            wasteInformation?.wasteTypes[0]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteInformation?.wasteTypes[0]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          firstWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteInformation?.wasteTypes[0]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          firstWasteTypeHasHazardousProperties:
            wasteInformation?.wasteTypes[0]?.hasHazardousProperties?.toString() ||
            '',
          firstWasteTypeHazardousWasteCodesString:
            wasteInformation?.wasteTypes[0]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          firstWasteTypeContainsPops:
            wasteInformation?.wasteTypes[0]?.containsPops?.toString() || '',
          firstWasteTypePopsString:
            wasteInformation?.wasteTypes[0]?.pops
              ?.map((p) => p?.name)
              ?.join(';') || '',
          firstWasteTypePopsConcentrationsString:
            wasteInformation?.wasteTypes[0]?.pops
              ?.map((p) => p?.concentration)
              ?.join(';') || '',
          firstWasteTypePopsConcentrationUnitsString:
            wasteInformation?.wasteTypes[0]?.pops
              ?.map((p) => p?.concentrationUnit)
              ?.join(';') || '',
          secondWasteTypeEwcCode: wasteInformation?.wasteTypes[1]?.ewcCode
            ? `'${wasteInformation?.wasteTypes[1]?.ewcCode}'`
            : '',
          secondWasteTypeWasteDescription:
            wasteInformation?.wasteTypes[1]?.wasteDescription || '',
          secondWasteTypePhysicalForm:
            wasteInformation?.wasteTypes[1]?.physicalForm || '',
          secondWasteTypeWasteQuantity:
            wasteInformation?.wasteTypes[1]?.wasteQuantity?.toString() || '',
          secondWasteTypeWasteQuantityUnit:
            wasteInformation?.wasteTypes[1]?.quantityUnit || '',
          secondWasteTypeWasteQuantityType:
            wasteInformation?.wasteTypes[1]?.wasteQuantityType || '',
          secondWasteTypeChemicalAndBiologicalComponentsString:
            wasteInformation?.wasteTypes[1]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          secondWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteInformation?.wasteTypes[1]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          secondWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteInformation?.wasteTypes[1]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          secondWasteTypeHasHazardousProperties:
            wasteInformation?.wasteTypes[1]?.hasHazardousProperties?.toString() ||
            '',
          secondWasteTypeHazardousWasteCodesString:
            wasteInformation?.wasteTypes[1]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          secondWasteTypeContainsPops:
            wasteInformation?.wasteTypes[1]?.containsPops?.toString() || '',
          secondWasteTypePopsString:
            wasteInformation?.wasteTypes[1]?.pops
              ?.map((p) => p?.name)
              ?.join(';') || '',
          secondWasteTypePopsConcentrationsString:
            wasteInformation?.wasteTypes[1]?.pops
              ?.map((p) => p?.concentration)
              ?.join(';') || '',
          secondWasteTypePopsConcentrationUnitsString:
            wasteInformation?.wasteTypes[1]?.pops
              ?.map((p) => p?.concentrationUnit)
              ?.join(';') || '',
          thirdWasteTypeEwcCode: wasteInformation?.wasteTypes[2]?.ewcCode
            ? `'${wasteInformation?.wasteTypes[2]?.ewcCode}'`
            : '',
          thirdWasteTypeWasteDescription:
            wasteInformation?.wasteTypes[2]?.wasteDescription || '',
          thirdWasteTypePhysicalForm:
            wasteInformation?.wasteTypes[2]?.physicalForm || '',
          thirdWasteTypeWasteQuantity:
            wasteInformation?.wasteTypes[2]?.wasteQuantity?.toString() || '',
          thirdWasteTypeWasteQuantityUnit:
            wasteInformation?.wasteTypes[2]?.quantityUnit || '',
          thirdWasteTypeWasteQuantityType:
            wasteInformation?.wasteTypes[2]?.wasteQuantityType || '',
          thirdWasteTypeChemicalAndBiologicalComponentsString:
            wasteInformation?.wasteTypes[2]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          thirdWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteInformation?.wasteTypes[2]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          thirdWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteInformation?.wasteTypes[2]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          thirdWasteTypeHasHazardousProperties:
            wasteInformation?.wasteTypes[2]?.hasHazardousProperties?.toString() ||
            '',
          thirdWasteTypeHazardousWasteCodesString:
            wasteInformation?.wasteTypes[2]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          thirdWasteTypeContainsPops:
            wasteInformation?.wasteTypes[2]?.containsPops?.toString() || '',
          thirdWasteTypePopsString:
            wasteInformation?.wasteTypes[2]?.pops
              ?.map((p) => p?.name)
              ?.join(';') || '',
          thirdWasteTypePopsConcentrationsString:
            wasteInformation?.wasteTypes[2]?.pops
              ?.map((p) => p?.concentration)
              ?.join(';') || '',
          thirdWasteTypePopsConcentrationUnitsString:
            wasteInformation?.wasteTypes[2]?.pops
              ?.map((p) => p?.concentrationUnit)
              ?.join(';') || '',
          fourthWasteTypeEwcCode: wasteInformation?.wasteTypes[3]?.ewcCode
            ? `'${wasteInformation?.wasteTypes[3]?.ewcCode}'`
            : '',
          fourthWasteTypeWasteDescription:
            wasteInformation?.wasteTypes[3]?.wasteDescription || '',
          fourthWasteTypePhysicalForm:
            wasteInformation?.wasteTypes[3]?.physicalForm || '',
          fourthWasteTypeWasteQuantity:
            wasteInformation?.wasteTypes[3]?.wasteQuantity?.toString() || '',
          fourthWasteTypeWasteQuantityUnit:
            wasteInformation?.wasteTypes[3]?.quantityUnit || '',
          fourthWasteTypeWasteQuantityType:
            wasteInformation?.wasteTypes[3]?.wasteQuantityType || '',
          fourthWasteTypeChemicalAndBiologicalComponentsString:
            wasteInformation?.wasteTypes[3]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          fourthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteInformation?.wasteTypes[3]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          fourthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteInformation?.wasteTypes[3]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          fourthWasteTypeHasHazardousProperties:
            wasteInformation?.wasteTypes[3]?.hasHazardousProperties?.toString() ||
            '',
          fourthWasteTypeHazardousWasteCodesString:
            wasteInformation?.wasteTypes[3]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          fourthWasteTypeContainsPops:
            wasteInformation?.wasteTypes[3]?.containsPops?.toString() || '',
          fourthWasteTypePopsString:
            wasteInformation?.wasteTypes[3]?.pops
              ?.map((p) => p?.name)
              ?.join(';') || '',
          fourthWasteTypePopsConcentrationsString:
            wasteInformation?.wasteTypes[3]?.pops
              ?.map((p) => p?.concentration)
              ?.join(';') || '',
          fourthWasteTypePopsConcentrationUnitsString:
            wasteInformation?.wasteTypes[3]?.pops
              ?.map((p) => p?.concentrationUnit)
              ?.join(';') || '',
          fifthWasteTypeEwcCode: wasteInformation?.wasteTypes[4]?.ewcCode
            ? `'${wasteInformation?.wasteTypes[4]?.ewcCode}'`
            : '',
          fifthWasteTypeWasteDescription:
            wasteInformation?.wasteTypes[4]?.wasteDescription || '',
          fifthWasteTypePhysicalForm:
            wasteInformation?.wasteTypes[4]?.physicalForm || '',
          fifthWasteTypeWasteQuantity:
            wasteInformation?.wasteTypes[4]?.wasteQuantity?.toString() || '',
          fifthWasteTypeWasteQuantityUnit:
            wasteInformation?.wasteTypes[4]?.quantityUnit || '',
          fifthWasteTypeWasteQuantityType:
            wasteInformation?.wasteTypes[4]?.wasteQuantityType || '',
          fifthWasteTypeChemicalAndBiologicalComponentsString:
            wasteInformation?.wasteTypes[4]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          fifthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteInformation?.wasteTypes[4]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          fifthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteInformation?.wasteTypes[4]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          fifthWasteTypeHasHazardousProperties:
            wasteInformation?.wasteTypes[4]?.hasHazardousProperties?.toString() ||
            '',
          fifthWasteTypeHazardousWasteCodesString:
            wasteInformation?.wasteTypes[4]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          fifthWasteTypeContainsPops:
            wasteInformation?.wasteTypes[4]?.containsPops?.toString() || '',
          fifthWasteTypePopsString:
            wasteInformation?.wasteTypes[4]?.pops
              ?.map((p) => p?.name)
              ?.join(';') || '',
          fifthWasteTypePopsConcentrationsString:
            wasteInformation?.wasteTypes[4]?.pops
              ?.map((p) => p?.concentration)
              ?.join(';') || '',
          fifthWasteTypePopsConcentrationUnitsString:
            wasteInformation?.wasteTypes[4]?.pops
              ?.map((p) => p?.concentrationUnit)
              ?.join(';') || '',
          sixthWasteTypeEwcCode: wasteInformation?.wasteTypes[5]?.ewcCode
            ? `'${wasteInformation?.wasteTypes[5]?.ewcCode}'`
            : '',
          sixthWasteTypeWasteDescription:
            wasteInformation?.wasteTypes[5]?.wasteDescription || '',
          sixthWasteTypePhysicalForm:
            wasteInformation?.wasteTypes[5]?.physicalForm || '',
          sixthWasteTypeWasteQuantity:
            wasteInformation?.wasteTypes[5]?.wasteQuantity?.toString() || '',
          sixthWasteTypeWasteQuantityUnit:
            wasteInformation?.wasteTypes[5]?.quantityUnit || '',
          sixthWasteTypeWasteQuantityType:
            wasteInformation?.wasteTypes[5]?.wasteQuantityType || '',
          sixthWasteTypeChemicalAndBiologicalComponentsString:
            wasteInformation?.wasteTypes[5]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          sixthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteInformation?.wasteTypes[5]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          sixthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteInformation?.wasteTypes[5]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          sixthWasteTypeHasHazardousProperties:
            wasteInformation?.wasteTypes[5]?.hasHazardousProperties?.toString() ||
            '',
          sixthWasteTypeHazardousWasteCodesString:
            wasteInformation?.wasteTypes[5]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          sixthWasteTypeContainsPops:
            wasteInformation?.wasteTypes[5]?.containsPops?.toString() || '',
          sixthWasteTypePopsString:
            wasteInformation?.wasteTypes[5]?.pops
              ?.map((p) => p?.name)
              ?.join(';') || '',
          sixthWasteTypePopsConcentrationsString:
            wasteInformation?.wasteTypes[5]?.pops
              ?.map((p) => p?.concentration)
              ?.join(';') || '',
          sixthWasteTypePopsConcentrationUnitsString:
            wasteInformation?.wasteTypes[5]?.pops
              ?.map((p) => p?.concentrationUnit)
              ?.join(';') || '',
          seventhWasteTypeEwcCode: wasteInformation?.wasteTypes[6]?.ewcCode
            ? `'${wasteInformation?.wasteTypes[6]?.ewcCode}'`
            : '',
          seventhWasteTypeWasteDescription:
            wasteInformation?.wasteTypes[6]?.wasteDescription || '',
          seventhWasteTypePhysicalForm:
            wasteInformation?.wasteTypes[6]?.physicalForm || '',
          seventhWasteTypeWasteQuantity:
            wasteInformation?.wasteTypes[6]?.wasteQuantity?.toString() || '',
          seventhWasteTypeWasteQuantityUnit:
            wasteInformation?.wasteTypes[6]?.quantityUnit || '',
          seventhWasteTypeWasteQuantityType:
            wasteInformation?.wasteTypes[6]?.wasteQuantityType || '',
          seventhWasteTypeChemicalAndBiologicalComponentsString:
            wasteInformation?.wasteTypes[6]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          seventhWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteInformation?.wasteTypes[6]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          seventhWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteInformation?.wasteTypes[6]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          seventhWasteTypeHasHazardousProperties:
            wasteInformation?.wasteTypes[6]?.hasHazardousProperties?.toString() ||
            '',
          seventhWasteTypeHazardousWasteCodesString:
            wasteInformation?.wasteTypes[6]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          seventhWasteTypeContainsPops:
            wasteInformation?.wasteTypes[6]?.containsPops?.toString() || '',
          seventhWasteTypePopsString:
            wasteInformation?.wasteTypes[6]?.pops
              ?.map((p) => p?.name)
              ?.join(';') || '',
          seventhWasteTypePopsConcentrationsString:
            wasteInformation?.wasteTypes[6]?.pops
              ?.map((p) => p?.concentration)
              ?.join(';') || '',
          seventhWasteTypePopsConcentrationUnitsString:
            wasteInformation?.wasteTypes[6]?.pops
              ?.map((p) => p?.concentrationUnit)
              ?.join(';') || '',
          eighthWasteTypeEwcCode: wasteInformation?.wasteTypes[7]?.ewcCode
            ? `'${wasteInformation?.wasteTypes[7]?.ewcCode}'`
            : '',
          eighthWasteTypeWasteDescription:
            wasteInformation?.wasteTypes[7]?.wasteDescription || '',
          eighthWasteTypePhysicalForm:
            wasteInformation?.wasteTypes[7]?.physicalForm || '',
          eighthWasteTypeWasteQuantity:
            wasteInformation?.wasteTypes[7]?.wasteQuantity?.toString() || '',
          eighthWasteTypeWasteQuantityUnit:
            wasteInformation?.wasteTypes[7]?.quantityUnit || '',
          eighthWasteTypeWasteQuantityType:
            wasteInformation?.wasteTypes[7]?.wasteQuantityType || '',
          eighthWasteTypeChemicalAndBiologicalComponentsString:
            wasteInformation?.wasteTypes[7]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          eighthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteInformation?.wasteTypes[7]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          eighthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteInformation?.wasteTypes[7]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          eighthWasteTypeHasHazardousProperties:
            wasteInformation?.wasteTypes[7]?.hasHazardousProperties?.toString() ||
            '',
          eighthWasteTypeHazardousWasteCodesString:
            wasteInformation?.wasteTypes[7]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          eighthWasteTypeContainsPops:
            wasteInformation?.wasteTypes[7]?.containsPops?.toString() || '',
          eighthWasteTypePopsString:
            wasteInformation?.wasteTypes[7]?.pops
              ?.map((p) => p?.name)
              ?.join(';') || '',
          eighthWasteTypePopsConcentrationsString:
            wasteInformation?.wasteTypes[7]?.pops
              ?.map((p) => p?.concentration)
              ?.join(';') || '',
          eighthWasteTypePopsConcentrationUnitsString:
            wasteInformation?.wasteTypes[7]?.pops
              ?.map((p) => p?.concentrationUnit)
              ?.join(';') || '',
          ninthWasteTypeEwcCode: wasteInformation?.wasteTypes[8]?.ewcCode
            ? `'${wasteInformation?.wasteTypes[8]?.ewcCode}'`
            : '',
          ninthWasteTypeWasteDescription:
            wasteInformation?.wasteTypes[8]?.wasteDescription || '',
          ninthWasteTypePhysicalForm:
            wasteInformation?.wasteTypes[8]?.physicalForm || '',
          ninthWasteTypeWasteQuantity:
            wasteInformation?.wasteTypes[8]?.wasteQuantity?.toString() || '',
          ninthWasteTypeWasteQuantityUnit:
            wasteInformation?.wasteTypes[8]?.quantityUnit || '',
          ninthWasteTypeWasteQuantityType:
            wasteInformation?.wasteTypes[8]?.wasteQuantityType || '',
          ninthWasteTypeChemicalAndBiologicalComponentsString:
            wasteInformation?.wasteTypes[8]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          ninthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteInformation?.wasteTypes[8]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          ninthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteInformation?.wasteTypes[8]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          ninthWasteTypeHasHazardousProperties:
            wasteInformation?.wasteTypes[8]?.hasHazardousProperties?.toString() ||
            '',
          ninthWasteTypeHazardousWasteCodesString:
            wasteInformation?.wasteTypes[8]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          ninthWasteTypeContainsPops:
            wasteInformation?.wasteTypes[8]?.containsPops?.toString() || '',
          ninthWasteTypePopsString:
            wasteInformation?.wasteTypes[8]?.pops
              ?.map((p) => p?.name)
              ?.join(';') || '',
          ninthWasteTypePopsConcentrationsString:
            wasteInformation?.wasteTypes[8]?.pops
              ?.map((p) => p?.concentration)
              ?.join(';') || '',
          ninthWasteTypePopsConcentrationUnitsString:
            wasteInformation?.wasteTypes[8]?.pops
              ?.map((p) => p?.concentrationUnit)
              ?.join(';') || '',
          tenthWasteTypeEwcCode: wasteInformation?.wasteTypes[9]?.ewcCode
            ? `'${wasteInformation?.wasteTypes[9]?.ewcCode}'`
            : '',
          tenthWasteTypeWasteDescription:
            wasteInformation?.wasteTypes[9]?.wasteDescription || '',
          tenthWasteTypePhysicalForm:
            wasteInformation?.wasteTypes[9]?.physicalForm || '',
          tenthWasteTypeWasteQuantity:
            wasteInformation?.wasteTypes[9]?.wasteQuantity?.toString() || '',
          tenthWasteTypeWasteQuantityUnit:
            wasteInformation?.wasteTypes[9]?.quantityUnit || '',
          tenthWasteTypeWasteQuantityType:
            wasteInformation?.wasteTypes[9]?.wasteQuantityType || '',
          tenthWasteTypeChemicalAndBiologicalComponentsString:
            wasteInformation?.wasteTypes[9]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.name)
              ?.join(';') || '',
          tenthWasteTypeChemicalAndBiologicalComponentsConcentrationsString:
            wasteInformation?.wasteTypes[9]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentration)
              ?.join(';') || '',
          tenthWasteTypeChemicalAndBiologicalComponentsConcentrationUnitsString:
            wasteInformation?.wasteTypes[9]?.chemicalAndBiologicalComponents
              ?.map((c) => c?.concentrationUnit)
              ?.join(';') || '',
          tenthWasteTypeHasHazardousProperties:
            wasteInformation?.wasteTypes[9]?.hasHazardousProperties?.toString() ||
            '',
          tenthWasteTypeHazardousWasteCodesString:
            wasteInformation?.wasteTypes[9]?.hazardousWasteCodes
              ?.map((h) => h?.code)
              ?.join(';') || '',
          tenthWasteTypeContainsPops:
            wasteInformation?.wasteTypes[9]?.containsPops?.toString() || '',
          tenthWasteTypePopsString:
            wasteInformation?.wasteTypes[9]?.pops
              ?.map((p) => p?.name)
              ?.join(';') || '',
          tenthWasteTypePopsConcentrationsString:
            wasteInformation?.wasteTypes[9]?.pops
              ?.map((p) => p?.concentration)
              ?.join(';') || '',
          tenthWasteTypePopsConcentrationUnitsString:
            wasteInformation?.wasteTypes[9]?.pops
              ?.map((p) => p?.concentrationUnit)
              ?.join(';') || '',
          transactionId: submission?.transactionId,
          carrierConfirmationUniqueReference: '',
          carrierConfirmationCorrectDetails: '',
          carrierConfirmationbrokerRegistrationNumber: '',
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
}
