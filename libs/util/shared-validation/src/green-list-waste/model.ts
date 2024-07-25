import * as api from '@wts/api/green-list-waste-export';
import * as bulkApi from '@wts/api/green-list-waste-export-bulk';

export type CustomerReference = api.submission.Submission['reference'];

export type CustomerReferenceFlattened = bulkApi.CustomerReferenceFlattened;
