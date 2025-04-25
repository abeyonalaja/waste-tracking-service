export interface BulkSubmissionCsvRow {
  reference: string;
  baselAnnexIXCode: string;
  oecdCode: string;
  annexIIIACode: string;
  annexIIIBCode: string;
  laboratory: string;
  ewcCodes: string;
  nationalCode: string;
  wasteDescription: string;
  wasteQuantityTonnes: string;
  wasteQuantityCubicMetres: string;
  wasteQuantityKilograms: string;
  estimatedOrActualWasteQuantity: string;
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
  importerOrganisationName: string;
  importerAddress: string;
  importerCountry: string;
  importerContactFullName: string;
  importerContactPhoneNumber: string;
  importerFaxNumber: string;
  importerEmailAddress: string;
  wasteCollectionDate: string;
  estimatedOrActualCollectionDate: string;
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
  whereWasteLeavesUk: string;
  transitCountries: string;
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
}

export const headersFormatted = [
  'reference',
  'baselAnnexIXCode',
  'oecdCode',
  'annexIIIACode',
  'annexIIIBCode',
  'laboratory',
  'ewcCodes',
  'nationalCode',
  'wasteDescription',
  'wasteQuantityTonnes',
  'wasteQuantityCubicMetres',
  'wasteQuantityKilograms',
  'estimatedOrActualWasteQuantity',
  'exporterOrganisationName',
  'exporterAddressLine1',
  'exporterAddressLine2',
  'exporterTownOrCity',
  'exporterCountry',
  'exporterPostcode',
  'exporterContactFullName',
  'exporterContactPhoneNumber',
  'exporterFaxNumber',
  'exporterEmailAddress',
  'importerOrganisationName',
  'importerAddress',
  'importerCountry',
  'importerContactFullName',
  'importerContactPhoneNumber',
  'importerFaxNumber',
  'importerEmailAddress',
  'wasteCollectionDate',
  'estimatedOrActualCollectionDate',
  'firstCarrierOrganisationName',
  'firstCarrierAddress',
  'firstCarrierCountry',
  'firstCarrierContactFullName',
  'firstCarrierContactPhoneNumber',
  'firstCarrierFaxNumber',
  'firstCarrierEmailAddress',
  'firstCarrierMeansOfTransport',
  'firstCarrierMeansOfTransportDetails',
  'secondCarrierOrganisationName',
  'secondCarrierAddress',
  'secondCarrierCountry',
  'secondCarrierContactFullName',
  'secondCarrierContactPhoneNumber',
  'secondCarrierFaxNumber',
  'secondCarrierEmailAddress',
  'secondCarrierMeansOfTransport',
  'secondCarrierMeansOfTransportDetails',
  'thirdCarrierOrganisationName',
  'thirdCarrierAddress',
  'thirdCarrierCountry',
  'thirdCarrierContactFullName',
  'thirdCarrierContactPhoneNumber',
  'thirdCarrierFaxNumber',
  'thirdCarrierEmailAddress',
  'thirdCarrierMeansOfTransport',
  'thirdCarrierMeansOfTransportDetails',
  'fourthCarrierOrganisationName',
  'fourthCarrierAddress',
  'fourthCarrierCountry',
  'fourthCarrierContactFullName',
  'fourthCarrierContactPhoneNumber',
  'fourthCarrierFaxNumber',
  'fourthCarrierEmailAddress',
  'fourthCarrierMeansOfTransport',
  'fourthCarrierMeansOfTransportDetails',
  'fifthCarrierOrganisationName',
  'fifthCarrierAddress',
  'fifthCarrierCountry',
  'fifthCarrierContactFullName',
  'fifthCarrierContactPhoneNumber',
  'fifthCarrierFaxNumber',
  'fifthCarrierEmailAddress',
  'fifthCarrierMeansOfTransport',
  'fifthCarrierMeansOfTransportDetails',
  'wasteCollectionOrganisationName',
  'wasteCollectionAddressLine1',
  'wasteCollectionAddressLine2',
  'wasteCollectionTownOrCity',
  'wasteCollectionCountry',
  'wasteCollectionPostcode',
  'wasteCollectionContactFullName',
  'wasteCollectionContactPhoneNumber',
  'wasteCollectionFaxNumber',
  'wasteCollectionEmailAddress',
  'whereWasteLeavesUk',
  'transitCountries',
  'interimSiteOrganisationName',
  'interimSiteAddress',
  'interimSiteCountry',
  'interimSiteContactFullName',
  'interimSiteContactPhoneNumber',
  'interimSiteFaxNumber',
  'interimSiteEmailAddress',
  'interimSiteRecoveryCode',
  'laboratoryOrganisationName',
  'laboratoryAddress',
  'laboratoryCountry',
  'laboratoryContactFullName',
  'laboratoryContactPhoneNumber',
  'laboratoryFaxNumber',
  'laboratoryEmailAddress',
  'laboratoryDisposalCode',
  'firstRecoveryFacilityOrganisationName',
  'firstRecoveryFacilityAddress',
  'firstRecoveryFacilityCountry',
  'firstRecoveryFacilityContactFullName',
  'firstRecoveryFacilityContactPhoneNumber',
  'firstRecoveryFacilityFaxNumber',
  'firstRecoveryFacilityEmailAddress',
  'firstRecoveryFacilityRecoveryCode',
  'secondRecoveryFacilityOrganisationName',
  'secondRecoveryFacilityAddress',
  'secondRecoveryFacilityCountry',
  'secondRecoveryFacilityContactFullName',
  'secondRecoveryFacilityContactPhoneNumber',
  'secondRecoveryFacilityFaxNumber',
  'secondRecoveryFacilityEmailAddress',
  'secondRecoveryFacilityRecoveryCode',
  'thirdRecoveryFacilityOrganisationName',
  'thirdRecoveryFacilityAddress',
  'thirdRecoveryFacilityCountry',
  'thirdRecoveryFacilityContactFullName',
  'thirdRecoveryFacilityContactPhoneNumber',
  'thirdRecoveryFacilityFaxNumber',
  'thirdRecoveryFacilityEmailAddress',
  'thirdRecoveryFacilityRecoveryCode',
  'fourthRecoveryFacilityOrganisationName',
  'fourthRecoveryFacilityAddress',
  'fourthRecoveryFacilityCountry',
  'fourthRecoveryFacilityContactFullName',
  'fourthRecoveryFacilityContactPhoneNumber',
  'fourthRecoveryFacilityFaxNumber',
  'fourthRecoveryFacilityEmailAddress',
  'fourthRecoveryFacilityRecoveryCode',
  'fifthRecoveryFacilityOrganisationName',
  'fifthRecoveryFacilityAddress',
  'fifthRecoveryFacilityCountry',
  'fifthRecoveryFacilityContactFullName',
  'fifthRecoveryFacilityContactPhoneNumber',
  'fifthRecoveryFacilityFaxNumber',
  'fifthRecoveryFacilityEmailAddress',
  'fifthRecoveryFacilityRecoveryCode',
];
