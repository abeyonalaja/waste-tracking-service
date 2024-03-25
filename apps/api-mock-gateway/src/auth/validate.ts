import Ajv from 'ajv/dist/jtd';
import { schema } from '.';
import { UserFilter } from './user-filter';
import { JwtPayload } from 'jsonwebtoken';

const ajv = new Ajv();
const validateDcidToken = ajv.compile(schema.dcidToken);

const uuidRegex =
  /^(\{){0,1}[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(\}){0,1}$/;
function isValidGuid(value: string): boolean {
  return uuidRegex.test(value);
}

export function validateToken(filter: UserFilter) {
  return async function (jwtPayload: JwtPayload) {
    const decoded = jwtPayload;
    if (!validateDcidToken(decoded)) {
      return false;
    }
    if (
      !(await filter({
        uniqueReference: decoded.uniqueReference,
        dcidSubjectId: decoded.sub,
      }))
    ) {
      return { isValid: false };
    }

    const organisationId = decoded.relationships[0].split(':')[1];
    if (isValidGuid(organisationId)) {
      return {
        isValid: true,
        credentials: { accountId: organisationId, subjectId: decoded.sub },
      };
    }
    if (isValidGuid(decoded.contactId)) {
      return {
        isValid: true,
        credentials: { accountId: decoded.contactId, subjectId: decoded.sub },
      };
    }

    return false;
  };
}
