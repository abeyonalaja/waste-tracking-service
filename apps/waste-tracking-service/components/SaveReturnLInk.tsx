import React, { FormEvent } from 'react';
import { Link } from 'govuk-react';
import styled from 'styled-components';

interface Props {
  callBack: (e: FormEvent) => void;
  testId?: string;
}

const StyledSaveReturnLink = styled('p')`
  font-size: 16px;
  margin-top: 0;
  @media (min-width: 40.0625em) {
    font-size: 19px;
  }
`;

const StyledLink = styled(Link)``;

export const SaveReturnLink = ({ callBack, testId }: Props) => {
  return (
    <StyledSaveReturnLink data-testid={testId}>
      <StyledLink href="#" noVisitedState onClick={callBack}>
        Save and return to draft
      </StyledLink>
    </StyledSaveReturnLink>
  );
};
