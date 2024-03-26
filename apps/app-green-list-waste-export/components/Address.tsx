import React from 'react';
import styled from 'styled-components';

interface Props {
  instanceNo?: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    townCity: string;
    postcode?: string;
    country: string;
  };
}

const StyledAddress = styled('address')`
  color: #0b0c0c;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 16px;
  font-style: normal;
  line-height: 1.25;
  margin-top: 0;
  margin-bottom: 15px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1.32;
    margin-bottom: 20px;
  }
  span {
    display: block;
    &.houseNumber {
      display: inline-block;
      margin-right: 0.3em;
    }
    &.houseNumberFollower {
      display: inline-block;
    }
  }
`;

const startsWithNumber = (str) => {
  return /^\d/.test(str);
};

const endsWithNumber = (str) => {
  return /[0-9]+$/.test(str);
};

const isHouseNumber = (addessLine) => {
  if (addessLine.length > 5) {
    return false;
  }
  return startsWithNumber(addessLine) || endsWithNumber(addessLine);
};

export const Address = ({ instanceNo = '', address }: Props) => {
  return (
    <StyledAddress>
      <span
        id={`address${instanceNo}-addressLine1`}
        className={isHouseNumber(address.addressLine1) ? 'houseNumber' : ''}
      >
        {address.addressLine1}
      </span>
      {address.addressLine2 && (
        <span
          id={`address${instanceNo}-addressLine2`}
          className={
            isHouseNumber(address.addressLine1) ? 'houseNumberFollower' : ''
          }
        >
          {address.addressLine2}
        </span>
      )}
      <span id={`address${instanceNo}-townCity`}>{address.townCity}</span>
      {address.postcode && (
        <span id={`address${instanceNo}-postcode`}>{address.postcode}</span>
      )}
      <span id={`address${instanceNo}-country`}>{address.country}</span>
    </StyledAddress>
  );
};
