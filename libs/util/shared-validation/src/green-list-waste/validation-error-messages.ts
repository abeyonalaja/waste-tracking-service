import * as constraints from './constraints';
import { ValidationErrorMessages } from './dto';

export const fieldErrorMessages: ValidationErrorMessages[] = [
  {
    field: 'reference',
    errors: {
      empty: {
        en: {
          csv: 'CSV: Enter a unique reference',
          api: 'API: Enter a unique reference',
          ui: 'UI: Enter a unique reference',
        },
        cy: {
          csv: 'CSV: Rhowch gyfeirnod unigryw',
          api: 'API: Rhowch gyfeirnod unigryw',
          ui: 'UI: Rhowch gyfeirnod unigryw',
        },
      },
      charTooFew: {
        en: {
          csv: `CSV: Your unique reference must be more than ${constraints.ReferenceChar.min} character`,
          api: `API: Your unique reference must be more than ${constraints.ReferenceChar.min} character`,
          ui: `UI: Your unique reference must be more than ${constraints.ReferenceChar.min} character`,
        },
        cy: {
          csv: `CSV: Rhaid i’ch cyfeirnod unigryw fod yn fwy na ${constraints.ReferenceChar.min} nod`,
          api: `API: Rhaid i’ch cyfeirnod unigryw fod yn fwy na ${constraints.ReferenceChar.min} nod`,
          ui: `UI: Rhaid i’ch cyfeirnod unigryw fod yn fwy na ${constraints.ReferenceChar.min} nod`,
        },
      },
      charTooMany: {
        en: `The unique reference must be ${constraints.ReferenceChar.max} characters or less`,
        cy: `Rhaid i’r cyfeirnod unigryw fod yn llai na ${constraints.ReferenceChar.max} o gymeriadau`,
      },
      invalid: {
        en: {
          csv: `CSV: The reference must only include letters a to z, and numbers`,
          api: `API: The reference must only include letters a to z, and numbers`,
          ui: `UI:The reference must only include letters a to z, and numbers`,
        },
        cy: {
          csv: `CSV: Rhaid i'r cyfeirnod gynnwys llythrennau A at z yn unig, a rhifau`,
          api: `API: Rhaid i'r cyfeirnod gynnwys llythrennau A at z yn unig, a rhifau`,
          ui: `UI: Rhaid i'r cyfeirnod gynnwys llythrennau A at z yn unig, a rhifau`,
        },
      },
    },
  },
];

export const CarrierErrorMessages: (
  carrierNumber: number,
) => ValidationErrorMessages[] = (carrierNumber) => {
  let carrierStr = '';
  switch (carrierNumber) {
    case 1:
      carrierStr = 'first';
      break;
    case 2:
      carrierStr = 'second';
      break;
    case 3:
      carrierStr = 'third';
      break;
    case 4:
      carrierStr = 'fourth';
      break;
    case 5:
      carrierStr = 'fifth';
      break;
    default:
      carrierStr = 'first';
      break;
  }

  return [
    {
      field: 'carrier',
      errors: {
        emptyOrganisationName: {
          en: {
            csv: `CSV: Enter the ${carrierStr} carrier organisation name`,
            api: `API: Enter the ${carrierStr} carrier organisation name`,
            ui: `UI: Enter the ${carrierStr} carrier organisation name`,
          },
          cy: {
            csv: `CSV: Rhowch enw'r sefydliad cludwr ${carrierStr}`,
            api: `API: Rhowch enw'r sefydliad cludwr ${carrierStr}`,
            ui: `UI: Rhowch enw'r sefydliad cludwr ${carrierStr}`,
          },
        },
        charTooManyOrganisationName: {
          en: `The ${carrierStr} carrier organisation name must be less than ${constraints.FreeTextChar.max} characters`,
          cy: `Rhaid i enw'r sefydliad cludwr ${carrierStr} fod yn llai na ${constraints.FreeTextChar.max} o gymeriadau`,
        },
      },
    },
  ];
};
