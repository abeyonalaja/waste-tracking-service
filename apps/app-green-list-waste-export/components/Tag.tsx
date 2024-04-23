import React from 'react';
import styled from 'styled-components';

interface Props {
  children: string;
  colour?:
    | 'grey'
    | 'green'
    | 'turquoise'
    | 'blue'
    | 'light-blue'
    | 'purple'
    | 'pink'
    | 'red'
    | 'orange'
    | 'yellow';
  testId?: string;
}

const TagStyled = styled('strong')`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  display: inline-block;
  max-width: 160px;
  margin-top: -2px;
  margin-bottom: -3px;
  padding: 2px 8px 3px;
  color: #0c2d4a;
  background-color: #bbd4ea;
  text-decoration: none;
  overflow-wrap: break-word;
  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1.3;
  }
`;

export const Tag = ({ children, testId }: Props) => {
  return <TagStyled data-testid={testId}>{children}</TagStyled>;
};
