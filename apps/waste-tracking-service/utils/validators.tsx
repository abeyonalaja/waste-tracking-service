import aOrAn from './aOrAn';

export const validateOwnReference: (value?: string) => string | undefined = (
  value
) => (value ? undefined : 'Select yes if you want to add a reference');

export const validateReference: (
  ownReference?: string,
  reference?: string
) => string | null = (ownReference, reference) => {
  if (ownReference !== 'yes') return;

  if (reference === null || reference === '') return 'Enter a reference ';

  if (reference.length === 1)
    return 'Enter a reference using more than 1 character';

  if (reference.length > 50)
    return 'Enter a reference using 50 character or less';

  const regex = new RegExp('^[a-zA-Z0-9\\\\\\- ]{1,50}$');
  if (!regex.test(reference))
    return 'The reference must only include letters a to z, numbers, spaces, hyphens and back slashes';
};

export const validateWasteCodeCategory: (
  wasteCodeCategory?: string
) => string | undefined = (wasteCodeCategory) =>
  wasteCodeCategory ? undefined : 'Select a waste code';

export const validateWasteCode: (
  wasteCodeCategory?: string,
  wasteCode?: string,
  wasteCodeCategoryLabel?: string
) => string | undefined = (
  wasteCodeCategory,
  wasteCode,
  wasteCodeCategoryLabel
) => {
  if (wasteCodeCategory === 'NotApplicable') return;

  if (
    wasteCodeCategory !== 'NotApplicable' &&
    wasteCode === undefined &&
    wasteCodeCategory?.toLowerCase() ===
      wasteCodeCategoryLabel.toLowerCase().replace(/ /g, '')
  )
    return `Enter ${aOrAn(
      wasteCodeCategory.charAt(0)
    )} ${wasteCodeCategoryLabel} waste code`;
};

export const validateDoYouHaveAnEWCCode: (value?: string) => string | null = (
  value
) => {
  console.log(value);
  return value ? null : 'Select yes if you want to add an EWC code';
};

export const validateEwcCodes: (
  ewcCodes?: string[],
  showInput?: string
) => string | undefined = (ewcCodes, showInput) => {
  if (showInput !== 'yes') return;
  if (ewcCodes === undefined) return 'Select an EWC code ';
};

export const validateNationalCode: (
  hasNationalCode?: string,
  nationalCode?: string
) => string | undefined = (hasNationalCode, nationalCode) => {
  if (hasNationalCode !== 'Yes') return;

  if (nationalCode === undefined || nationalCode === '') return 'Enter code ';

  if (nationalCode.length > 50)
    return 'Enter a reference using 50 character or less';

  const regex = new RegExp('^[a-zA-Z0-9\\\\\\- ]{1,50}$');
  if (!regex.test(nationalCode))
    return 'The code must only include letters a to z, numbers, spaces, hyphens and back slashes';
};

export const validateWasteDescription: (
  description?: string
) => string | undefined = (description) => {
  if (description === undefined || description?.length === 0)
    return 'Enter a description';
  if (description?.length > 100)
    return 'Description must be 100 characters or less';
};

export const validatePostcode: (postcode?: string) => string = (postcode) => {
  if (postcode?.length === 0) return 'Enter a postcode';
};
