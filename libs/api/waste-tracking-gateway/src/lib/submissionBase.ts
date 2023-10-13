export type SectionSummary = {
  status: 'CannotStart' | 'NotStarted' | 'Started' | 'Complete';
};

export type WasteDescriptionData = {
  wasteCode:
    | { type: 'NotApplicable' }
    | {
        type: 'BaselAnnexIX' | 'Oecd' | 'AnnexIIIA' | 'AnnexIIIB';
        value: string;
      };
  ewcCodes: object[];
  nationalCode: { provided: 'Yes'; value: string } | { provided: 'No' };
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
  addressDetails?: {
    organisationName: string;
    address: string;
    country: string;
  };
  contactDetails?: {
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

export type Carrier = { id: string } & CarrierData;

export type Carriers =
  | {
      status: 'NotStarted';
      transport: boolean;
    }
  | {
      status: 'Started' | 'Complete';
      transport: boolean;
      values: Carrier[];
    };

export type CollectionDetailData = {
  address: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    postcode: string;
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

export type ExitLocation =
  | { status: 'NotStarted' }
  | {
      status: 'Complete';
      exitLocation: { provided: 'Yes'; value: string } | { provided: 'No' };
    };

export type TransitCountries =
  | { status: 'NotStarted' }
  | {
      status: 'Started' | 'Complete';
      values: string[];
    };

export type RecoveryFacilityData = {
  addressDetails?: {
    name: string;
    address: string;
    country: string;
  };
  contactDetails?: {
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    faxNumber?: string;
  };
  recoveryFacilityType?:
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

export type RecoveryFacility = { id: string } & RecoveryFacilityData;

export type RecoveryFacilityDetail =
  | { status: 'CannotStart' | 'NotStarted' }
  | {
      status: 'Started' | 'Complete';
      values: RecoveryFacility[];
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
