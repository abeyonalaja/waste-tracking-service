export interface Submission {
  id: string;
  ownReference: string;
  reference: string;
  aboutTheWasteStatus?: number;
  wasteDescriptionStatus?: number;
  wasteDescriptionData?: object;
  quantityOfWasteStatus?: number;
  quantityOfWasteData?: object;
  exporterImporterStatus?: number;
  exporterDetailsStatus?: number;
  exporterData?: object;
  importerDetailsStatus?: number;
  importerData?: object;
  journeyofWasteStatus?: number;
  collectionDateStatus?: number;
  collectionDateData?: object;
  wasteCarriersStatus?: number;
  wasteCarriersData?: object;
  wasteCollectionDetailsStatus?: number;
  wasteCollectionDetailsData?: object;
  locationWasteLeavesUKStatus?: number;
  locationWasteLeavesUKStatusData?: object;
  treatmentOfWasteStatus?: number;
  recoveryFacilityStatus?: number;
  recoveryFacilityData?: object;
}
