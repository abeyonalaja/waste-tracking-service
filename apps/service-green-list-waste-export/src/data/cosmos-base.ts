import { v4 as uuidv4 } from 'uuid';
import {
  Carrier,
  DraftCarriers,
  DraftRecoveryFacilityDetail,
  DraftSubmission,
  DraftWasteDescription,
  RecoveryFacility,
  Submission,
  Template,
} from '../model';
import { BaseRepository } from './base-repository';

export type SubmissionData = Submission & { accountId: string };
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
      const carriers: Carrier[] = [];
      for (const c of sourceCarriers.values) {
        const carrier: Carrier = {
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
      const facilities: RecoveryFacility[] = [];
      for (const r of sourceFacilities.values) {
        const facility: RecoveryFacility = {
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
