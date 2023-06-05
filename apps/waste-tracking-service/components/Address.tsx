import React from 'react';
import styled from 'styled-components';

interface Props {
  address: {
    addressLine1: string;
    addressLine2: string;
    townCity: string;
    postcode: string;
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
  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1.32;
    margin-bottom: 20px;
  }
  span {
    display: block;
    &:after {
      content: ',';
    }
    &:last-child:after {
      content: '';
    }
  }
`;

export const Address = ({ address }: Props) => {
  return (
    <StyledAddress>
      <span>{address.addressLine1}</span>
      <span>{address.addressLine2}</span>
      <span>{address.townCity}</span>
      <span>{address.postcode}</span>
      <span>{address.country}</span>
    </StyledAddress>
  );
};
