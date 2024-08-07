export interface AddressSearchResult {
  text: string;
  value: string;
}

export type ViewType =
  | 'search'
  | 'results'
  | 'noResults'
  | 'manual'
  | 'confirm'
  | 'edit';

export interface FormValues {
  postcode: string;
  buildingNameOrNumber: string;
  addressLine1: string;
  addressLine2: string;
  townCity: string;
  country: string;
  addressSelection?: string | undefined;
}

export interface ContentStrings {
  inputLabel: string;
  inputHint: string;
  buildingNameLabel: string;
  buildingNameHint: string;
  addressLine1Label: string;
  addressLine1Hint: string;
  addressLine2Label: string;
  addressLine2Hint: string;
  townCityLabel: string;
  postcodeLabel: string;
  countryLabel: string;
  button: string;
  buttonSave: string;
  manualLink: string;
  manualLinkShort: string;
  searchAgain: string;
  legend: string;
  buttonSecondary: string;
  notFound: string;
  notFoundPrompt: string;
  addressFound: string;
  addressesFound: string;
  useAddress: string;
  useDifferentAddress: string;
}
