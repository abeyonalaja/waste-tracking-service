import React, { FormEvent } from 'react';
import { AppLink } from './AppLink';
import styled from 'styled-components';

interface Props {
  href?: string | object;
  onClick?: (e: FormEvent) => void;
  testId?: string;
}

const StyledSaveReturnLink = styled('p')`
  margin-top: 0;
`;

export const SaveReturnLink = ({ onClick, href = '#', testId }: Props) => {
  return (
    <StyledSaveReturnLink data-testid={testId}>
      <AppLink href={href} onClick={onClick}>
        Save and return to draft
      </AppLink>
    </StyledSaveReturnLink>
  );
};
