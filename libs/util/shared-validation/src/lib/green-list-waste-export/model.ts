import * as api from '@wts/api/green-list-waste-export';
import * as apiRefData from '@wts/api/reference-data';

export type WasteCode = apiRefData.WasteCode;
export type WasteCodeType = apiRefData.WasteCodeType;
export type Country = apiRefData.Country;
export type RecoveryCode = apiRefData.RecoveryCode;

export type WasteDescription = api.submission.WasteDescription;

export type WasteQuantity = api.submission.WasteQuantity;
export type WasteQuantityData = api.submission.WasteQuantityData;

export type ImporterDetail = api.submission.ImporterDetail;

export type Carrier = api.submission.Carrier;

export type UkExitLocation = api.submission.UkExitLocation;

export type TransitCountry = api.submission.TransitCountry;

export type RecoveryFacilityDetail = api.submission.RecoveryFacilityDetail;
