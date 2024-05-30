import { schema } from '@wts/api/limited-audience';
import Ajv from 'ajv/dist/jtd';

const ajv = new Ajv();

export const checkParticipationRequest = ajv.compileParser(
  schema.checkParticipationRequest,
);

export const redeemInvitationRequest = ajv.compileParser(
  schema.redeemInvitationRequest,
);

export const addParticipantRequest = ajv.compileParser(
  schema.addParticipantRequest,
);
