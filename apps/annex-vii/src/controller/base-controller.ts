import * as api from '@wts/api/annex-vii';
import { SubmissionBase } from '../model';
import { v4 as uuidv4 } from 'uuid';

export type Handler<Request, Response> = (
  request: Request
) => Promise<Response>;

export type SubmissionBasePlusId = {
  submissionBase: SubmissionBase;
  id: string;
};

export abstract class BaseController {
  protected setBaseWasteDescription(
    submissionBase: api.SubmissionBase,
    value: api.DraftWasteDescription
  ): api.SubmissionBase {
    let recoveryFacilityDetail: SubmissionBase['recoveryFacilityDetail'] =
      submissionBase.recoveryFacilityDetail.status === 'CannotStart' &&
      value.status !== 'NotStarted' &&
      value.wasteCode !== undefined
        ? { status: 'NotStarted' }
        : submissionBase.recoveryFacilityDetail;

    let carriers: SubmissionBase['carriers'] = submissionBase.carriers;

    if (
      submissionBase.wasteDescription.status === 'NotStarted' &&
      value.status !== 'NotStarted' &&
      value.wasteCode?.type === 'NotApplicable'
    ) {
      carriers.transport = false;
    }

    if (
      this.isWasteCodeChangingBulkToSmall(
        submissionBase.wasteDescription,
        value
      )
    ) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      carriers = { status: 'NotStarted', transport: false };

      recoveryFacilityDetail = { status: 'NotStarted' };
    }

    if (
      this.isWasteCodeChangingSmallToBulk(
        submissionBase.wasteDescription,
        value
      )
    ) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      carriers = { status: 'NotStarted', transport: true };

      recoveryFacilityDetail = { status: 'NotStarted' };
    }

    if (
      this.isWasteCodeChangingBulkToBulkDifferentType(
        submissionBase.wasteDescription,
        value
      )
    ) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      carriers = { status: 'NotStarted', transport: true };

      recoveryFacilityDetail = { status: 'NotStarted' };
    }

    if (
      this.isWasteCodeChangingBulkToBulkSameType(
        submissionBase.wasteDescription,
        value
      )
    ) {
      if (value.status === 'Started') {
        value.ewcCodes = undefined;
        value.nationalCode = undefined;
        value.description = undefined;
      }

      if (submissionBase.carriers.status !== 'NotStarted') {
        carriers = {
          status: 'Started',
          transport: true,
          values: submissionBase.carriers.values,
        };
      }

      if (
        submissionBase.recoveryFacilityDetail.status === 'Started' ||
        submissionBase.recoveryFacilityDetail.status === 'Complete'
      ) {
        recoveryFacilityDetail = {
          status: 'Started',
          values: submissionBase.recoveryFacilityDetail.values,
        };
      }
    }

    submissionBase.wasteDescription = value;
    submissionBase.carriers = carriers;
    submissionBase.recoveryFacilityDetail = recoveryFacilityDetail;

    return submissionBase;
  }

  protected setBaseExporterDetail(
    submissionBase: api.SubmissionBase,
    value: api.DraftExporterDetail
  ): api.SubmissionBase {
    submissionBase.exporterDetail = value;

    return submissionBase;
  }

  protected isSmallWaste(wasteDescription: api.DraftWasteDescription): boolean {
    return (
      wasteDescription.status === 'Complete' &&
      wasteDescription.wasteCode.type === 'NotApplicable'
    );
  }

  protected setBaseImporterDetail(
    submissionBase: api.SubmissionBase,
    value: api.DraftImporterDetail
  ): api.SubmissionBase {
    submissionBase.importerDetail = value;

    return submissionBase;
  }

  protected createBaseCarriers(
    submissionBase: api.SubmissionBase,
    value: Omit<api.DraftCarriers, 'transport' | 'values'>
  ): SubmissionBasePlusId {
    const submissionBasePlusId = {
      submissionBase: submissionBase,
      id: uuidv4(),
    };
    const transport: api.DraftCarriers['transport'] =
      submissionBase.wasteDescription.status !== 'NotStarted' &&
      submissionBase.wasteDescription.wasteCode?.type === 'NotApplicable'
        ? false
        : true;

    if (submissionBase.carriers.status === 'NotStarted') {
      submissionBasePlusId.submissionBase.carriers = {
        status: value.status,
        transport: transport,
        values: [{ id: submissionBasePlusId.id }],
      };

      return submissionBasePlusId;
    }

    const carriers: api.DraftCarrier[] = [];
    for (const c of submissionBase.carriers.values) {
      carriers.push(c);
    }
    carriers.push({ id: submissionBasePlusId.id });
    submissionBasePlusId.submissionBase.carriers = {
      status: value.status,
      transport: transport,
      values: carriers,
    };

    return submissionBasePlusId;
  }

  setBaseNoCarriers(
    submissionBase: api.SubmissionBase,
    carrierId: string,
    value: api.DraftCarriers
  ): api.SubmissionBase {
    if (value.status === 'NotStarted') {
      submissionBase.carriers = value;

      return submissionBase;
    }

    return submissionBase;
  }

  setBaseCarriers(
    submissionBase: api.SubmissionBase,
    carrierId: string,
    value: api.DraftCarriers,
    carrier: api.DraftCarrier,
    index: number
  ): api.SubmissionBase {
    if (
      submissionBase !== undefined &&
      submissionBase.carriers.status !== 'NotStarted' &&
      value.status !== 'NotStarted'
    ) {
      submissionBase.carriers.status = value.status;
      submissionBase.carriers.values[index] = carrier as api.DraftCarrier;
    }
    return submissionBase;
  }

  deleteBaseCarriers(
    submissionBase: api.SubmissionBase,
    carrierId: string
  ): api.SubmissionBase {
    if (submissionBase.carriers.status !== 'NotStarted') {
      const index = submissionBase.carriers.values.findIndex((c) => {
        return c.id === carrierId;
      });

      submissionBase.carriers.values.splice(index, 1);
      if (submissionBase.carriers.values.length === 0) {
        const transport: api.DraftCarriers['transport'] =
          submissionBase.wasteDescription.status !== 'NotStarted' &&
          submissionBase.wasteDescription.wasteCode?.type === 'NotApplicable'
            ? false
            : true;

        submissionBase.carriers = {
          status: 'NotStarted',
          transport: transport,
        };
      }
    }

    return submissionBase;
  }

  protected setBaseCollectionDetail(
    submissionBase: api.SubmissionBase,
    value: api.DraftCollectionDetail
  ): api.SubmissionBase {
    submissionBase.collectionDetail = value;

    return submissionBase;
  }

  protected setBaseExitLocation(
    submissionBase: api.SubmissionBase,
    value: api.DraftExitLocation
  ): api.SubmissionBase {
    submissionBase.ukExitLocation = value;

    return submissionBase;
  }

  protected setBaseTransitCountries(
    submissionBase: api.SubmissionBase,
    value: api.DraftTransitCountries
  ): api.SubmissionBase {
    submissionBase.transitCountries = value;

    return submissionBase;
  }

  createBaseRecoveryFacilityDetail(
    submissionBase: api.SubmissionBase,
    value: Omit<api.DraftRecoveryFacilityDetail, 'values'>
  ): SubmissionBasePlusId {
    const submissionBasePlusId = {
      submissionBase: submissionBase,
      id: uuidv4(),
    };
    if (
      submissionBase.recoveryFacilityDetail.status !== 'Started' &&
      submissionBase.recoveryFacilityDetail.status !== 'Complete'
    ) {
      submissionBasePlusId.submissionBase.recoveryFacilityDetail = {
        status: value.status,
        values: [{ id: submissionBasePlusId.id }],
      };

      return submissionBasePlusId;
    }

    const facilities: api.DraftRecoveryFacility[] = [];
    for (const rf of submissionBase.recoveryFacilityDetail.values) {
      facilities.push(rf);
    }
    facilities.push({ id: submissionBasePlusId.id });
    submissionBasePlusId.submissionBase.recoveryFacilityDetail = {
      status: value.status,
      values: facilities,
    };

    return submissionBasePlusId;
  }

  setBaseRecoveryFacilityDetail(
    submissionBase: api.SubmissionBase,
    rfdId: string,
    value: api.DraftRecoveryFacilityDetail
  ): api.SubmissionBase {
    if (submissionBase !== undefined) {
      if (
        submissionBase.recoveryFacilityDetail.status === 'Started' ||
        submissionBase.recoveryFacilityDetail.status === 'Complete'
      ) {
        if (value.status !== 'Started' && value.status !== 'Complete') {
          submissionBase.recoveryFacilityDetail = value;
          return submissionBase;
        }

        const recoveryFacility = value.values.find((rf) => {
          return rf.id === rfdId;
        });

        const index = submissionBase.recoveryFacilityDetail.values.findIndex(
          (rf) => {
            return rf.id === rfdId;
          }
        );
        submissionBase.recoveryFacilityDetail.status = value.status;
        submissionBase.recoveryFacilityDetail.values[index] =
          recoveryFacility as api.DraftRecoveryFacility;
      }
    }

    return submissionBase;
  }

  deleteBaseRecoveryFacilityDetail(
    submissionBase: api.SubmissionBase,
    rfdId: string
  ): api.SubmissionBase {
    if (
      submissionBase.recoveryFacilityDetail.status === 'Started' ||
      submissionBase.recoveryFacilityDetail.status === 'Complete'
    ) {
      const index = submissionBase.recoveryFacilityDetail.values.findIndex(
        (rf) => {
          return rf.id === rfdId;
        }
      );

      if (index !== -1) {
        submissionBase.recoveryFacilityDetail.values.splice(index, 1);
        if (submissionBase.recoveryFacilityDetail.values.length === 0) {
          submissionBase.recoveryFacilityDetail = { status: 'NotStarted' };
        }
      }
    }

    return submissionBase;
  }

  protected isWasteCodeChangingBulkToSmall(
    currentWasteDescription: api.DraftWasteDescription,
    newWasteDescription: api.DraftWasteDescription
  ): boolean {
    return (
      currentWasteDescription.status !== 'NotStarted' &&
      currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
      newWasteDescription.status !== 'NotStarted' &&
      newWasteDescription.wasteCode?.type === 'NotApplicable'
    );
  }

  protected isWasteCodeChangingSmallToBulk(
    currentWasteDescription: api.DraftWasteDescription,
    newWasteDescription: api.DraftWasteDescription
  ): boolean {
    return (
      currentWasteDescription.status !== 'NotStarted' &&
      currentWasteDescription.wasteCode?.type === 'NotApplicable' &&
      newWasteDescription.status !== 'NotStarted' &&
      newWasteDescription.wasteCode?.type !== 'NotApplicable'
    );
  }

  protected isWasteCodeChangingBulkToBulkDifferentType(
    currentWasteDescription: api.DraftWasteDescription,
    newWasteDescription: api.DraftWasteDescription
  ): boolean {
    return (
      currentWasteDescription.status !== 'NotStarted' &&
      currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
      newWasteDescription.status !== 'NotStarted' &&
      newWasteDescription.wasteCode?.type !== 'NotApplicable' &&
      currentWasteDescription.wasteCode?.type !==
        newWasteDescription.wasteCode?.type
    );
  }

  protected isWasteCodeChangingBulkToBulkSameType(
    currentWasteDescription: api.DraftWasteDescription,
    newWasteDescription: api.DraftWasteDescription
  ): boolean {
    return (
      currentWasteDescription.status !== 'NotStarted' &&
      currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
      newWasteDescription.status !== 'NotStarted' &&
      currentWasteDescription.wasteCode?.type ===
        newWasteDescription.wasteCode?.type &&
      currentWasteDescription.wasteCode?.code !==
        newWasteDescription.wasteCode?.code
    );
  }
}
