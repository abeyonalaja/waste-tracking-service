export type CustomerReference = string | undefined;

export type WasteDescriptionData = {
  wasteCode:
    | { type: 'NotApplicable' }
    | {
        type: 'BaselAnnexIX' | 'Oecd' | 'AnnexIIIA' | 'AnnexIIIB';
        value: string;
      };
  ecaCodes: string[];
  nationalCode: { provided: 'Yes'; value: string } | { provided: 'No' };
  description: string;
};

export type WasteDescription =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<WasteDescriptionData>)
  | ({ status: 'Complete' } & WasteDescriptionData);

type NotStartedSection = { status: 'NotStarted' };

export type WasteQuantity = {
  status: 'CannotStart';
};

export type Submission = {
  id: string;
  reference: CustomerReference;
  wasteDescription: WasteDescription;
  wasteQuantity: WasteQuantity;
  exporterDetail: NotStartedSection;
  importerDetail: NotStartedSection;
  collectionDate: NotStartedSection;
  carriers: NotStartedSection;
  ukExitLocation: NotStartedSection;
  transitCountries: NotStartedSection;
  recoveryFacilityDetail: { status: 'CannotStart' };
};

export type ListSubmissionsResponse = Submission[];

export type GetSubmissionResponse = Submission;
export type CreateSubmissionRequest = Pick<Submission, 'reference'>;
export type CreateSubmissionResponse = Submission;

export type PutReferenceRequest = CustomerReference;
export type PutReferenceResponse = CustomerReference;
export type GetReferenceResponse = CustomerReference;

export type PutWasteDescriptionRequest = WasteDescription;
export type PutWasteDescriptionResponse = WasteDescription;
export type GetWasteDescriptionResponse = WasteDescription;
