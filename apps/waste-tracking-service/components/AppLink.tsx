import React, { FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

interface Props {
  href: string | object;
  id?: string;
  noVisitedState?: boolean;
  onClick?: (e: FormEvent) => void;
  children: ReactNode;
  testId?: string;
}

const StyledLink = styled(Link)`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: underline;
  text-decoration-thickness: max(1px, 0.0625rem);
  text-underline-offset: 0.1em;
  color: #1d70b8;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1.3;
  }
  &:hover {
    color: #003078;
    text-decoration-thickness: max(3px, 0.1875rem, 0.12em);
    text-decoration-skip-ink: none;
  }
  &:focus {
    outline: 3px solid rgba(0, 0, 0, 0);
    color: #0b0c0c;
    background-color: #fd0;
    box-shadow: 0 -2px #fd0, 0 4px #0b0c0c;
    text-decoration: none;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
`;

export const AppLink = ({ href, id, children, onClick, testId }: Props) => {
  return (
    <StyledLink href={href} id={id} onClick={onClick} data-testid={testId}>
      {children}
    </StyledLink>
  );
};
