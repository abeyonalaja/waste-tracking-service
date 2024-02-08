import React, { ReactNode } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { LINK_COLOUR, BLACK, YELLOW, BUTTON_COLOUR, RED } from 'govuk-colours';

interface Colour {
  default: string;
  hover: string;
}

interface Props {
  href: string | object;
  isBold?: boolean;
  colour?: string;
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
  $colours: Colour;
}>`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: underline;
  text-decoration-thickness: max(1px, 0.0625rem);
  text-underline-offset: 0.15em;
  color: ${(props) => props.$colours.default};
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
    color: ${(props) => props.$colours.hover};
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
  colour = 'blue',
  id,
  children,
  onClick,
  testId,
  rel,
  disabled,
  target,
}: Props) => {
  const getColour = (colour: string) => {
    if (colour === 'red') {
      return {
        default: RED,
        hover: '#942514',
      };
    }
    if (colour === 'green') {
      return {
        default: BUTTON_COLOUR,
        hover: '#004e2a',
      };
    }
    if (colour === 'white') {
      return {
        default: '#fff',
        hover: '#ccc',
      };
    }
    return {
      default: LINK_COLOUR,
      hover: '#003078',
    };
  };

  return (
    <StyledLink
      href={href}
      id={id}
      onClick={onClick}
      data-testid={testId}
      $isBold={isBold}
      $colours={getColour(colour)}
      disabled={disabled}
      target={target}
      rel={rel}
    >
      {children}
    </StyledLink>
  );
};
