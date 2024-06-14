import { Response } from '@wts/util/invocation';

export type Method = Readonly<{
  name: string;
}>;

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  townCity: string;
  postcode: string;
  country: string;
}

export interface GetAddressByPostcodeRequest {
  postcode: string;
  buildingNameOrNumber?: string;
}

export type GetAddressByPostcodeResponse = Response<Address[]>;

export const getAddressByPostcode: Method = {
  name: 'getAddressByPostcode',
};
