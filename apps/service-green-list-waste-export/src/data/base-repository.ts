import { DraftCarriers, DraftRecoveryFacilityDetail } from '../model';

export interface BaseRepository {
  copyCarriersNoTransport(
    sourceCarriers: DraftCarriers,
    isSmallWaste: boolean
  ): DraftCarriers;
  copyRecoveryFacilities(
    sourceFacilities: DraftRecoveryFacilityDetail
  ): DraftRecoveryFacilityDetail;
}
