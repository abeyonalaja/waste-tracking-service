import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
  showAll?: boolean;
  expandedAll?: boolean;
  id?: string;
  onToggleShowAll?: () => void;
}

interface ContentProps {
  readonly expanded: boolean;
}

const AccordionWrap = styled.div`
  border-bottom: 1px solid #b1b4b6;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  font-family: 'GDS Transport', arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  position: relative;
  z-index: 1;
  margin-bottom: 9px;
  padding: 5px 2px 5px 0;
  border-width: 0;
  color: #1d70b8;
  background: none;
  cursor: pointer;
  -webkit-appearance: none;
  &:active {
    color: #0b0c0c;
    background: none;
  }
  &:hover {
    color: #0b0c0c;
    background: #f3f2f1;
  }
  &:focus {
    outline: 3px solid rgba(0, 0, 0, 0);
    color: #0b0c0c;
    background-color: #fd0;
    box-shadow: 0 -2px #fd0, 0 4px #0b0c0c;
    text-decoration: none;
  }

  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1.25;
    padding-bottom: 10px;
  }
`;

const Arrow = styled.span<ContentProps>`
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  border: 0.0625rem solid;
  border-radius: 50%;
  vertical-align: middle;
  transform: ${(props) => (props.expanded ? 'rotate(0deg)' : 'rotate(180deg)')};
  &:after {
    content: '';
    box-sizing: border-box;
    display: block;
    position: absolute;
    bottom: 0.3125rem;
    left: 0.375rem;
    width: 0.375rem;
    height: 0.375rem;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    border-top: 0.125rem solid;
    border-right: 0.125rem solid;
  }
  button:hover & {
    background: #0b0c0c;
    color: #0b0c0c;
    &:after {
      color: #f3f2f1;
    }
  }
  button:focus & {
    background: #0b0c0c;
    color: #0b0c0c;
    &:after {
      color: #fd0;
    }
  }
`;

const ToggleText = styled.span`
  margin-left: 5px;
  vertical-align: middle;
`;

export const Accordion = ({
  children,
  showAll = false,
  expandedAll,
  id = 'accordion',
  onToggleShowAll,
}: Props) => {
  const { t } = useTranslation();
  return (
    <AccordionWrap id={id}>
      {showAll && (
        <Button onClick={onToggleShowAll} id={`${id}-button`}>
          <Arrow expanded={expandedAll} id={`${id}-arrow`} />
          <ToggleText id={`${id}-toggle-all-text`}>
            {expandedAll ? t('actions.hide') : t('actions.show')}{' '}
            {t('allSections')}
          </ToggleText>
        </Button>
      )}
      {children}
    </AccordionWrap>
  );
};
