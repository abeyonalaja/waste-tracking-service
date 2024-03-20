import { isPast, isValid } from 'date-fns';
import aOrAn from './aOrAn';
import i18next from 'i18next';
const t = i18next.t;

export function isNotEmpty(obj) {
  return Object.keys(obj).some((key) => obj[key]?.length > 0);
}

export const validateReference: (reference?: string) => string | null = (
  reference
) => {
  if (reference !== null) {
    reference = reference.trim();
  }
  if (reference === null || reference === '')
    return t('validation.reference.empty');
  if (reference.length === 1) return t('validation.reference.charTooFew');
  if (reference.length > 20) return t('validation.reference.charTooMany');
  const regex = new RegExp('^[a-zA-Z0-9]{1,20}$');
  if (!regex.test(reference)) return t('validation.reference.charInvalid');
};

export const validateWasteCodeCategory: (
  wasteCodeCategory?: string
) => string | undefined = (wasteCodeCategory) =>
  wasteCodeCategory ? undefined : t('validation.wasteCode.category');

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
    return t('validation.wasteCode.empty', {
      wc: `${aOrAn(wasteCodeCategory.charAt(0))} ${wasteCodeCategoryLabel}`,
    });
};

export const validateEwcCode: (
  hasEWCCode?: string,
  ewcCode?: string
) => string | undefined = (hasEWCCode, ewcCode) => {
  const regex = new RegExp('^[0-9]+$');
  if (hasEWCCode !== 'Yes') return;
  else if (ewcCode === undefined) return t('validation.ewcCode.empty');
  else if (!regex.test(ewcCode)) return t('validation.ewcCode.wrongFormat');
  else if (ewcCode === null || ewcCode.length === 0)
    return t('validation.ewcCode.empty');
  else if (ewcCode.length != 6) return t('validation.ewcCode.invalid');
};

export const validateNationalCode: (
  hasNationalCode?: string,
  nationalCode?: string
) => string | undefined = (hasNationalCode, nationalCode) => {
  if (hasNationalCode !== 'Yes') return;

  if (nationalCode === undefined || nationalCode === '')
    return t('validation.nationalCode.empty');

  if (nationalCode.length > 50) return t('validation.nationalCode.charTooMany');

  const regex = new RegExp('^[a-zA-Z0-9\\\\\\- ]{1,50}$');
  if (!regex.test(nationalCode))
    return t('validation.nationalCode.charInvalid');
};

export const validateWasteDescription: (
  description?: string
) => string | undefined = (description) => {
  if (description) {
    description = description.trim();
  }
  if (description === undefined || description?.length === 0)
    return t('validation.description.empty');
  if (description?.length > 100) return t('validation.description.tooLong');
};

export const validateWasteDescriptionTemplate: (
  description?: string
) => string | undefined = (description) => {
  if (description?.length > 100) return t('validation.description.tooLong');
};

export const validatePostcode: (
  postcode?: string,
  allowNull?: boolean
) => string = (postcode, allowNull = false) => {
  if (allowNull && (postcode === undefined || postcode === '')) {
    return;
  }
  if (postcode?.length === 0) return t('validation.postcode.empty');
  const regex = new RegExp(
    '^[A-Za-z]{1,2}\\d{1,2}[A-Za-z]?\\s?\\d[A-Za-z]{2}$'
  );
  if (!regex.test(postcode)) {
    return t('validation.postcode.invalid');
  }
};

export const validateEmail: (email?: string, allowNull?: boolean) => string = (
  email,
  allowNull = false
) => {
  if (allowNull && (email === undefined || email === '')) {
    return;
  }
  if (email?.length === 0) return t('validation.email.empty');
  const regex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  if (!regex.test(email)) {
    return t('validation.email.invalid');
  }
};

export const validatePhone: (phone?: string, allowNull?: boolean) => string = (
  phone,
  allowNull = false
) => {
  if (allowNull && (phone === undefined || phone === '')) {
    return;
  }
  if (phone?.length === 0) return t('validation.phone.empty');
  const regex = new RegExp(
    '^((\\+44|00)[0-9 ()-]{8,14}[0-9]|[0][0-9 ()-]{9,13}[0-9])$'
  );
  if (!regex.test(phone)) {
    return t('validation.phone.invalid');
  }
};

export const validateFax: (fax?: string, allowNull?: boolean) => string = (
  fax,
  allowNull = true
) => {
  if (allowNull && (fax === undefined || fax === '')) {
    return;
  }
  const regex = new RegExp(
    '^(\\+[0-9 ()-]{11,14}[0-9]|[0-9 ()-]{10,13}[0-9])$'
  );
  if (!regex.test(fax)) {
    return t('validation.fax.invalid');
  }
};

export const validateInternationalPhone: (
  phone?: string,
  allowNull?: boolean
) => string = (phone, allowNull = false) => {
  if (allowNull && (phone === undefined || phone === '')) {
    return;
  }
  if (phone?.length === 0) return t('validation.phone.empty');

  const regex = new RegExp('^\\+[0-9 ()-]{3,18}[0,9]|[0-9 ()-]{3,19}[0-9]$');
  if (!regex.test(phone)) {
    return t('validation.phone.invalid');
  }
};

export const validateInternationalFax: (
  fax?: string,
  allowNull?: boolean
) => string = (fax, allowNull = true) => {
  if (allowNull && (fax === undefined || fax === '')) {
    return;
  }
  const regexInternational = new RegExp(
    '^\\+[0-9 ()-]{3,18}[0,9]|[0-9 ()-]{3,19}[0-9]$'
  );
  if (!regexInternational.test(fax)) {
    return t('validation.fax.invalid');
  }
};

export const validateSelectAddress: (address?: string) => string = (
  address
) => {
  if (address === '' || address === undefined)
    return t('validation.address.select');
};

export const validateTownCity: (townCity?: string) => string = (townCity) => {
  if (townCity?.length === 0 || townCity === undefined || !townCity.trim())
    // trim returns true / false and in this way we check if string contains only spaces
    return t('validation.address.townCity.empty');
};
export const validateCountrySelect: (country?: string) => string = (
  country
) => {
  if (country?.length === 0 || country === undefined)
    return t('validation.address.county.select');
};

export const validateCountry: (country?: string) => string = (country) => {
  if (country?.length === 0 || country === undefined)
    return t('validation.address.county.empty');
};

export const validateSameAsImporter: (
  transitCountry?: string,
  importerCountry?: string
) => string = (transitCountry, importerCountry) => {
  if (transitCountry === importerCountry)
    return t('validation.transit.country.sameAsImporter');
};
export const validateAddress: (address?: string) => string = (address) => {
  if (address?.length === 0 || address === undefined || !address.trim())
    // trim returns true / false and in this way we check if string contains only spaces
    return t('validation.address.empty');
};

export const validateOrganisationName: (organisationName?: string) => string = (
  organisationName
) => {
  if (organisationName?.length === 0 || organisationName === undefined)
    return t('validation.orgName.empty');
};
export const validateFullName: (fullName?: string) => string = (fullName) => {
  if (fullName?.length === 0 || fullName === undefined)
    return t('validation.fullName.empty');
};

export const validateQuantityType: (quantityType?: string) => string = (
  quantityType
) => {
  if (quantityType === undefined) {
    return t('validation.quantity.type.smallAndBulk');
  }
};

export const validateWeightOrVolume: (
  quantityType?: string,
  estimate?: boolean
) => string = (quantityType, estimate) => {
  if (quantityType === null && estimate)
    return t('validation.quantity.amount.estimate');
  if (quantityType === null && !estimate)
    return t('validation.quantity.amount.actual');
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
    if (quantityValue === undefined || quantityValue === '') {
      return t('validation.quantity.value', {
        label: label.toLowerCase(),
        unit: unit,
      });
    }
    const regex = new RegExp('^[0-9]*(\\.[0-9]{0,2})?$');
    if (!regex.test(quantityValue)) {
      return t('validation.quantity.value.numbers', {
        label: label.toLowerCase(),
      });
    }
    if (Number(quantityValue) === 0) {
      return t('validation.quantity.value.invalid', {
        label: label.toLowerCase(),
      });
    }
    if (!bulk && Number(quantityValue) > 25) {
      return t('validation.quantity.value.invalid.small');
    }
  }
};

export const validateDateType: (value?: string) => string | undefined = (
  value
) => (value ? undefined : t('validation.date.collection.select'));

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

  if (!isValid(dateString)) return t('validation.date.invalid');

  const dateStringRaw = `${day}/${month}/${year}`;
  if (!isValidDate(dateStringRaw)) return t('validation.date.invalid');

  if (isPast(dateString)) return t('validation.date.invalid.past');
};

export const validateActualDate: (date: Date) => string | undefined = (
  date: Date
) => {
  const day = Number(date?.day);
  const month = Number(date?.month);
  const year = Number(date?.year);
  const dateString = new Date(year, month - 1, day);

  if (!isValid(dateString)) return t('validation.date.invalid');

  const dateStringRaw = `${day}/${month}/${year}`;
  if (!isValidDate(dateStringRaw)) return t('validation.date.invalid');
};

export const validateKnowsPointOfExit: (
  knowsPointOfExit?: string
) => string | undefined = (knowsPointOfExit) => {
  if (knowsPointOfExit === undefined) return t('validation.exit.select');
};

export const validatePointOfExit: (
  knowsPointOfExit?: string,
  pointOfExit?: string
) => string | undefined = (knowsPointOfExit, pointOfExit) => {
  if (knowsPointOfExit === undefined || knowsPointOfExit === 'No') return;

  if (pointOfExit === undefined || pointOfExit === '')
    return t('validation.location.empty');

  if (pointOfExit.length > 50) return t('validation.location.charTooMany');

  const regex = new RegExp("^[a-zA-Z0-9\\\\\\- .,']{1,50}$");
  if (!regex.test(pointOfExit)) return t('validation.location.charInvalid');
};

export const validateTransport: (
  carrierNumber: string,
  value?: string
) => string | undefined = (carrierNumber, value) => {
  if (value === undefined)
    return t('validation.transport.select', { carrierNumber });
};

export const validateTransportDescription: (
  type: string,
  carrierNumber: string,
  description?: string
) => string | undefined = (type, carrierNumber, description) => {
  if (description) {
    description = description.trim();
  }
  if (description?.length > 200)
    return t('validation.transport.description', { carrierNumber, type });
};

export const validateTransitCountries: (
  value?: string
) => string | undefined = (value) => {
  if (value === null) return t('validation.transit.countries.select');
};

export const validateTransitCountry: (
  hasCountry?: string,
  country?: []
) => string | undefined = (hasCountry, country) => {
  if (hasCountry !== 'Yes') return;
  if (country === undefined || country.length === 0)
    return t('validation.transit.country.select');
};

export const validateSingleTransitCountry: (
  hasCountry?: string,
  country?: []
) => string | undefined = (hasCountry, country) => {
  if (hasCountry !== 'Yes') return;
  if (country === null) return t('validation.transit.country.select');
};

export const validateUniqueCountries: (
  additionaCountry?: string,
  countries?: [string]
) => string | undefined = (additionaCountry, countries) => {
  if (countries.includes(additionaCountry))
    return t('validation.transit.country.hasDuplicates');
};

export const validateConfirmRemove: (
  value?: string,
  label?: string
) => string | undefined = (value, label) => {
  if (value === null) return t('validation.confirmation', { label });
};

export const validateSelection: (
  value?: string,
  label?: string
) => string | undefined = (value, label) => {
  if (value === null) return t('validation.selection', { label });
};

export const validateConfirmRemoveCarrier: (
  value?: string
) => string | undefined = (value) => {
  if (value === null) return t('validation.remove.carrier');
};

export const validateConfirmRemoveDocument: (
  value?: string
) => string | undefined = (value) => {
  if (value === null) return t('validation.remove.document');
};

export const validateConfirmCancelDocument: (
  value?: string
) => string | undefined = (value) => {
  if (value === null) return t('validation.remove.document.reason');
};

export const validateConfirmCancelReason: (
  type?: string,
  reason?: string
) => string | undefined = (type, reason) => {
  if (type !== 'Other') return;
  if (reason === null || reason === undefined)
    return t('validation.cancel.reason');
  reason = reason.trim();
  if (reason.length === 0) return t('validation.cancel.reason');
  if (reason.length > 100) return t('validation.cancel.reason.invalid');
};

export const validateRecoveryFacilityName: (facility?: string) => string = (
  facility
) => {
  if (facility?.length === 0 || facility === undefined)
    return t('validation.recovery.facility.name');
};

export const validateRecoveryCode: (code?: string) => string = (code) => {
  if (code?.length === 0 || code === undefined)
    return t('validation.recovery.facility.code');
};

export const validateAddAnotherFacility: (
  value?: string
) => string | undefined = (value) => {
  if (value === null) return t('validation.recovery.facility.another');
};

export const validateFieldNotEmpty: (
  value?: string,
  label?: string
) => string | undefined = (value, label) => {
  if (value?.length === 0 || value === undefined)
    return t('validation.empty', { label });
};

export const validateTemplateName: (value?: string) => string | undefined = (
  value
) => {
  if (value?.length === 0 || value === undefined)
    return `Enter a name for the template`;
  const regex = new RegExp("^[a-zA-Z0-9\\\\\\-_.')( ]{1,50}$");
  if (!regex.test(value)) return t('validation.template.name');
};

export const validateTemplateDesc: (
  description?: string
) => string | undefined = (description) => {
  if (description?.length > 100) return t('validation.template.description');
};
