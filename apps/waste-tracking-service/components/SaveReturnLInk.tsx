import React, { FormEvent } from 'react';
import { AppLink } from './AppLink';
import styled from 'styled-components';

interface Props {
  callBack: (e: FormEvent) => void;
  testId?: string;
}

const StyledSaveReturnLink = styled('p')`
  margin-top: 0;
`;

export const SaveReturnLink = ({ callBack, testId }: Props) => {
  return (
    <StyledSaveReturnLink data-testid={testId}>
      <AppLink href="#" noVisitedState onClick={callBack}>
        Save and return to draft
      </AppLink>
    </StyledSaveReturnLink>
  );
};
