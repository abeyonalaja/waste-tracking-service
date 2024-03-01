import {
  ReferenceChar,
  EWCCodesLength,
  WasteDescriptionChar,
  BulkWasteQuantityValue,
  SmallWasteQuantityValue,
} from './constraints';

export const ReferenceValidationErrorMessages = {
  empty: 'Enter a unique reference',
  charTooFew: `Your unique reference must be more than ${ReferenceChar.min} character`,
  charTooMany: `The unique reference must be ${ReferenceChar.max} characters or less`,
  invalid: 'The reference must only include letters a to z, and numbers',
};

export const BaselAnnexIXCodeValidationErrorMessages = {
  invalid: 'Enter Basel Annex IX code in correct format',
};

export const OECDCodeValidationErrorMessages = {
  invalid: 'Enter OECD code in correct format',
};

export const AnnexIIIACodeValidationErrorMessages = {
  invalid: 'Enter Annex IIIA code in correct format',
};

export const AnnexIIIBCodeValidationErrorMessages = {
  invalid: 'Enter Annex IIIB code in correct format',
};

export const LaboratoryValidationErrorMessages = {
  invalid: "Enter 'yes' if you are sending unlisted waste to a laboratory",
};

export const EWCCodeErrorMessages = {
  empty: 'Enter an EWC code',
  invalid: 'Enter EWC code in correct format',
  tooMany: `You can only enter a maximum of ${EWCCodesLength.max} EWC codes`,
};

export const NationalCodeValidationErrorMessages = {
  invalid: 'Enter national code in correct format',
};

export const WasteCodeValidationErrorMessages = {
  empty: 'Enter a waste code',
  tooMany:
    'You can only enter one Basel Annex IX, OECD, Annex IIIA, or Annex IIB code',
  laboratory: 'Do not enter a waste code if the waste is going to a laboratory',
};

export const WasteDescriptionValidationErrorMessages = {
  empty: 'Waste description cannot be left blank',
  charTooFew: `Enter at least ${WasteDescriptionChar.min} letter or number`,
  charTooMany: `Waste description must be less than ${WasteDescriptionChar.max} characters`,
};

export const BulkWasteQuantityValidationErrorMessages = {
  invalid: `The waste quantity must be between ${BulkWasteQuantityValue.greaterThan} and ${BulkWasteQuantityValue.lessThan}`,
};

export const SmallWasteQuantityValidationErrorMessages = {
  invalid: `Enter a weight ${SmallWasteQuantityValue.lessThanOrEqual}kg or under`,
};

export const WasteQuantityValidationErrorMessages = {
  empty: 'Enter quantity of waste',
  invalid: 'Enter the weight using only numbers and a full stop',
  tooMany:
    'Only enter one of the following; waste quantity in tonnes, kilograms, or cubic metres',
  missingType: "Enter either 'estimate' or 'actual'",
  laboratory:
    "Only enter an amount in this cell if you have entered 'Y' in column G for sending waste to a laboratory",
};
