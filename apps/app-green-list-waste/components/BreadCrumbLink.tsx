import Link from 'next/link';
import styled from 'styled-components';
import { BLACK, YELLOW } from 'govuk-colours';

const StyledLink = styled(Link)`
  color: ${BLACK};
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-decoration-color: ${BLACK};
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 1px;
  text-size-adjust: 100%;
  text-underline-offset: 2.5247px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  @media (min-width: 40.0625em) {
    font-size: 16px;
    line-height: 1.3;
  }
  &:hover {
    text-decoration-thickness: max(3px, 0.1875rem, 0.12em);
    text-decoration-skip-ink: none;
  }
  &:focus {
    text-decoration-line: none;
    outline: 3px solid rgba(0, 0, 0, 0);
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    background-color: ${YELLOW};
    box-shadow: 0 -2px ${YELLOW}, 0 4px ${BLACK};
  }
  &:visited {
    color: BLACK;
  }
`;

interface BreadCrumbLinkProps {
  href?: string;
  id?: string;
  children: React.ReactNode;
}

export function BreadCrumbLink({ href, children }: BreadCrumbLinkProps) {
  return <StyledLink href={href}>{children}</StyledLink>;
}
