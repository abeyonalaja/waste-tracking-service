import { Response } from '@wts/util/invocation';

type Method = Readonly<{
  name: string;
}>;

export interface CheckParticipationRequest {
  dcidSubjectId: string;
  content: 'GLW' | 'UKWM';
}

export type CheckParticipationResponse = Response<
  { participant: false } | { participant: true; participantId: string }
>;

export interface RedeemInvitationRequest {
  dcidSubjectId: string;
  invitationToken: string;
}

export type RedeemInvitationResponse = Response<void>;

export interface AddParticipantRequest {
  dcidSubjectId: string;
  content: 'GLW' | 'UKWM';
}

export type AddParticipantResponse = Response<void>;

export const checkParticipation: Method = {
  name: 'checkParticipation',
};

export const redeemInvitation: Method = {
  name: 'redeemInvitation',
};

export const addParticipant: Method = {
  name: 'addParticipant',
};
