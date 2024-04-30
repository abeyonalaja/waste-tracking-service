import { AccountIdRequest, SectionSummary } from '@wts/api/common';

export type CustomerReference = string;

type EwcCode = { code: string };

export type WasteDescriptionData = {
  wasteCode:
    | { type: 'NotApplicable' }
    | {
        type: 'BaselAnnexIX' | 'OECD' | 'AnnexIIIA' | 'AnnexIIIB';
        code: string;
      };
  ewcCodes: EwcCode[];
  nationalCode?: { provided: 'Yes'; value: string } | { provided: 'No' };
  description: string;
};

export type ExporterDetailData = {
  exporterAddress: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    postcode?: string;
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

export type WasteDescription =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<WasteDescriptionData>)
  | ({ status: 'Complete' } & WasteDescriptionData);

export type ExporterDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<ExporterDetailData>)
  | ({ status: 'Complete' } & ExporterDetailData);

export type ImporterDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<ImporterDetailData>)
  | ({ status: 'Complete' } & ImporterDetailData);

export type CarrierData = {
  addressDetails: {
    organisationName: string;
    address: string;
    country: string;
  };
  contactDetails: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
  transportDetails?: {
    type: 'Road' | 'Air' | 'Sea' | 'Rail' | 'InlandWaterways';
    description?: string;
  };
};

export type CarrierPartial = { id: string } & Partial<CarrierData>;
export type Carrier = { id: string } & CarrierData;

export type Carriers =
  | {
      status: 'NotStarted';
      transport: boolean;
    }
  | {
      status: 'Started';
      transport: boolean;
      values: CarrierPartial[];
    }
  | {
      status: 'Complete';
      transport: boolean;
      values: Carrier[];
    };

export type CollectionDetailData = {
  address: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    postcode?: string;
    country: string;
  };
  contactDetails: {
    organisationName: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
};

export type CollectionDetail =
  | { status: 'NotStarted' }
  | ({ status: 'Started' } & Partial<CollectionDetailData>)
  | ({ status: 'Complete' } & CollectionDetailData);

export type ExitLocationData =
  | { provided: 'Yes'; value: string }
  | { provided: 'No' };

export type ExitLocation =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      exitLocation: ExitLocationData;
    };

export type TransitCountry = string;

export type TransitCountries =
  | { status: 'NotStarted' }
  | {
      status: 'Started' | 'Complete';
      values: TransitCountry[];
    };

export type RecoveryFacilityData = {
  addressDetails: {
    name: string;
    address: string;
    country: string;
  };
  contactDetails: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
  recoveryFacilityType:
    | {
        type: 'Laboratory';
        disposalCode: string;
      }
    | {
        type: 'InterimSite';
        recoveryCode: string;
      }
    | {
        type: 'RecoveryFacility';
        recoveryCode: string;
      };
};

export type RecoveryFacilityPartial = {
  id: string;
} & Partial<RecoveryFacilityData>;
export type RecoveryFacility = { id: string } & RecoveryFacilityData;

export type RecoveryFacilityDetail =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Started';
      values: RecoveryFacilityPartial[];
    }
  | {
      status: 'Complete';
      values: RecoveryFacility[];
    };

export type WTSSummary = Readonly<{
  id: string;
  wasteDescription: WasteDescription;
  exporterDetail: SectionSummary;
  importerDetail: SectionSummary;
  carriers: SectionSummary;
  collectionDetail: SectionSummary;
  ukExitLocation: SectionSummary;
  transitCountries: SectionSummary;
  recoveryFacilityDetail: SectionSummary;
}>;

export type CollectionDateData = {
  type: 'EstimateDate' | 'ActualDate';
  estimateDate: {
    day?: string;
    month?: string;
    year?: string;
  };
  actualDate: {
    day?: string;
    month?: string;
    year?: string;
  };
};

export type CollectionDate =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      value: CollectionDateData;
    };

export type WasteQuantityData = {
  type: 'EstimateData' | 'ActualData';
  estimateData: {
    quantityType?: 'Volume' | 'Weight';
    unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
    value?: number;
  };
  actualData: {
    quantityType?: 'Volume' | 'Weight';
    unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
    value?: number;
  };
};

export type WasteQuantity =
  | { status: 'CannotStart' }
  | { status: 'NotStarted' }
  | {
      status: 'Started';
      value?: {
        type?: 'NotApplicable' | 'EstimateData' | 'ActualData';
        estimateData?: {
          quantityType?: 'Volume' | 'Weight';
          unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
          value?: number;
        };
        actualData?: {
          quantityType?: 'Volume' | 'Weight';
          unit?: 'Tonne' | 'Cubic Metre' | 'Kilogram' | 'Litre';
          value?: number;
        };
      };
    }
  | {
      status: 'Complete';
      value:
        | {
            type: 'NotApplicable';
          }
        | WasteQuantityData;
    };

export type SubmissionConfirmation =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      confirmation: boolean;
    };

export type SubmissionDeclarationData = {
  declarationTimestamp: Date;
  transactionId: string;
};

export type SubmissionDeclaration =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Complete';
      values: SubmissionDeclarationData;
    };

export type CancellationType =
  | {
      type: 'ChangeOfRecoveryFacilityOrLaboratory';
    }
  | {
      type: 'NoLongerExportingWaste';
    }
  | {
      type: 'Other';
      reason: string;
    };

export type DraftSubmissionState =
  | {
      status:
        | 'InProgress'
        | 'Deleted'
        | 'SubmittedWithEstimates'
        | 'SubmittedWithActuals'
        | 'UpdatedWithActuals';
      timestamp: Date;
    }
  | {
      status: 'Cancelled';
      timestamp: Date;
      cancellationType: CancellationType;
    };

export type SubmissionState =
  | {
      status:
        | 'SubmittedWithEstimates'
        | 'SubmittedWithActuals'
        | 'UpdatedWithActuals';
      timestamp: Date;
    }
  | {
      status: 'Cancelled';
      timestamp: Date;
      cancellationType: CancellationType;
    };

export type SubmissionBase = {
  id: string;
  wasteDescription: WasteDescription;
  exporterDetail: ExporterDetail;
  importerDetail: ImporterDetail;
  carriers: Carriers;
  collectionDetail: CollectionDetail;
  ukExitLocation: ExitLocation;
  transitCountries: TransitCountries;
  recoveryFacilityDetail: RecoveryFacilityDetail;
};

export interface DraftSubmission extends SubmissionBase {
  reference: CustomerReference;
  wasteQuantity: WasteQuantity;
  collectionDate: CollectionDate;
  submissionConfirmation: SubmissionConfirmation;
  submissionDeclaration: SubmissionDeclaration;
  submissionState: DraftSubmissionState;
}

export type Submission = {
  id: string;
  reference: CustomerReference;
  wasteDescription: WasteDescriptionData;
  wasteQuantity: WasteQuantityData;
  exporterDetail: ExporterDetailData;
  importerDetail: ImporterDetailData;
  collectionDate: CollectionDateData;
  carriers: CarrierData[];
  collectionDetail: CollectionDetailData;
  ukExitLocation: ExitLocationData;
  transitCountries: TransitCountry[];
  recoveryFacilityDetail: RecoveryFacilityData[];
  submissionDeclaration: SubmissionDeclarationData;
  submissionState: SubmissionState;
};

export type SubmissionSummary = Readonly<{
  id: string;
  reference: CustomerReference;
  wasteDescription: WasteDescription | WasteDescriptionData;
  collectionDate: CollectionDate | CollectionDateData;
  submissionDeclaration: SubmissionDeclaration | SubmissionDeclarationData;
  submissionState: DraftSubmissionState;
}>;

export type PageMetadata = {
  pageNumber: number;
  token: string;
};

export type SubmissionSummaryPage = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pages: PageMetadata[];
  values: ReadonlyArray<SubmissionSummary>;
};

export type NumberOfSubmissions = {
  completedWithActuals: number;
  completedWithEstimates: number;
  incomplete: number;
};

export type PutWasteDescriptionRequest = WasteDescription;
export type PutWasteDescriptionResponse = WasteDescription;
export type GetWasteDescriptionResponse = WasteDescription;
export type PutExporterDetailRequest = ExporterDetail;
export type PutExporterDetailResponse = ExporterDetail;
export type GetExporterDetailResponse = ExporterDetail;
export type PutImporterDetailRequest = ImporterDetail;
export type PutImporterDetailResponse = ImporterDetail;
export type GetImporterDetailResponse = ImporterDetail;

export type ListCarriersResponse = Carriers;
export type CreateCarriersRequest = Omit<Carriers, 'transport' | 'values'>;
export type CreateCarriersResponse = Carriers;
export type GetCarriersResponse = Carriers;
export type SetCarriersRequest = Carriers;
export type SetCarriersResponse = Carriers;
export type PutExitLocationRequest = ExitLocation;
export type PutExitLocationResponse = ExitLocation;
export type GetExitLocationResponse = ExitLocation;
export type PutTransitCountriesRequest = TransitCountries;
export type PutTransitCountriesResponse = TransitCountries;
export type GetTransitCountriesResponse = TransitCountries;

export type SetCollectionDetailRequest = CollectionDetail;
export type SetCollectionDetailResponse = CollectionDetail;
export type GetCollectionDetailResponse = CollectionDetail;
export type ListRecoveryFacilityDetailResponse = RecoveryFacilityDetail;
export type CreateRecoveryFacilityDetailRequest = Omit<
  RecoveryFacilityDetail,
  'values'
>;
export type CreateRecoveryFacilityDetailResponse = RecoveryFacilityDetail;
export type GetRecoveryFacilityDetailResponse = RecoveryFacilityDetail;
export type SetRecoveryFacilityDetailRequest = RecoveryFacilityDetail;
export type SetRecoveryFacilityDetailResponse = RecoveryFacilityDetail;

export type GetNumberOfSubmissionsRequest = AccountIdRequest;
export type GetNumberOfSubmissionsResponse = NumberOfSubmissions;

export type GetSubmissionsResponse = SubmissionSummaryPage;

export type GetSubmissionResponse = DraftSubmission | Submission;
export type CreateSubmissionRequest = Pick<DraftSubmission, 'reference'>;
export type CreateSubmissionResponse = DraftSubmission;

export type PutReferenceRequest = CustomerReference;
export type PutReferenceResponse = CustomerReference;
export type GetReferenceResponse = CustomerReference;

export type PutWasteQuantityRequest = WasteQuantity | WasteQuantityData;
export type PutWasteQuantityResponse = WasteQuantity | WasteQuantityData;
export type GetWasteQuantityResponse = WasteQuantity | WasteQuantityData;
export type PutCollectionDateRequest = CollectionDate | CollectionDateData;
export type PutCollectionDateResponse = CollectionDate | CollectionDateData;
export type GetCollectionDateResponse = CollectionDate | CollectionDateData;

export type PutSubmissionConfirmationRequest = SubmissionConfirmation;
export type PutSubmissionConfirmationResponse = SubmissionConfirmation;
export type GetSubmissionConfirmationResponse = SubmissionConfirmation;
export type PutSubmissionDeclarationRequest = Omit<
  SubmissionDeclaration,
  'values'
>;
export type PutSubmissionDeclarationResponse = SubmissionDeclaration;
export type GetSubmissionDeclarationResponse = SubmissionDeclaration;
export type PutSubmissionCancellationRequest = CancellationType;
export type PutSubmissionCancellationReponse = CancellationType;
