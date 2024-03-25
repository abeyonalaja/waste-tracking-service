import { Method } from '@wts/api/common';
import { Response } from '@wts/util/invocation';

export type PingRequest = {
  message: string;
};

export type PingResponse = Response<{ message: string }>;
export const ping: Method = {
  name: 'ping',
  httpVerb: 'POST',
};
