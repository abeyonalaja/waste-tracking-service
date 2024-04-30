import { AccountIdRequest, OrderRequest } from '@wts/api/common';

export type DbContainerNameKey = 'drafts' | 'submissions' | 'templates';

export type CustomerReference = string;

export type UkAddressDetail = {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  postcode?: string;
  country: string;
};

export type UkContactDetail = {
  organisationName: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  faxNumber?: string;
};

export type UkOrganisationDetail = {
  addressDetail: UkAddressDetail;
  contactDetail: UkContactDetail;
};

export type AddressDetail = {
  organisationName: string;
  address: string;
  country: string;
};

export type ContactDetail = {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  faxNumber?: string;
};

export type OrganisationDetail = {
  addressDetail: AddressDetail;
  contactDetail: ContactDetail;
};

export type OptionalStringInput =
  | { provided: 'Yes'; value: string }
  | { provided: 'No' };

export type PageMetadata = {
  pageNumber: number;
  token: string;
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

export type RecordState =
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

export type RecordStateStatus = RecordState['status'];

export type RecordSummaryPage<T> = {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pages: PageMetadata[];
  values: ReadonlyArray<T>;
};

export type GetRecordsRequest = AccountIdRequest &
  OrderRequest & {
    pageLimit?: number;
    state?: RecordStateStatus[];
    token?: string;
  };
