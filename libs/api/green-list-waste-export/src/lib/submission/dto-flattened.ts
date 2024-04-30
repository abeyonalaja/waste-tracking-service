import { AccountIdRequest, Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';
import { ValidationResult } from '../validation';

export type CustomerReferenceFlattened = {
  reference: string;
};

export type WasteDescriptionFlattened = {
  baselAnnexIXCode: string;
  oecdCode: string;
  annexIIIACode: string;
  annexIIIBCode: string;
  laboratory: string;
  ewcCodes: string;
  nationalCode: string;
  wasteDescription: string;
};

export type WasteQuantityFlattened = {
  wasteQuantityTonnes: string;
  wasteQuantityCubicMetres: string;
  wasteQuantityKilograms: string;
  estimatedOrActualWasteQuantity: string;
};

export type ExporterDetailFlattened = {
  exporterOrganisationName: string;
  exporterAddressLine1: string;
  exporterAddressLine2: string;
  exporterTownOrCity: string;
  exporterCountry: string;
  exporterPostcode: string;
  exporterContactFullName: string;
  exporterContactPhoneNumber: string;
  exporterFaxNumber: string;
  exporterEmailAddress: string;
};

export type ImporterDetailFlattened = {
  importerOrganisationName: string;
  importerAddress: string;
  importerCountry: string;
  importerContactFullName: string;
  importerContactPhoneNumber: string;
  importerFaxNumber: string;
  importerEmailAddress: string;
};

export type CollectionDateFlattened = {
  wasteCollectionDate: string;
  estimatedOrActualCollectionDate: string;
};

export type CarriersFlattened = {
  firstCarrierOrganisationName: string;
  firstCarrierAddress: string;
  firstCarrierCountry: string;
  firstCarrierContactFullName: string;
  firstCarrierContactPhoneNumber: string;
  firstCarrierFaxNumber: string;
  firstCarrierEmailAddress: string;
  firstCarrierMeansOfTransport: string;
  firstCarrierMeansOfTransportDetails: string;
  secondCarrierOrganisationName: string;
  secondCarrierAddress: string;
  secondCarrierCountry: string;
  secondCarrierContactFullName: string;
  secondCarrierContactPhoneNumber: string;
  secondCarrierFaxNumber: string;
  secondCarrierEmailAddress: string;
  secondCarrierMeansOfTransport: string;
  secondCarrierMeansOfTransportDetails: string;
  thirdCarrierOrganisationName: string;
  thirdCarrierAddress: string;
  thirdCarrierCountry: string;
  thirdCarrierContactFullName: string;
  thirdCarrierContactPhoneNumber: string;
  thirdCarrierFaxNumber: string;
  thirdCarrierEmailAddress: string;
  thirdCarrierMeansOfTransport: string;
  thirdCarrierMeansOfTransportDetails: string;
  fourthCarrierOrganisationName: string;
  fourthCarrierAddress: string;
  fourthCarrierCountry: string;
  fourthCarrierContactFullName: string;
  fourthCarrierContactPhoneNumber: string;
  fourthCarrierFaxNumber: string;
  fourthCarrierEmailAddress: string;
  fourthCarrierMeansOfTransport: string;
  fourthCarrierMeansOfTransportDetails: string;
  fifthCarrierOrganisationName: string;
  fifthCarrierAddress: string;
  fifthCarrierCountry: string;
  fifthCarrierContactFullName: string;
  fifthCarrierContactPhoneNumber: string;
  fifthCarrierFaxNumber: string;
  fifthCarrierEmailAddress: string;
  fifthCarrierMeansOfTransport: string;
  fifthCarrierMeansOfTransportDetails: string;
};

export type CollectionDetailFlattened = {
  wasteCollectionOrganisationName: string;
  wasteCollectionAddressLine1: string;
  wasteCollectionAddressLine2: string;
  wasteCollectionTownOrCity: string;
  wasteCollectionCountry: string;
  wasteCollectionPostcode: string;
  wasteCollectionContactFullName: string;
  wasteCollectionContactPhoneNumber: string;
  wasteCollectionFaxNumber: string;
  wasteCollectionEmailAddress: string;
};

export type ExitLocationFlattened = {
  whereWasteLeavesUk: string;
};

export type TransitCountriesFlattened = {
  transitCountries: string;
};

export type RecoveryFacilityDetailFlattened = {
  interimSiteOrganisationName: string;
  interimSiteAddress: string;
  interimSiteCountry: string;
  interimSiteContactFullName: string;
  interimSiteContactPhoneNumber: string;
  interimSiteFaxNumber: string;
  interimSiteEmailAddress: string;
  interimSiteRecoveryCode: string;
  laboratoryOrganisationName: string;
  laboratoryAddress: string;
  laboratoryCountry: string;
  laboratoryContactFullName: string;
  laboratoryContactPhoneNumber: string;
  laboratoryFaxNumber: string;
  laboratoryEmailAddress: string;
  laboratoryDisposalCode: string;
  firstRecoveryFacilityOrganisationName: string;
  firstRecoveryFacilityAddress: string;
  firstRecoveryFacilityCountry: string;
  firstRecoveryFacilityContactFullName: string;
  firstRecoveryFacilityContactPhoneNumber: string;
  firstRecoveryFacilityFaxNumber: string;
  firstRecoveryFacilityEmailAddress: string;
  firstRecoveryFacilityRecoveryCode: string;
  secondRecoveryFacilityOrganisationName: string;
  secondRecoveryFacilityAddress: string;
  secondRecoveryFacilityCountry: string;
  secondRecoveryFacilityContactFullName: string;
  secondRecoveryFacilityContactPhoneNumber: string;
  secondRecoveryFacilityFaxNumber: string;
  secondRecoveryFacilityEmailAddress: string;
  secondRecoveryFacilityRecoveryCode: string;
  thirdRecoveryFacilityOrganisationName: string;
  thirdRecoveryFacilityAddress: string;
  thirdRecoveryFacilityCountry: string;
  thirdRecoveryFacilityContactFullName: string;
  thirdRecoveryFacilityContactPhoneNumber: string;
  thirdRecoveryFacilityFaxNumber: string;
  thirdRecoveryFacilityEmailAddress: string;
  thirdRecoveryFacilityRecoveryCode: string;
  fourthRecoveryFacilityOrganisationName: string;
  fourthRecoveryFacilityAddress: string;
  fourthRecoveryFacilityCountry: string;
  fourthRecoveryFacilityContactFullName: string;
  fourthRecoveryFacilityContactPhoneNumber: string;
  fourthRecoveryFacilityFaxNumber: string;
  fourthRecoveryFacilityEmailAddress: string;
  fourthRecoveryFacilityRecoveryCode: string;
  fifthRecoveryFacilityOrganisationName: string;
  fifthRecoveryFacilityAddress: string;
  fifthRecoveryFacilityCountry: string;
  fifthRecoveryFacilityContactFullName: string;
  fifthRecoveryFacilityContactPhoneNumber: string;
  fifthRecoveryFacilityFaxNumber: string;
  fifthRecoveryFacilityEmailAddress: string;
  fifthRecoveryFacilityRecoveryCode: string;
};

export type SubmissionFlattened = CustomerReferenceFlattened &
  WasteDescriptionFlattened &
  WasteQuantityFlattened &
  ExporterDetailFlattened &
  ImporterDetailFlattened &
  CollectionDateFlattened &
  CarriersFlattened &
  CollectionDetailFlattened &
  ExitLocationFlattened &
  TransitCountriesFlattened &
  RecoveryFacilityDetailFlattened;

export type ValidateSubmissionsRequest = AccountIdRequest & {
  padIndex: number;
  values: SubmissionFlattened[];
};
export type ValidateSubmissionsResponse = Response<ValidationResult>;
export const validateSubmissions: Method = {
  name: 'validateSubmissions',
  httpVerb: 'POST',
};
