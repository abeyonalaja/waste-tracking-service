interface Header {
  query: string;
  offset: string;
  totalresults: string;
  format: string;
  dataset: string;
  lr: string;
  maxresults: string;
  matching_totalresults: string;
}

interface Address {
  AddressLine: string;
  SubBuildingName?: string;
  BuildingNumber?: string;
  BuildingName?: string;
  Street?: string;
  Locality?: string;
  Town: string;
  County: string;
  Postcode: string;
  Country: string;
  XCoordinate: number;
  YCoordinate: number;
  UPRN: string;
  Match: string;
  MatchDescription: string;
  Language: string;
}

interface Result {
  Address: Address;
}

interface Info {
  id: string;
  dateTime: string;
  method: string;
  service: string;
  url: string;
  nodeID: string;
  atomID: string;
}

export type GetAddressesResponse =
  | {
      header: Header;
      results: Result[];
      _info: Info;
    }
  | undefined;

interface Error {
  statuscode: string;
  message: string;
}

export interface GetAddressesErrorResponse {
  error: Error;
  _info: Info;
}
