export interface Submission {
  id: string;
  reference: string;
  accountName: string;
  wasteDescriptionStatus: SectionStatus;
  wasteDescriptionData: object;
  quantityOfWasteStatus: SectionStatus;
  quantityOfWasteData: object;
  exporterImporterStatus: SectionStatus;
  exporterDetailsStatus: SectionStatus;
  exporterData: object;
  importerDetailsStatus: SectionStatus;
  importerData: object;
  journeyofWasteStatus: SectionStatus;
  collectionDateStatus: SectionStatus;
  collectionDateData: object;
  wasteCarriersStatus: SectionStatus;
  wasteCarriersData: object;
  wasteCollectionDetailsStatus: SectionStatus;
  wasteCollectionDetailsData: object;
  locationWasteLeavesUKStatus: SectionStatus;
  locationWasteLeavesUKStatusData: SectionStatus;
  treatmentOfWasteStatus: SectionStatus;
  recoveryFacilityStatus: SectionStatus;
  recoveryFacilityData: object;
}

export enum SectionStatus {
  CannotStart,
  NotStarted,
  Started,
  Completed,
}
//GET /submissions/{reference}
export interface GetSubmissionByReferenceRequest {
  reference: string;
}

export interface GetSubmissionByIdRequest {
  id: string;
}

export interface GetSubmissionByReferenceResponse {
  results: Submission[];
}

export interface GetSubmissionByIdResponse {
  result: Submission;
}

//PUT /submissions
export interface UpdateSubmissionRequest {
  value: Submission;
}

export interface UpdateSubmissionResponse {
  updated: boolean;
}

//Delete /submissions/{id}
export interface DeleteSubmissionRequest {
  id: string;
}

export interface DeleteSubmissionResponse {
  deleted: boolean;
}
