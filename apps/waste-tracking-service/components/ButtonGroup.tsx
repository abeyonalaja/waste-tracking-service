import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  testId?: string;
}

const Group = styled('div')`
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  * {
    margin-bottom: 15px;
  }
  @media (min-width: 40.0625em) {
    margin-bottom: 15px;
    margin-right: -15px;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    * {
      margin-right: 15px;
      margin-bottom: 15px;
    }
  }
`;

export const ButtonGroup = ({ children, testId }: Props) => {
  return <Group data-testid={testId}>{children}</Group>;
};
