import React, { ReactNode } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { LINK_COLOUR, BLACK, YELLOW, BUTTON_COLOUR } from 'govuk-colours';

interface Props {
  href: string | object;
  isBold?: boolean;
  isGreen?: boolean;
  id?: string;
  noVisitedState?: boolean;
  onClick?: (e) => void;
  children: ReactNode;
  testId?: string;
  rel?: string;
  disabled?: boolean;
  target?: string;
}

const StyledLink = styled(Link)<{
  $isBold?: boolean;
  disabled?: boolean;
  $isGreen: boolean;
}>`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: underline;
  text-decoration-thickness: max(1px, 0.0625rem);
  text-underline-offset: 0.15em;
  color: ${(props) => (props.$isGreen ? BUTTON_COLOUR : LINK_COLOUR)};
  font-weight: ${(props) => (props.$isBold ? '700' : '400')};
  font-size: 16px;
  line-height: 1.25;
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
  cursor: ${(props) => (props.disabled ? 'wait' : 'pointer')};
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
    color: ${BLACK};
    background-color: ${YELLOW};
    box-shadow: 0 -2px ${YELLOW}, 0 4px #0b0c0c;
    text-decoration: none;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
`;

export const AppLink = ({
  href,
  isBold,
  isGreen,
  id,
  children,
  onClick,
  testId,
  rel,
  disabled,
  target,
}: Props) => {
  return (
    <StyledLink
      href={href}
      id={id}
      onClick={onClick}
      data-testid={testId}
      $isBold={isBold}
      $isGreen={isGreen}
      disabled={disabled}
      target={target}
      rel={rel}
    >
      {children}
    </StyledLink>
  );
};
