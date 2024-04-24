export type BulkSubmissionCsvRow = {
  customerReference: string;
  producerOrganisationName: string;
  producerAddressLine1: string;
  producerAddressLine2: string;
  producerTownOrCity: string;
  producerCountry: string;
  producerPostcode: string;
  producerContactName: string;
  producerContactEmail: string;
  producerContactPhoneNumber: string;
  producerSicCode: string;
  wasteCollectionAddressLine1: string;
  wasteCollectionAddressLine2: string;
  wasteCollectionTownOrCity: string;
  wasteCollectionCountry: string;
  wasteCollectionPostcode: string;
  wasteCollectionSource: string;
  brokerRegistrationNumber: string;
  carrierRegistrationNumber: string;
  wasteModeTransport: string;
  wasteExpectedDate: string;
  receiverAuthorisationType: string;
  receiverEnvironmentalPermitNumber: string;
  receiverOrganisationName: string;
  receiverAddressLine1: string;
  receiverAddressLine2: string;
  receiverTownOrCity: string;
  receiverCountry: string;
  receiverPostcode: string;
  receiverContactName: string;
  receiverContactEmail: string;
  receiverContactPhone: string;
  wasteTransportationNumberAndTypeOfContainers: string;
  wasteTransportationSpecialHandlingRequirements: string;
  ewcCode: string;
  wasteDescription: string;
  physicalForm: string;
  wasteQuantity: string;
  quantityUnits: string;
  quantityWaste: string;
  hasHazardousProperties: string;
  containPersistentOrganicPollutants: string;
  hazardousWasteCode: string;
  popDetails: string;
  firstWasteTypeEwcCode: string;
  firstWasteTypeDescription: string;
  firstWasteTypePhysicalForm: string;
  firstWasteTypeQuantity: string;
  firstWasteTypeQuantityUnits: string;
  firstWasteTypeQuantityWaste: string;
  firstWasteTypeHazardousProperties: string;
  firstWasteTypeContainPersistentOrganicPollutants: string;
  firstWasteTypeHazardousWasteCode: string;
  firstWasteTypePopDetails: string;
  secondWasteTypeEwcCode: string;
  secondWasteTypeDescription: string;
  secondWasteTypePhysicalForm: string;
  secondWasteTypeQuantity: string;
  secondWasteTypeQuantityUnits: string;
  secondWasteTypeQuantityWaste: string;
  secondWasteTypeHazardousProperties: string;
  secondWasteTypeContainPersistentOrganicPollutants: string;
  secondWasteTypeHazardousWasteCode: string;
  secondWasteTypePopDetails: string;
  thirdWasteTypeEwcCode: string;
  thirdWasteTypeDescription: string;
  thirdWasteTypePhysicalForm: string;
  thirdWasteTypeQuantity: string;
  thirdWasteTypeQuantityUnits: string;
  thirdWasteTypeQuantityWaste: string;
  thirdWasteTypeHazardousProperties: string;
  thirdWasteTypeContainPersistentOrganicPollutants: string;
  thirdWasteTypeHazardousWasteCode: string;
  thirdWasteTypePopDetails: string;
  fourthWasteTypeEwcCode: string;
  fourthWasteTypeDescription: string;
  fourthWasteTypePhysicalForm: string;
  fourthWasteTypeQuantity: string;
  fourthWasteTypeQuantityUnits: string;
  fourthWasteTypeQuantityWaste: string;
  fourthWasteTypeHazardousProperties: string;
  fourthWasteTypeContainPersistentOrganicPollutants: string;
  fourthWasteTypeHazardousWasteCode: string;
  fourthWasteTypePopDetails: string;
  fifthWasteTypeEwcCode: string;
  fifthWasteTypeDescription: string;
  fifthWasteTypePhysicalForm: string;
  fifthWasteTypeQuantity: string;
  fifthWasteTypeQuantityUnits: string;
  fifthWasteTypeQuantityWaste: string;
  fifthWasteTypeHazardousProperties: string;
  fifthWasteTypeContainPersistentOrganicPollutants: string;
  fifthWasteTypeHazardousWasteCode: string;
  fifthWasteTypePopDetails: string;
  sixthWasteTypeEwcCode: string;
  sixthWasteTypeDescription: string;
  sixthWasteTypePhysicalForm: string;
  sixthWasteTypeQuantity: string;
  sixthWasteTypeQuantityUnits: string;
  sixthWasteTypeQuantityWaste: string;
  sixthWasteTypeHazardousProperties: string;
  sixthWasteTypeContainPersistentOrganicPollutants: string;
  sixthWasteTypeHazardousWasteCode: string;
  sixthWasteTypePopDetails: string;
  seventhWasteTypeEwcCode: string;
  seventhWasteTypeDescription: string;
  seventhWasteTypePhysicalForm: string;
  seventhWasteTypeQuantity: string;
  seventhWasteTypeQuantityUnits: string;
  seventhWasteTypeQuantityWaste: string;
  seventhWasteTypeHazardousProperties: string;
  seventhWasteTypeContainPersistentOrganicPollutants: string;
  seventhWasteTypeHazardousWasteCode: string;
  seventhWasteTypePopDetails: string;
  eighthWasteTypeEwcCode: string;
  eighthWasteTypeDescription: string;
  eighthWasteTypePhysicalForm: string;
  eighthWasteTypeQuantity: string;
  eighthWasteTypeQuantityUnits: string;
  eighthWasteTypeQuantityWaste: string;
  eighthWasteTypeHazardousProperties: string;
  eighthWasteTypeContainPersistentOrganicPollutants: string;
  eighthWasteTypeHazardousWasteCode: string;
  eighthWasteTypePopDetails: string;
  ninthWasteTypeEwcCode: string;
  ninthWasteTypeDescription: string;
  ninthWasteTypePhysicalForm: string;
  ninthWasteTypeQuantity: string;
  ninthWasteTypeQuantityUnits: string;
  ninthWasteTypeQuantityWaste: string;
  ninthWasteTypeHazardousProperties: string;
  ninthWasteTypeContainPersistentOrganicPollutants: string;
  ninthWasteTypeHazardousWasteCode: string;
  ninthWasteTypePopDetails: string;
  tenthWasteTypeEwcCode: string;
  tenthWasteTypeDescription: string;
  tenthWasteTypePhysicalForm: string;
  tenthWasteTypeQuantity: string;
  tenthWasteTypeQuantityUnits: string;
  tenthWasteTypeQuantityWaste: string;
  tenthWasteTypeHazardousProperties: string;
  tenthWasteTypeContainPersistentOrganicPollutants: string;
  tenthWasteTypeHazardousWasteCode: string;
  tenthWasteTypePopDetails: string;
};

export const headersFormatted = [
  'customerReference',
  'producerOrganisationName',
  'producerAddressLine1',
  'producerAddressLine2',
  'producerTownOrCity',
  'producerCountry',
  'producerPostcode',
  'producerContactName',
  'producerContactEmail',
  'producerContactPhoneNumber',
  'producerSicCode',
  'wasteCollectionAddressLine1',
  'wasteCollectionAddressLine2',
  'wasteCollectionTownOrCity',
  'wasteCollectionCountry',
  'wasteCollectionPostcode',
  'wasteCollectionSource',
  'brokerRegistrationNumber',
  'carrierRegistrationNumber',
  'wasteModeTransport',
  'wasteExpectedDate',
  'receiverAuthorisationType',
  'receiverEnvironmentalPermitNumber',
  'receiverOrganisationName',
  'receiverAddressLine1',
  'receiverAddressLine2',
  'receiverTownOrCity',
  'receiverCountry',
  'receiverPostcode',
  'receiverContactName',
  'receiverContactEmail',
  'receiverContactPhone',
  'wasteTransportationNumberAndTypeOfContainers',
  'wasteTransportationSpecialHandlingRequirements',
  'ewcCode',
  'wasteDescription',
  'physicalForm',
  'wasteQuantity',
  'quantityUnits',
  'quantityWaste',
  'hasHazardousProperties',
  'containPersistentOrganicPollutants',
  'hazardousWasteCode',
  'popDetails',
  'firstWasteTypeEwcCode',
  'firstWasteTypeDescription',
  'firstWasteTypePhysicalForm',
  'firstWasteTypeQuantity',
  'firstWasteTypeQuantityUnits',
  'firstWasteTypeQuantityWaste',
  'firstWasteTypeHazardousProperties',
  'firstWasteTypeContainPersistentOrganicPollutants',
  'firstWasteTypeHazardousWasteCode',
  'firstWasteTypePopDetails',
  'secondWasteTypeEwcCode',
  'secondWasteTypeDescription',
  'secondWasteTypePhysicalForm',
  'secondWasteTypeQuantity',
  'secondWasteTypeQuantityUnits',
  'secondWasteTypeQuantityWaste',
  'secondWasteTypeHazardousProperties',
  'secondWasteTypeContainPersistentOrganicPollutants',
  'secondWasteTypeHazardousWasteCode',
  'secondWasteTypePopDetails',
  'thirdWasteTypeEwcCode',
  'thirdWasteTypeDescription',
  'thirdWasteTypePhysicalForm',
  'thirdWasteTypeQuantity',
  'thirdWasteTypeQuantityUnits',
  'thirdWasteTypeQuantityWaste',
  'thirdWasteTypeHazardousProperties',
  'thirdWasteTypeContainPersistentOrganicPollutants',
  'thirdWasteTypeHazardousWasteCode',
  'thirdWasteTypePopDetails',
  'fourthWasteTypeEwcCode',
  'fourthWasteTypeDescription',
  'fourthWasteTypePhysicalForm',
  'fourthWasteTypeQuantity',
  'fourthWasteTypeQuantityUnits',
  'fourthWasteTypeQuantityWaste',
  'fourthWasteTypeHazardousProperties',
  'fourthWasteTypeContainPersistentOrganicPollutants',
  'fourthWasteTypeHazardousWasteCode',
  'fourthWasteTypePopDetails',
  'fifthWasteTypeEwcCode',
  'fifthWasteTypeDescription',
  'fifthWasteTypePhysicalForm',
  'fifthWasteTypeQuantity',
  'fifthWasteTypeQuantityUnits',
  'fifthWasteTypeQuantityWaste',
  'fifthWasteTypeHazardousProperties',
  'fifthWasteTypeContainPersistentOrganicPollutants',
  'fifthWasteTypeHazardousWasteCode',
  'fifthWasteTypePopDetails',
  'sixthWasteTypeEwcCode',
  'sixthWasteTypeDescription',
  'sixthWasteTypePhysicalForm',
  'sixthWasteTypeQuantity',
  'sixthWasteTypeQuantityUnits',
  'sixthWasteTypeQuantityWaste',
  'sixthWasteTypeHazardousProperties',
  'sixthWasteTypeContainPersistentOrganicPollutants',
  'sixthWasteTypeHazardousWasteCode',
  'sixthWasteTypePopDetails',
  'seventhWasteTypeEwcCode',
  'seventhWasteTypeDescription',
  'seventhWasteTypePhysicalForm',
  'seventhWasteTypeQuantity',
  'seventhWasteTypeQuantityUnits',
  'seventhWasteTypeQuantityWaste',
  'seventhWasteTypeHazardousProperties',
  'seventhWasteTypeContainPersistentOrganicPollutants',
  'seventhWasteTypeHazardousWasteCode',
  'seventhWasteTypePopDetails',
  'eighthWasteTypeEwcCode',
  'eighthWasteTypeDescription',
  'eighthWasteTypePhysicalForm',
  'eighthWasteTypeQuantity',
  'eighthWasteTypeQuantityUnits',
  'eighthWasteTypeQuantityWaste',
  'eighthWasteTypeHazardousProperties',
  'eighthWasteTypeContainPersistentOrganicPollutants',
  'eighthWasteTypeHazardousWasteCode',
  'eighthWasteTypePopDetails',
  'ninthWasteTypeEwcCode',
  'ninthWasteTypeDescription',
  'ninthWasteTypePhysicalForm',
  'ninthWasteTypeQuantity',
  'ninthWasteTypeQuantityUnits',
  'ninthWasteTypeQuantityWaste',
  'ninthWasteTypeHazardousProperties',
  'ninthWasteTypeContainPersistentOrganicPollutants',
  'ninthWasteTypeHazardousWasteCode',
  'ninthWasteTypePopDetails',
  'tenthWasteTypeEwcCode',
  'tenthWasteTypeDescription',
  'tenthWasteTypePhysicalForm',
  'tenthWasteTypeQuantity',
  'tenthWasteTypeQuantityUnits',
  'tenthWasteTypeQuantityWaste',
  'tenthWasteTypeHazardousProperties',
  'tenthWasteTypeContainPersistentOrganicPollutants',
  'tenthWasteTypeHazardousWasteCode',
  'tenthWasteTypePopDetails',
];
