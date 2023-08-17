import aOrAn from './aOrAn';
import { isPast, isValid, addBusinessDays, differenceInDays } from 'date-fns';

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

  if (reference.length > 20)
    return 'Enter a reference using 20 character or less';

  const regex = new RegExp('^[a-zA-Z0-9\\\\\\- ]{1,20}$');
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
    return 'Enter a code using 50 character or less';

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
  if (email?.length === 0) return 'Enter an email address';
  const regex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  if (!regex.test(email)) {
    return 'Enter a real email address';
  }
};

export const validatePhone: (phone?: string) => string = (phone) => {
  if (phone?.length === 0) return 'Enter a phone number';
  const regex = new RegExp(
    '^(?:(?:\\+44\\s*\\d{10})|(?:\\(?0\\d{4}\\)?[\\s-]?\\d{3}[\\s-]?\\d{3}))$'
  );
  if (!regex.test(phone)) {
    return 'Enter a real phone number';
  }
};

export const validateInternationalPhone: (phone?: string) => string = (
  phone
) => {
  if (phone?.length === 0) return 'Enter a phone number';
  const regex = new RegExp('^(\\+|0|00)[1-9][0-9 \\-\\(\\)\\.]{7,32}$');
  if (!regex.test(phone)) {
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
export const validateCountrySelect: (country?: string) => string = (
  country
) => {
  if (country?.length === 0 || country === undefined) return 'Select a country';
};

export const validateCountry: (country?: string) => string = (country) => {
  if (country?.length === 0 || country === undefined) return 'Enter a country';
};

export const validateAddress: (address?: string) => string = (address) => {
  if (address?.length === 0 || address === undefined) return 'Enter an address';
};

export const validateShippingContainerNumber: (
  shippingContainerNumber?: string
) => string = (shippingContainerNumber) => {
  if (
    shippingContainerNumber?.length === 0 ||
    shippingContainerNumber === undefined
  )
    return 'Enter a shipping container number';
};

export const validateVehicleRegistration: (
  vehicleRegistration?: string
) => string = (vehicleRegistration) => {
  if (vehicleRegistration?.length === 0 || vehicleRegistration === undefined)
    return 'Enter a vehicle registration number';
};
export const validateIMO: (imo?: string) => string = (imo) => {
  if (imo?.length === 0 || imo === undefined)
    return 'Enter an international maritime organisation (IMO) number';
};

export const validateOrganisationName: (organisationName?: string) => string = (
  organisationName
) => {
  if (organisationName?.length === 0 || organisationName === undefined)
    return 'Enter an organisation name';
};
export const validateFullName: (fullName?: string) => string = (fullName) => {
  if (fullName?.length === 0 || fullName === undefined)
    return 'Enter a full name';
};

export const validateQuantityType: (
  quantityType?: string,
  isBulkWaste?: boolean
) => string = (quantityType, isBulkWaste) => {
  if (quantityType === null) {
    if (isBulkWaste) {
      return 'Select yes if you know the actual or estimated amount of waste';
    } else {
      return 'Select yes if you know the actual quantity of waste';
    }
  }
};

export const validateWeightOrVolume: (
  quantityType?: string,
  estimate?: boolean
) => string = (quantityType, estimate) => {
  if (quantityType === null && estimate)
    return 'Enter the estimated net weight or volume of waste';
  if (quantityType === null && !estimate)
    return 'Enter the actual net weight or volume of waste';
};

export const validateQuantityValue: (
  quantityType: boolean,
  quantityValue: string,
  label: string,
  bulk: boolean,
  unit: string
) => string = (quantityType, quantityValue, label, bulk, unit) => {
  if (!quantityType) return;
  if (quantityType) {
    if (quantityValue === '') {
      return `Enter the ${label.toLowerCase()} in ${unit}`;
    }
    const regex = new RegExp('^[0-9]*(\\.[0-9]{0,2})?$');
    if (!regex.test(quantityValue)) {
      return `Enter the ${label.toLowerCase()} using only numbers`;
    }
    if (Number(quantityValue) === 0) {
      return `The ${label.toLowerCase()} needs to be greater than O`;
    }
    if (!bulk && Number(quantityValue) > 25) {
      return 'Enter a weight 25kg or under';
    }
  }
};

export const validateDateType: (value?: string) => string | undefined = (
  value
) =>
  value ? undefined : 'Select yes if you know when the waste will be collected';

interface Date {
  day: string;
  month: string;
  year: string;
}

const isValidDate = (date) => {
  const dateParts = date.split('/');
  const d = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
  return d && d.getMonth() + 1 == dateParts[1];
};
export const validateDate: (date: Date) => string | undefined = (
  date: Date
) => {
  const day = Number(date?.day);
  const month = Number(date?.month);
  const year = Number(date?.year);
  const dateString = new Date(year, month - 1, day);

  if (!isValid(dateString)) return 'Enter a real date';

  const dateStringRaw = `${day}/${month}/${year}`;
  if (!isValidDate(dateStringRaw)) return 'Enter a real date';

  if (isPast(dateString)) return 'Enter a date in the future';

  const threeWorkingDaysFromToday = addBusinessDays(new Date(), 3);
  if (differenceInDays(dateString, threeWorkingDaysFromToday) < 0)
    return 'Enter a date at least 3 business days in the future';
};

export const validateActualDate: (date: Date) => string | undefined = (
  date: Date
) => {
  const day = Number(date?.day);
  const month = Number(date?.month);
  const year = Number(date?.year);
  const dateString = new Date(year, month - 1, day);

  if (!isValid(dateString)) return 'Enter a real date';

  const dateStringRaw = `${day}/${month}/${year}`;
  if (!isValidDate(dateStringRaw)) return 'Enter a real date';
};

export const validateKnowsPointOfExit: (
  knowsPointOfExit?: string
) => string | undefined = (knowsPointOfExit) => {
  if (knowsPointOfExit === undefined)
    return 'Select yes if you know where the waste will leave the UK';
};

export const validatePointOfExit: (
  knowsPointOfExit?: string,
  pointOfExit?: string
) => string | undefined = (knowsPointOfExit, pointOfExit) => {
  if (knowsPointOfExit === undefined || knowsPointOfExit === 'No') return;

  if (pointOfExit === undefined || pointOfExit === '')
    return 'Enter the location ';

  if (pointOfExit.length > 50)
    return 'Enter the location using 50 character or less';

  const regex = new RegExp('^[a-zA-Z0-9\\\\\\- ]{1,50}$');
  if (!regex.test(pointOfExit))
    return 'The location must only include letters a to z, numbers, spaces, hyphens and back slashes';
};

export const validateTransitCountries: (
  value?: string
) => string | undefined = (value) => {
  if (value === null)
    return 'Select yes if there are any other countries the waste will travel through';
};

export const validateTransitCountry: (
  hasCountry?: string,
  country?: []
) => string | undefined = (hasCountry, country) => {
  if (hasCountry !== 'Yes') return;
  if (country === undefined || country.length === 0)
    return 'Select or enter country';
};

export const validateSingleTransitCountry: (
  hasCountry?: string,
  country?: []
) => string | undefined = (hasCountry, country) => {
  if (hasCountry !== 'Yes') return;
  if (country === null) return 'Select or enter country';
};

export const validateConfirmRemove: (
  value?: string,
  label?: string
) => string | undefined = (value, label) => {
  if (value === null) return `Select yes if you want to remove this ${label}`;
};

export const validateSelection: (
  value?: string,
  label?: string
) => string | undefined = (value, label) => {
  if (value === null) return `Select yes ${label}`;
};

export const validateConfirmRemoveCarrier: (
  value?: string
) => string | undefined = (value) => {
  if (value === null) return 'Select yes if you want to remove this carrier';
};

export const validateConfirmRemoveDocument: (
  value?: string
) => string | undefined = (value) => {
  if (value === null) return 'Select yes if you want to remove this document';
};

export const validateRecoveryFacilityName: (facility?: string) => string = (
  facility
) => {
  if (facility?.length === 0 || facility === undefined)
    return 'Enter the recovery facility name';
};

export const validateRecoveryCode: (code?: string) => string = (code) => {
  if (code?.length === 0 || code === undefined) return 'Enter a recovery code';
};

export const validateAddAnotherFacility: (
  value?: string
) => string | undefined = (value) => {
  if (value === null) return 'Select yes if you want to add another facility';
};

export const validateFieldNotEmpty: (
  value?: string,
  label?: string
) => string | undefined = (value, label) => {
  if (value?.length === 0 || value === undefined) return `Enter ${label}`;
};

export const validateTransport: (value?: string) => string | undefined = (
  value
) => {
  if (value === undefined) return 'Select a method of transport';
};
