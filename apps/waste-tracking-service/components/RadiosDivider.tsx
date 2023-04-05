import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children?: ReactNode,
  testId?: string
}

const StyledRadiosDivider = styled('div')`
  width: 40px;
  margin-bottom: 10px;
  text-align: center;
  @media (min-width: 40.0625em) {
    font-size: 19px;
  }
`;

export const RadiosDivider = ({ children, testId }: Props) => {
  return (
    <StyledRadiosDivider data-testid={testId}>
      {children}
    </StyledRadiosDivider>
  )
}
