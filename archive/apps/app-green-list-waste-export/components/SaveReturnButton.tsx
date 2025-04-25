import React from 'react';
import styled from 'styled-components';
import { BLACK, GREY_3, YELLOW } from 'govuk-colours';
import { useTranslation } from 'react-i18next';

interface Props {
  href?: string | object;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  id?: string;
  testId?: string;
  children?: string;
}

const StyledLinkAsButton = styled('a')`
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  width: 100%;
  margin: 0 0 22px 0;
  padding: 7px 10px 7px;
  border: 2px solid rgba(0, 0, 0, 0);
  border-radius: 0;
  color: ${BLACK};
  background-color: ${GREY_3};
  box-shadow: 0 2px 0 #929191;
  text-align: center;
  vertical-align: top;
  cursor: pointer;
  -webkit-appearance: none;
  text-decoration: none;
  &:hover {
    background: #dbdad9;
  }
  &:active {
    top: 2px;
  }
  &:focus {
    border-color: ${YELLOW};
    outline: 3px solid rgba(0, 0, 0, 0);
    box-shadow: inset 0 0 0 1px ${YELLOW};
  }
  &:focus:not(:active):not(:hover) {
    border-color: ${YELLOW};
    color: ${BLACK};
    background-color: ${YELLOW};
    box-shadow: 0 2px 0 ${BLACK};
  }
  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1;
    width: auto;
    margin-bottom: 15px;
  }
`;

export const SaveReturnButton = ({
  onClick,
  id,
  testId,
  children,
}: Props): React.ReactNode => {
  const { t } = useTranslation();
  return (
    <StyledLinkAsButton
      role="button"
      href="#"
      id={id}
      onClick={onClick}
      data-testid={testId}
    >
      {children === undefined ? t('saveReturnButton') : children}
    </StyledLinkAsButton>
  );
};
