import {
  isNotEmpty,
  validateAddress,
  validateCountrySelect,
  validateEmail,
  validateFullName,
  validateOrganisationName,
  validatePhone,
  validateTownCity,
} from 'utils/validators';

export const getStatusExporter = (data): string => {
  const newErrors = {
    townCity: validateTownCity(data?.exporterAddress?.townCity),
    country: validateCountrySelect(data?.exporterAddress?.country),
    address: validateAddress(data?.exporterAddress?.addressLine1),
    organisationName: validateOrganisationName(
      data?.exporterContactDetails?.organisationName,
    ),
    fullName: validateFullName(data?.exporterContactDetails?.fullName),
    email: validateEmail(data?.exporterContactDetails?.emailAddress),
    phone: validatePhone(data?.exporterContactDetails?.phoneNumber),
  };
  if (isNotEmpty(newErrors)) {
    return 'Started';
  }
  return 'Complete';
};
