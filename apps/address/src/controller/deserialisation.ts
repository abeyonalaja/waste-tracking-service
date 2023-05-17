import { GetAddressByPostcodeRequest, schema } from '@wts/api/address';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const getAddressByPostcodeRequest =
  ajv.compileParser<GetAddressByPostcodeRequest>(
    schema.getAddressByPostcodeRequest
  );
