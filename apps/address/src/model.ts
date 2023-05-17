import * as api from '@wts/api/address';

import * as dto from './lib/dto';

export type Address = api.Address;
export type GetAddressByPostcodeRequest = api.GetAddressByPostcodeRequest;
export type GetAddressByPostcodeResponse = api.GetAddressByPostcodeResponse;

export type GetAddressesResponse = dto.GetAddressesResponse;
export type GetAddressesErrorResponse = dto.GetAddressesErrorResponse;
