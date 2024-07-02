import {
  isNotEmpty,
  validateAddress,
  validateCountry,
  validateEmail,
  validateFullName,
  validateInternationalFax,
  validateInternationalPhone,
  validateRecoveryCode,
  validateRecoveryFacilityName,
} from '../validators';
import {
  RecoveryFacilityData,
  RecoveryFacilityDetail,
  RecoveryFacilityPartial,
} from '@wts/api/waste-tracking-gateway';

interface RecoveryFacilityPartialWithoutStatus {
  values: RecoveryFacilityPartial[];
}

export const getTreatmentStatus = (
  data: RecoveryFacilityDetail,
  facilityData: RecoveryFacilityPartialWithoutStatus,
): string => {
  if (data.status === 'Complete' || data.status === 'Started') {
    const id = facilityData?.values[0]?.id;
    const objIndex = data.values?.findIndex((obj) => obj.id == id);

    if (objIndex !== -1) {
      data.values[objIndex] = facilityData.values[0];
    }
    const recFacilityCount = data.values?.filter(
      (site: RecoveryFacilityData) =>
        site.recoveryFacilityType?.type === 'RecoveryFacility',
    ).length;

    let status = 'Complete';

    if (recFacilityCount === 0) {
      return 'Started';
    }

    data.values?.forEach((facility: RecoveryFacilityData) => {
      const newErrors = {
        name: validateRecoveryFacilityName(facility.addressDetails?.name),
        address: validateAddress(facility.addressDetails?.address),
        country: validateCountry(facility.addressDetails?.country),
        fullName: validateFullName(facility.contactDetails?.fullName),
        emailAddress: validateEmail(facility.contactDetails?.emailAddress),
        phoneNumber: validateInternationalPhone(
          facility.contactDetails?.phoneNumber,
        ),
        faxNumber: validateInternationalFax(facility.contactDetails?.faxNumber),
        recoveryCode: validateRecoveryCode(
          facility.recoveryFacilityType.type !== 'Laboratory'
            ? facility.recoveryFacilityType?.recoveryCode
            : '',
        ),
      };
      if (isNotEmpty(newErrors)) {
        status = 'Started';
      }
    });
    return status;
  } else {
    return 'Started';
  }
};
