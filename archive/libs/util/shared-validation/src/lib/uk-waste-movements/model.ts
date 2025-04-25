import * as api from '@wts/api/uk-waste-movements';
import * as refDataApi from '@wts/api/reference-data';
import * as bulkApi from '@wts/api/uk-waste-movements-bulk';

export type ProducerDetail = api.ProducerDetail;

export type ProducerDetailFlattened = bulkApi.ProducerDetailFlattened;

export type Contact = api.Contact;

export type Address = api.Address;

export type SICCode = refDataApi.SICCode;
