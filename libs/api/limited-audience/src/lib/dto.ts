import { Response } from '@wts/util/invocation';

type Method = Readonly<{
  name: string;
  httpVerb: 'GET' | 'PUT' | 'POST' | 'DELETE';
}>;

export type CheckParticipationRequest = {
  dcidSubjectId: string;
  content: 'GLW' | 'UKWM';
};

export type CheckParticipationResponse = Response<
  { participant: false } | { participant: true; participantId: string }
>;

export type RedeemInvitationRequest = {
  dcidSubjectId: string;
  invitationToken: string;
};

export type RedeemInvitationResponse = Response<void>;

export const checkParticipation: Method = {
  name: 'checkParticipation',
  httpVerb: 'POST',
};

export const redeemInvitation: Method = {
  name: 'redeemInvitation',
  httpVerb: 'POST',
};
