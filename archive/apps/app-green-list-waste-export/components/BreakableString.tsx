import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
}

const BrokenString = styled.span`
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
  display: inline-block;
  max-width: 100%;
`;

export const BreakableString = ({ children }: Props): React.ReactNode => {
  return <BrokenString>{children}</BrokenString>;
};
