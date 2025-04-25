import { UkwmAddress } from '@wts/api/waste-tracking-gateway';

export function areSameAddress(
  addressOne: UkwmAddress,
  addressTwo: UkwmAddress,
): boolean {
  return (
    addressOne.buildingNameOrNumber === addressTwo.buildingNameOrNumber &&
    addressOne.addressLine1 === addressTwo.addressLine1 &&
    addressOne.addressLine2 === addressTwo.addressLine2 &&
    addressOne.townCity === addressTwo.townCity &&
    addressOne.postcode === addressTwo.postcode &&
    addressOne.country === addressTwo.country
  );
}
