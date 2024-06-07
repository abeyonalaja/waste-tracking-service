import {
  isNotEmpty,
  validateAddress,
  validateCountry,
  validateEmail,
  validateFullName,
  validateInternationalPhone,
  validateOrganisationName,
} from 'utils/validators';

export const getStatusImporter = (data): string => {
  const newErrors = {
    organisationName: validateOrganisationName(
      data?.importerAddressDetails?.organisationName,
    ),
    address: validateAddress(data?.importerAddressDetails?.address),
    country: validateCountry(data?.importerAddressDetails?.country),
    fullName: validateFullName(data?.importerContactDetails?.fullName),
    email: validateEmail(data?.importerContactDetails?.emailAddress),
    phone: validateInternationalPhone(
      data?.importerContactDetails?.phoneNumber,
    ),
  };
  if (isNotEmpty(newErrors)) {
    return 'Started';
  }
  return 'Complete';
};
