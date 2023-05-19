type Header = {
  query: string;
  offset: string;
  totalresults: string;
  format: string;
  dataset: string;
  lr: string;
  maxresults: string;
  matching_totalresults: string;
};

type Address = {
  AddressLine: string;
  SubBuildingName?: string;
  BuildingNumber?: string;
  BuildingName?: string;
  Street: string;
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
};

type Result = {
  Address: Address;
};

type Info = {
  id: string;
  dateTime: string;
  method: string;
  service: string;
  url: string;
  nodeID: string;
  atomID: string;
};

export type GetAddressesResponse =
  | {
      header: Header;
      results: Result[];
      _info: Info;
    }
  | undefined;

type Error = {
  statuscode: string;
  message: string;
};

export type GetAddressesErrorResponse = {
  error: Error;
  _info: Info;
};
