import { AccountIdRequest, OrderRequest } from './api-definitions';

export type DbContainerNameKey = 'drafts' | 'submissions' | 'templates';

export type CustomerReference = string;

export interface UkAddressDetail {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  postcode?: string;
  country: string;
}

export interface UkContactDetail {
  organisationName: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  faxNumber?: string;
}

export interface UkOrganisationDetail {
  addressDetail: UkAddressDetail;
  contactDetail: UkContactDetail;
}

export interface AddressDetail {
  organisationName: string;
  address: string;
  country: string;
}

export interface ContactDetail {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  faxNumber?: string;
}

export interface OrganisationDetail {
  addressDetail: AddressDetail;
  contactDetail: ContactDetail;
}

export type OptionalStringInput =
  | { provided: 'Yes'; value: string }
  | { provided: 'No' };

export interface PageMetadata {
  pageNumber: number;
  token: string;
}

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

export interface RecordSummaryPage<T> {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pages: PageMetadata[];
  values: ReadonlyArray<T>;
}

export type GetRecordsRequest = AccountIdRequest &
  OrderRequest & {
    pageLimit?: number;
    state?: RecordStateStatus[];
    token?: string;
  };
