import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Main } from 'govuk-react';

interface Props {
  children: ReactNode,
  testId?: string
}

const StyledBreadcrumbWrap = styled(Main)`
  padding-top: 0;
`;

export const BreadcrumbWrap = ({ children, testId }: Props) => {
  return (
    <StyledBreadcrumbWrap data-testid={testId}>
      {children}
    </StyledBreadcrumbWrap>
  )
}
