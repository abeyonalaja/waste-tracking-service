import { DraftCarriers, DraftRecoveryFacilityDetail } from '@wts/api/annex-vii';

export interface BaseRepository {
  copyCarriersNoTransport(
    sourceCarriers: DraftCarriers,
    isSmallWaste: boolean
  ): DraftCarriers;
  copyRecoveryFacilities(
    sourceFacilities: DraftRecoveryFacilityDetail
  ): DraftRecoveryFacilityDetail;
}
