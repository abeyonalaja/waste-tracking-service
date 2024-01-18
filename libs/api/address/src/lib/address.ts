import { Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';

export type Address = {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  postcode: string;
  country: string;
};

export type GetAddressByPostcodeRequest = {
  postcode: string;
  buildingNameOrNumber?: string;
};

export type GetAddressByPostcodeResponse = Response<Address[]>;

export const getAddressByPostcode: Method = {
  name: 'getAddressByPostcode',
  httpVerb: 'GET',
};
