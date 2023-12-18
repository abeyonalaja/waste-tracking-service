import Ajv from 'ajv/dist/jtd';
import { schema } from '.';
import { UserFilter } from './user-filter';
import { ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';

const ajv = new Ajv();
const validateDcidToken = ajv.compile(schema.dcidToken);

const uuidRegex =
  /^(\{){0,1}[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\}){0,1}$/;
function isValidGuid(value: string): boolean {
  return uuidRegex.test(value);
}

export function validateToken(filter: UserFilter) {
  return function (decoded: object, _: unknown, h: ResponseToolkit) {
    if (!validateDcidToken(decoded)) {
      return { isValid: false };
    }

    if (!filter({ uniqueReference: decoded.uniqueReference })) {
      return { isValid: false, response: h.response().code(403) };
    }

    const organisationId = decoded.relationships[0].split(':')[1];
    if (isValidGuid(organisationId)) {
      return { isValid: true, credentials: { accountId: organisationId } };
    }

    if (isValidGuid(decoded.contactId)) {
      return { isValid: true, credentials: { accountId: decoded.contactId } };
    }

    return { isValid: false };
  };
}
