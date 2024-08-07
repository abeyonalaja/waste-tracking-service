import { Address } from '@wts/api/address';

const startsWithNumber = (str: string) => /^\d/.test(str);
const endsWithNumber = (str: string) => /[0-9]+$/.test(str);

const isHouseNumber = (addressLine: string | undefined): boolean => {
  if (!addressLine) {
    return false;
  }
  return (
    addressLine.length <= 5 &&
    (startsWithNumber(addressLine) || endsWithNumber(addressLine))
  );
};

export function formatAddress(addressString: string | undefined): JSX.Element {
  if (!addressString) {
    return <span></span>;
  }
  const address: Address = JSON.parse(addressString);
  return (
    <p>
      <span
        id="address-buildingNameOrNumber"
        className={
          isHouseNumber(address.buildingNameOrNumber) ? 'houseNumber' : ''
        }
      >
        {address.buildingNameOrNumber
          ? `${address.buildingNameOrNumber}, `
          : ''}
      </span>
      <span
        id="address-addressLine1"
        className={isHouseNumber(address.addressLine1) ? 'houseNumber' : ''}
      >
        {address.addressLine1}
      </span>
      <br />
      {address.addressLine2 && (
        <span
          id="address-addressLine2"
          className={
            isHouseNumber(address.addressLine1) ? 'houseNumberFollower' : ''
          }
        >
          {address.addressLine2}
          <br />
        </span>
      )}
      <span id="address-townCity">{address.townCity}</span>
      <br />
      {address.postcode && (
        <span id="address-postcode">
          {address.postcode}
          <br />
        </span>
      )}
      <span id="address-country">{address.country}</span>
    </p>
  );
}
