import { GetCountriesRequest, schema } from '@wts/api/reference-data';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const getCountriesRequest = ajv.compileParser<GetCountriesRequest>(
  schema.getCountriesRequest
);
