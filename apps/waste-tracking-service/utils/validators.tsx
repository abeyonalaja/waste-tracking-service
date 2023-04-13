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

  const regex = new RegExp('^[a-zA-Z0-9\\-\\/]{1,50}$');
  if (!regex.test(reference))
    return 'The reference must only include letters a to z, numbers, hyphens and forward slashes';
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

export const validateNationalCode: (
  hasNationalCode?: string,
  nationalCode?: string
) => string | undefined = (hasNationalCode, nationalCode) => {
  if (hasNationalCode !== 'Yes') return;

  if (nationalCode === undefined || nationalCode === '') return 'Enter code ';

  if (nationalCode.length > 50)
    return 'Enter a reference using 50 character or less';

  const regex = new RegExp('^[a-zA-Z0-9\\\\\\-]{1,50}$');
  if (!regex.test(nationalCode))
    return 'The code must only include letters a to z, numbers, hyphens and bacl slashes';
};

export const validateWasteDescription: (
  description?: string
) => string | undefined = (description) => {
  if (description === undefined || description?.length === 0)
    return 'Enter a description';
  if (description?.length > 100)
    return 'Description must be 100 characters or less';
};
