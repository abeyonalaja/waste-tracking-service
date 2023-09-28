import Boom from '@hapi/boom';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { CosmosAnnexViiClient } from '../clients';
import { DraftSubmission, Template } from '../model';
import { BaseRepository } from './base-repository';
import {
  DraftCarrier,
  DraftCarriers,
  DraftRecoveryFacility,
  DraftRecoveryFacilityDetail,
  SubmissionBase,
} from '@wts/api/annex-vii';

export type DraftSubmissionData = DraftSubmission & { accountId: string };
export type TemplateData = Template & { accountId: string };

export abstract class CosmosBaseRepository implements BaseRepository {
  constructor(
    protected cosmosClient: CosmosAnnexViiClient,
    protected cosmosContainerName: string,
    protected alternateContainerName: string,
    protected logger: Logger
  ) {}

  copyCarriers(sourceCarriers: DraftCarriers): DraftCarriers {
    let targetCarriers: DraftCarriers = {
      status: 'NotStarted',
      transport: true,
    };

    if (sourceCarriers.status !== 'NotStarted') {
      const carriers: DraftCarrier[] = [];
      for (const c of sourceCarriers.values) {
        const carrier: DraftCarrier = {
          id: uuidv4(),
          addressDetails: c.addressDetails,
          contactDetails: c.contactDetails,
        };
        carriers.push(carrier);
      }
      targetCarriers = {
        status: 'Started',
        transport: true,
        values: carriers,
      };
    }

    return targetCarriers;
  }

  copyRecoveryFacilities(
    sourceFacilities: DraftRecoveryFacilityDetail
  ): DraftRecoveryFacilityDetail {
    let targetFacilities: DraftRecoveryFacilityDetail = {
      status: 'NotStarted',
    };

    if (
      sourceFacilities.status === 'Started' ||
      sourceFacilities.status === 'Complete'
    ) {
      const facilities: DraftRecoveryFacility[] = [];
      for (const r of sourceFacilities.values) {
        const facility: DraftRecoveryFacility = {
          id: uuidv4(),
          addressDetails: r.addressDetails,
          contactDetails: r.contactDetails,
          recoveryFacilityType: r.recoveryFacilityType,
        };
        facilities.push(facility);
      }
      targetFacilities = {
        status: sourceFacilities.status,
        values: facilities,
      };
    } else {
      targetFacilities = {
        status: sourceFacilities.status,
      };
    }

    return targetFacilities;
  }

  async createTemplateFromSubmission(
    id: string,
    accountId: string,
    templateName: string,
    templateDescription: string
  ): Promise<Template> {
    const item = await this.cosmosClient.readItem(
      this.alternateContainerName,
      id,
      accountId
    );
    if (!item) {
      throw Boom.notFound();
    }

    const data = item.value as SubmissionBase;
    const template: Template = {
      id: uuidv4(),
      templateDetails: {
        name: templateName,
        description: templateDescription,
        created: new Date(),
        lastModified: new Date(),
      },
      wasteDescription: data.wasteDescription,
      exporterDetail: data.exporterDetail,
      importerDetail: data.importerDetail,
      carriers: this.copyCarriers(data.carriers),
      collectionDetail: data.collectionDetail,
      ukExitLocation: data.ukExitLocation,
      transitCountries: data.transitCountries,
      recoveryFacilityDetail: this.copyRecoveryFacilities(
        data.recoveryFacilityDetail
      ),
    };
    const templateData: TemplateData = { ...template, accountId };

    try {
      await this.cosmosClient.createOrReplaceItem(
        this.cosmosContainerName,
        template.id,
        accountId,
        templateData
      );
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
    return template;
  }

  async createSubmissionFromTemplate(
    id: string,
    accountId: string,
    reference: string
  ): Promise<DraftSubmission> {
    const item = await this.cosmosClient.readItem(
      this.alternateContainerName,
      id,
      accountId
    );
    if (!item) {
      throw Boom.notFound();
    }

    const data = item.value as SubmissionBase;
    const submission: DraftSubmission = {
      id: uuidv4(),
      reference,
      wasteDescription: data.wasteDescription,
      wasteQuantity:
        data.wasteDescription.status === 'NotStarted'
          ? { status: 'CannotStart' }
          : { status: 'NotStarted' },
      exporterDetail: data.exporterDetail,
      importerDetail: data.importerDetail,
      collectionDate: { status: 'NotStarted' },
      carriers: this.copyCarriers(data.carriers),
      collectionDetail: data.collectionDetail,
      ukExitLocation: data.ukExitLocation,
      transitCountries: data.transitCountries,
      recoveryFacilityDetail: this.copyRecoveryFacilities(
        data.recoveryFacilityDetail
      ),
      submissionConfirmation: { status: 'CannotStart' },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    };
    const submissionData: DraftSubmissionData = { ...submission, accountId };

    try {
      await this.cosmosClient.createOrReplaceItem(
        this.cosmosContainerName,
        submission.id,
        accountId,
        submissionData
      );
    } catch (err) {
      this.logger.error('Unknown error thrown from Cosmos client', {
        error: err,
      });
      throw Boom.internal();
    }
    return submission;
  }
}
