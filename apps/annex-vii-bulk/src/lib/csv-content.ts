export type BulkSubmissionCsvRow = {
  reference: string;
  baselAnnexIXCode?: string;
  oedcCode?: string;
  annexIIIACode?: string;
  annexIIIBCode?: string;
  laboratory?: 'yes';
  ewcCodes: string;
  nationalCode?: string;
  wasteDescription: string;
  wasteQuantityTonnes?: number;
  wasteQuantityCubicMetres?: number;
  wasteQuantityKilograms?: number;
  estimatedOrActualWasteQuantity: 'Estimated' | 'Actual';
  shippingDate: string;
  exporterOrganisationName: string;
  exporterAddress: string;
  exporterPostcode: string;
  exporterContactFullname: string;
  exporterContactPhoneNumber: string;
  exporterFaxNumber?: string;
  exporterEmailAddress: string;
  importerOrganisationName: string;
  importerAddress: string;
  importerContactFullname: string;
  importerContactPhoneNumber: string;
  importerFaxNumber?: string;
  importerEmailAddress: string;
  wasteCollectionDate: string;
  estimatedOrActualCollectionDate: 'Estimated' | 'Actual';
  firstCarrierOrganisationName: string;
  firstCarrierAddress: string;
  firstCarrierPostcode: string;
  firstCarrierContactFullname: string;
  firstCarrierContactPhoneNumber: string;
  firstCarrierFaxNumber?: string;
  firstCarrierEmailAddress: string;
  firstCarrierMeansOfTransport:
    | 'road'
    | 'rail'
    | 'sea'
    | 'air'
    | 'inland waterways';
  firstCarrierMeansOfTransportDetails: string;
  secondCarrierOrganisationName: string;
  secondCarrierAddress: string;
  secondCarrierContactFullname: string;
  secondCarrierContactPhoneNumber: string;
  secondCarrierFaxNumber?: string;
  secondCarrierEmailAddress: string;
  secondCarrierMeansOfTransport:
    | 'road'
    | 'rail'
    | 'sea'
    | 'air'
    | 'inland waterways';
  secondCarrierMeansOfTransportDetails: string;
  thirdCarrierOrganisationName: string;
  thirdCarrierAddress: string;
  thirdCarrierContactFullname: string;
  thirdCarrierContactPhoneNumber: string;
  thirdCarrierFaxNumber?: string;
  thirdCarrierEmailAddress: string;
  thirdCarrierMeansOfTransport:
    | 'road'
    | 'rail'
    | 'sea'
    | 'air'
    | 'inland waterways';
  thirdCarrierMeansOfTransportDetails: string;
  fourthCarrierOrganisationName: string;
  fourthCarrierAddress: string;
  fourthCarrierContactFullname: string;
  fourthCarrierContactPhoneNumber: string;
  fourthCarrierFaxNumber?: string;
  fourthCarrierEmailAddress: string;
  fourthCarrierMeansOfTransport:
    | 'road'
    | 'rail'
    | 'sea'
    | 'air'
    | 'inland waterways';
  fourthCarrierMeansOfTransportDetails: string;
  fifthCarrierOrganisationName: string;
  fifthCarrierAddress: string;
  fifthCarrierContactFullname: string;
  fifthCarrierContactPhoneNumber: string;
  fifthCarrierFaxNumber?: string;
  fifthCarrierEmailAddress: string;
  fifthCarrierMeansOfTransport:
    | 'road'
    | 'rail'
    | 'sea'
    | 'air'
    | 'inland waterways';
  fifthCarrierMeansOfTransportDetails: string;
  whereWasteLeavesUk: string;
  transitCountries: string;
  interimSiteOrganisationName: string;
  interimSiteAddress: string;
  interimSiteContactFullname: string;
  interimSiteContactPhoneNumber: string;
  interimSiteFaxNumber?: string;
  interimSiteEmailAddress: string;
  interimSiteRecoveryCode: string;
  laboratoryOrganisationName: string;
  laboratoryAddress: string;
  laboratoryContactFullname: string;
  laboratoryContactPhoneNumber: string;
  laboratoryFaxNumber?: string;
  laboratoryEmailAddress: string;
  laboratoryDisposalCode: string;
  firstRecoveryFacilityOrganisationName: string;
  firstRecoveryFacilityAddress: string;
  firstRecoveryFacilityContactFullname: string;
  firstRecoveryFacilityContactPhoneNumber: string;
  firstRecoveryFacilityFaxNumber?: string;
  firstRecoveryFacilityEmailAddress: string;
  firstRecoveryFacilityRecoveryCode: string;
  secondRecoveryFacilityOrganisationName: string;
  secondRecoveryFacilityAddress: string;
  secondRecoveryFacilityContactFullname: string;
  secondRecoveryFacilityContactPhoneNumber: string;
  secondRecoveryFacilityFaxNumber?: string;
  secondRecoveryFacilityEmailAddress: string;
  secondRecoveryFacilityRecoveryCode: string;
  thirdRecoveryFacilityOrganisationName: string;
  thirdRecoveryFacilityAddress: string;
  thirdRecoveryFacilityContactFullname: string;
  thirdRecoveryFacilityContactPhoneNumber: string;
  thirdRecoveryFacilityFaxNumber?: string;
  thirdRecoveryFacilityEmailAddress: string;
  thirdRecoveryFacilityRecoveryCode: string;
  fourthRecoveryFacilityOrganisationName: string;
  fourthRecoveryFacilityAddress: string;
  fourthRecoveryFacilityContactFullname: string;
  fourthRecoveryFacilityContactPhoneNumber: string;
  fourthRecoveryFacilityFaxNumber?: string;
  fourthRecoveryFacilityEmailAddress: string;
  fourthRecoveryFacilityRecoveryCode: string;
  fifthRecoveryFacilityOrganisationName: string;
  fifthRecoveryFacilityAddress: string;
  fifthRecoveryFacilityContactFullname: string;
  fifthRecoveryFacilityContactPhoneNumber: string;
  fifthRecoveryFacilityFaxNumber?: string;
  fifthRecoveryFacilityEmailAddress: string;
  fifthRecoveryFacilityRecoveryCode: string;
};

export const headersFormatted = [
  'reference',
  'baselAnnexIXCode',
  'oedcCode',
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
  'shippingDate',
  'exporterOrganisationName',
  'exporterAddress',
  'exporterPostcode',
  'exporterContactFullname',
  'exporterContactPhoneNumber',
  'exporterFaxNumber',
  'exporterEmailAddress',
  'importerOrganisationName',
  'importerAddress',
  'importerContactFullname',
  'importerContactPhoneNumber',
  'importerFaxNumber',
  'importerEmailAddress',
  'wasteCollectionDate',
  'estimatedOrActualCollectionDate',
  'firstCarrierOrganisationName',
  'firstCarrierAddress',
  'firstCarrierPostcode',
  'firstCarrierContactFullname',
  'firstCarrierContactPhoneNumber',
  'firstCarrierFaxNumber',
  'firstCarrierEmailAddress',
  'firstCarrierMeansOfTransport',
  'firstCarrierMeansOfTransportDetails',
  'secondCarrierOrganisationName',
  'secondCarrierAddress',
  'secondCarrierContactFullname',
  'secondCarrierContactPhoneNumber',
  'secondCarrierFaxNumber',
  'secondCarrierEmailAddress',
  'secondCarrierMeansOfTransport',
  'secondCarrierMeansOfTransportDetails',
  'thirdCarrierOrganisationName',
  'thirdCarrierAddress',
  'thirdCarrierContactFullname',
  'thirdCarrierContactPhoneNumber',
  'thirdCarrierFaxNumber',
  'thirdCarrierEmailAddress',
  'thirdCarrierMeansOfTransport',
  'thirdCarrierMeansOfTransportDetails',
  'fourthCarrierOrganisationName',
  'fourthCarrierAddress',
  'fourthCarrierContactFullname',
  'fourthCarrierContactPhoneNumber',
  'fourthCarrierFaxNumber',
  'fourthCarrierEmailAddress',
  'fourthCarrierMeansOfTransport',
  'fourthCarrierMeansOfTransportDetails',
  'fifthCarrierOrganisationName',
  'fifthCarrierAddress',
  'fifthCarrierContactFullname',
  'fifthCarrierContactPhoneNumber',
  'fifthCarrierFaxNumber',
  'fifthCarrierEmailAddress',
  'fifthCarrierMeansOfTransport',
  'fifthCarrierMeansOfTransportDetails',
  'whereWasteLeavesUk',
  'transitCountries',
  'interimSiteOrganisationName',
  'interimSiteAddress',
  'interimSiteContactFullname',
  'interimSiteContactPhoneNumber',
  'interimSiteFaxNumber',
  'interimSiteEmailAddress',
  'interimSiteRecoveryCode',
  'laboratoryOrganisationName',
  'laboratoryAddress',
  'laboratoryContactFullname',
  'laboratoryContactPhoneNumber',
  'laboratoryFaxNumber',
  'laboratoryEmailAddress',
  'laboratoryDisposalCode',
  'firstRecoveryFacilityOrganisationName',
  'firstRecoveryFacilityAddress',
  'firstRecoveryFacilityContactFullname',
  'firstRecoveryFacilityContactPhoneNumber',
  'firstRecoveryFacilityFaxNumber',
  'firstRecoveryFacilityEmailAddress',
  'firstRecoveryFacilityRecoveryCode',
  'secondRecoveryFacilityOrganisationName',
  'secondRecoveryFacilityAddress',
  'secondRecoveryFacilityContactFullname',
  'secondRecoveryFacilityContactPhoneNumber',
  'secondRecoveryFacilityFaxNumber',
  'secondRecoveryFacilityEmailAddress',
  'secondRecoveryFacilityRecoveryCode',
  'thirdRecoveryFacilityOrganisationName',
  'thirdRecoveryFacilityAddress',
  'thirdRecoveryFacilityContactFullname',
  'thirdRecoveryFacilityContactPhoneNumber',
  'thirdRecoveryFacilityFaxNumber',
  'thirdRecoveryFacilityEmailAddress',
  'thirdRecoveryFacilityRecoveryCode',
  'fourthRecoveryFacilityOrganisationName',
  'fourthRecoveryFacilityAddress',
  'fourthRecoveryFacilityContactFullname',
  'fourthRecoveryFacilityContactPhoneNumber',
  'fourthRecoveryFacilityFaxNumber',
  'fourthRecoveryFacilityEmailAddress',
  'fourthRecoveryFacilityRecoveryCode',
  'fifthRecoveryFacilityOrganisationName',
  'fifthRecoveryFacilityAddress',
  'fifthRecoveryFacilityContactFullname',
  'fifthRecoveryFacilityContactPhoneNumber',
  'fifthRecoveryFacilityFaxNumber',
  'fifthRecoveryFacilityEmailAddress',
  'fifthRecoveryFacilityRecoveryCode',
];
