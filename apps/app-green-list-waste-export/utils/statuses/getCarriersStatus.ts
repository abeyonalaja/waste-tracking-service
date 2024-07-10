import {
  isNotEmpty,
  validateAddress,
  validateCountry,
  validateEmail,
  validateFullName,
  validateInternationalFax,
  validateInternationalPhone,
  validateOrganisationName,
  validateTransport,
  validateTransportDescription,
} from '../validators';
import { CarrierPartial, Carriers } from '@wts/api/waste-tracking-gateway';

export const getCarrierStatus = (
  existingData: Carriers,
  updatedCarrier: Carriers,
  transportEnabled: boolean,
): string => {
  if (existingData.status === 'Complete' || existingData.status === 'Started') {
    if (
      updatedCarrier.status === 'Complete' ||
      updatedCarrier.status === 'Started'
    ) {
      const updatedCarrierId = updatedCarrier?.values[0]?.id;
      const objIndex = existingData.values?.findIndex(
        (carrier) => carrier.id === updatedCarrierId,
      );
      if (objIndex !== undefined) {
        existingData.values[objIndex] = updatedCarrier.values[0];
      }
    }

    let status = 'Complete';

    existingData.values?.forEach((carrierData: CarrierPartial) => {
      const newErrors = {
        organisationName: validateOrganisationName(
          carrierData?.addressDetails?.organisationName,
        ),
        address: validateAddress(carrierData?.addressDetails?.address),
        country: validateCountry(carrierData?.addressDetails?.country),
        fullName: validateFullName(carrierData?.contactDetails?.fullName),
        emailAddress: validateEmail(carrierData?.contactDetails?.emailAddress),
        phoneNumber: validateInternationalPhone(
          carrierData?.contactDetails?.phoneNumber,
        ),
        faxNumber: validateInternationalFax(
          carrierData?.contactDetails?.faxNumber,
        ),
        transportTypeError:
          transportEnabled &&
          validateTransport('1', carrierData?.transportDetails?.type),
        transportDescriptionError:
          transportEnabled &&
          validateTransportDescription(
            '1',
            '1',
            carrierData?.transportDetails?.description,
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
