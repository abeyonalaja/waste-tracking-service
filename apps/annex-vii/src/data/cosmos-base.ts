import { v4 as uuidv4 } from 'uuid';
import { DraftSubmission, Template } from '../model';
import { BaseRepository } from './base-repository';
import {
  DraftCarrier,
  DraftCarriers,
  DraftRecoveryFacility,
  DraftRecoveryFacilityDetail,
  DraftWasteDescription,
} from '@wts/api/annex-vii';

export type DraftSubmissionData = DraftSubmission & { accountId: string };
export type TemplateData = Template & { accountId: string };

export abstract class CosmosBaseRepository implements BaseRepository {
  protected isSmallWaste(wasteDescription: DraftWasteDescription): boolean {
    return (
      wasteDescription.status === 'Complete' &&
      wasteDescription.wasteCode.type === 'NotApplicable'
    );
  }

  copyCarriersNoTransport(
    sourceCarriers: DraftCarriers,
    isSmallWaste: boolean
  ): DraftCarriers {
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
        status: isSmallWaste ? sourceCarriers.status : 'Started',
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
}
