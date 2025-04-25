import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  testId?: string;
}

const StyledBreadcrumbWrap = styled('div')`
  padding-top: 0;
`;

export const BreadcrumbWrap = ({
  children,
  testId,
}: Props): React.ReactNode => {
  return (
    <StyledBreadcrumbWrap data-testid={testId}>{children}</StyledBreadcrumbWrap>
  );
};
