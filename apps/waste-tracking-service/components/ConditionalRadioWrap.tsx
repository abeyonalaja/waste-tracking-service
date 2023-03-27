import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode,
  testId?: string
}

const StyledConditionalRadioWrap = styled.div`
  margin-bottom: 15px;
  margin-left: 18px;
  padding-left: 33px;
  border-left: 4px solid #b1b4b6;
`;

export const ConditionalRadioWrap = ({ children, testId }: Props) => {
  return (
      <StyledConditionalRadioWrap data-testid={testId}>
        {children}
      </StyledConditionalRadioWrap>
  )
}
