import aOrAn from './aOrAn';

export function isNotEmpty(obj) {
  return Object.keys(obj).some((key) => obj[key]?.length > 0);
}

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
  const regex = new RegExp(
    '^[A-Za-z]{1,2}\\d{1,2}[A-Za-z]?\\s?\\d[A-Za-z]{2}$'
  );
  if (!regex.test(postcode)) {
    return 'Enter a real postcode';
  }
};

export const validateEmail: (email?: string) => string = (email) => {
  if (email?.length === 0) return 'Enter an email';
  const regex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  if (!regex.test(email)) {
    return 'Enter a real email';
  }
};

export const validatePhone: (phone?: string) => string = (phone) => {
  if (phone?.length === 0) return 'Enter an phone mumber';
  const regex = new RegExp(
    '^(?:(?:\\+44\\s*\\d{10})|(?:\\(?0\\d{4}\\)?[\\s-]?\\d{3}[\\s-]?\\d{3}))$'
  );  if (!regex.test(phone)) {
     return 'Enter a real phone number';
  }
};

export const validateSelectAddress: (address?: string) => string = (
  address
) => {
  if (address === '' || address === undefined) return 'Select an address';
};

export const validateTownCity: (townCity?: string) => string = (townCity) => {
  if (townCity?.length === 0 || townCity === undefined)
    return 'Enter a town or city';
};

export const validateCountry: (country?: string) => string = (country) => {
  if (country?.length === 0 || country === undefined) return 'Select an option';
};

export const validateAddress: (address?: string) => string = (address) => {
  if (address?.length === 0 || address === undefined) return 'Enter an address';
};

export const validateOrganisationName: (organisationName?: string) => string = (
  organisationName
) => {
  if (organisationName?.length === 0 || organisationName === undefined)
    return 'Enter an organisation name';
};

export const validateFullName: (fullName?: string) => string = (fullName) => {
  if (fullName?.length === 0 || fullName === undefined)
    return 'Enter an full name';
};

export const validateQuantityType: (quantityType?: string) => string = (
  quantityType
) => {
  if (quantityType === null) return 'Select an option';
};

export const validateQuantityValue: (
  quantityType: boolean,
  quantityValue: string,
  label: string,
  bulk: boolean
) => string = (quantityType, quantityValue, label, bulk) => {
  if (!quantityType) return;
  if (quantityType) {
    if (quantityValue === '' || Number(quantityValue) === 0) {
      return `Enter the ${label.toLowerCase()}`;
    }
    const regex = new RegExp('^[0-9]*(\\.[0-9]{0,2})?$');
    if (!regex.test(quantityValue)) {
      return `Enter the ${label.toLowerCase()} using only numbers, up to two decimal places`;
    }
    if (!bulk && Number(quantityValue) >= 25) {
      return 'Enter a weight under 25kg';
    }
  }
};
