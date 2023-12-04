import { jwtDecode } from 'jwt-js-decode';
import Ajv from 'ajv/dist/jtd';
import { DcidToken, schema } from '.';

const ajv = new Ajv();

function isValidGuid(value: string): boolean {
  if (value.length > 0) {
    if (
      !/^(\{){0,1}[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\}){0,1}$/.test(
        value
      )
    ) {
      return false;
    }
    return true;
  }
  return false;
}

export function validateToken(token: string) {
  const { payload } = jwtDecode(token);
  let isValid: boolean = !ajv.compile<DcidToken>(schema.dcidToken)(payload)
    ? false
    : true;

  const decoded = payload as DcidToken;
  const organisationId = decoded.relationships[0].split(':')[1];
  if (
    !isValidGuid(decoded.contactId) ||
    (organisationId && !isValidGuid(organisationId))
  ) {
    isValid = false;
  }
  const credentials = {
    accountId: !organisationId ? decoded.contactId : organisationId,
  };
  const artifacts = {
    contactId: decoded.contactId,
    organisationId: organisationId,
    accountIdReference: !organisationId ? 'contactId' : 'organisationId',
  };

  return { isValid, credentials, artifacts };
}
