export type CustomerReference = string | null;

export type WasteDescriptionData = {
  wasteCode:
    | { type: 'NotApplicable' }
    | {
        type: 'BaselAnnexIX' | 'Oecd' | 'AnnexIIIA' | 'AnnexIIIB';
        value: string;
      };
  ewcCodes: string[];
  nationalCode: { provided: 'Yes'; value: string } | { provided: 'No' };
  description: string;
};

export type ExporterDetailData = {
  exporterAddress: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    postcode: string;
    country: string;
  };
  exporterContactDetails: {
    organisationName: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
};

export type ImporterDetailData = {
  importerAddressDetails: {
    organisationName: string;
    address: string;
    country: string;
  };
  importerContactDetails: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
};

export type CollectionDate =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: {
        type: 'EstimateDate' | 'ActualDate';
        day: string;
        month: string;
        year: string;
      };
    };

export type WasteDescription =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<WasteDescriptionData>)
  | ({ status: 'Complete' } & WasteDescriptionData);

export type RecoveryFacilityDetail =
  | { status: 'CannotStart' }
  | { status: 'NotStarted' };

type NotStartedSection = { status: 'NotStarted' };

export type WasteQuantity =
  | { status: 'CannotStart' }
  | { status: 'NotStarted' }
  | {
      status: 'Started';
      value?: {
        type?: 'NotApplicable' | 'EstimateData' | 'ActualData';
        quantityType?: 'Volume' | 'Weight';
        value?: number;
      };
    }
  | {
      status: 'Complete';
      value:
        | {
            type: 'NotApplicable';
          }
        | {
            type: 'EstimateData' | 'ActualData';
            quantityType: 'Volume' | 'Weight';
            value: number;
          };
    };

export type ExporterDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<ExporterDetailData>)
  | ({ status: 'Complete' } & ExporterDetailData);

export type ImporterDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<ImporterDetailData>)
  | ({ status: 'Complete' } & ImporterDetailData);

export type Submission = {
  id: string;
  reference: CustomerReference;
  wasteDescription: WasteDescription;
  wasteQuantity: WasteQuantity;
  exporterDetail: ExporterDetail;
  importerDetail: ImporterDetail;
  collectionDate: CollectionDate;
  carriers: NotStartedSection;
  collectionDetail: NotStartedSection;
  ukExitLocation: NotStartedSection;
  transitCountries: NotStartedSection;
  recoveryFacilityDetail: RecoveryFacilityDetail;
};

export type GetSubmissionResponse = Submission;
export type CreateSubmissionRequest = Pick<Submission, 'reference'>;
export type CreateSubmissionResponse = Submission;

export type PutReferenceRequest = CustomerReference;
export type PutReferenceResponse = CustomerReference;
export type GetReferenceResponse = CustomerReference;

export type PutWasteDescriptionRequest = WasteDescription;
export type PutWasteDescriptionResponse = WasteDescription;
export type GetWasteDescriptionResponse = WasteDescription;
export type PutWasteQuantityRequest = WasteQuantity;
export type PutWasteQuantityResponse = WasteQuantity;
export type GetWasteQuantityResponse = WasteQuantity;
export type PutExporterDetailRequest = ExporterDetail;
export type PutExporterDetailResponse = ExporterDetail;
export type GetExporterDetailResponse = ExporterDetail;
export type PutImporterDetailRequest = ImporterDetail;
export type PutImporterDetailResponse = ImporterDetail;
export type GetImporterDetailResponse = ImporterDetail;
export type PutCollectionDateRequest = CollectionDate;
export type PutCollectionDateResponse = CollectionDate;
export type GetCollectionDateResponse = CollectionDate;
