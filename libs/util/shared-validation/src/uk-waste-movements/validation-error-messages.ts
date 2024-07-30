import * as codes from './error-codes';
import * as constraints from './constraints';
import { ValidationErrorMessages } from './dto';

export const validationErrorMessages: ValidationErrorMessages = {
  [codes.producerEmptyOrganisationName]: {
    en: {
      csv: 'CSV: Enter the producer organisation name',
      api: 'API: Enter the producer organisation name',
      ui: 'UI: Enter the producer organisation name',
    },
    cy: {
      csv: 'CSV: Rhowch enw’r sefydliad cynhyrchu',
      api: 'API: Rhowch enw’r sefydliad cynhyrchu',
      ui: 'UI: Rhowch enw’r sefydliad cynhyrchu',
    },
  },
  [codes.producerCharTooManyOrganisationName]: {
    en: `The producer organisation name must be less than ${constraints.FreeTextChar.max} characters`,
    cy: `Rhaid i enw’r sefydliad cynhyrchu fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
  },
  [codes.producerEmptyReference]: {
    en: 'Enter a unique reference',
    cy: 'Rhowch gyfeirnod unigryw',
  },
  [codes.producerCharTooManyReference]: {
    en: `The unique reference must be ${constraints.ReferenceChar.max} characters or less`,
    cy: `Rhaid i’r cyfeirnod unigryw fod yn llai na ${constraints.ReferenceChar.max} o gymeriadau`,
  },
  [codes.producerInvalidReference]: {
    en: 'The unique reference can only contain letters, numbers, hyphens, slashes, underscores and spaces',
    cy: "Rhaid i'r cyfeirnod gynnwys llythrennau a i z yn unig, a rhifau",
  },
};
