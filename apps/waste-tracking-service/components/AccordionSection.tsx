import React, { ReactNode, useEffect } from 'react';

import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Tag } from 'govuk-react';

interface Props {
  title: string;
  children: ReactNode;
  resetToggleAllState?: () => void;
  expandedAll?: boolean;
  id?: string;
  showTag?: boolean;
}

interface ContentProps {
  readonly expanded: boolean;
}

const Heading = styled.h2`
  padding: 0;
  margin: 0;
`;

const HeadingButton = styled.button`
  font-family: 'GDS Transport', arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.1;
  color: #0b0c0c;
  display: block;
  margin-bottom: 0;
  width: 100%;
  padding: 10px 0 0 0;
  border: 0;
  border-top: 1px solid #b1b4b6;
  border-bottom: 10px solid rgba(0, 0, 0, 0);
  background: none;
  text-align: left;
  cursor: pointer;
  position: relative;
  &:active {
    color: #0b0c0c;
    background: none;
  }
  &:focus {
    outline: none;
  }
  &:hover {
    color: #0b0c0c;
    background: #f3f2f1;
  }
  @media (min-width: 40.0625em) {
    font-size: 24px;
    line-height: 1.25;
    padding-bottom: 10px;
  }
`;

const HeadingText = styled.span`
  display: block;
  margin-bottom: 13px;
`;

const Content = styled.div<ContentProps>`
  display: ${(props) => (props.expanded ? 'block' : 'none')};
  padding-top: 15px;
  padding-bottom: 30px;
`;

const Toggle = styled.span`
  font-size: 16px;
  line-height: 1.25;
  font-weight: 400;
  color: #1d70b8;
  button:focus & {
    outline: 3px solid rgba(0, 0, 0, 0);
    color: #0b0c0c;
    background-color: #fd0;
    box-shadow: 0 -2px #fd0, 0 4px #0b0c0c;
    padding-bottom: 3px;
  }
  @media (min-width: 40.0625em) {
    font-size: 19px;
  }
`;

const ToggleTextFocus = styled.span`
  button:focus & {
    outline: 3px solid rgba(0, 0, 0, 0);
    color: #0b0c0c;
    background-color: #fd0;
    box-shadow: 0 -2px #fd0, 0 4px #0b0c0c;
    padding-bottom: 3px;
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
  button:hover & {
    color: #0b0c0c;
  }
`;

const UpdateNeeded = styled(Tag)`
  position: absolute;
  top: 10px;
  right: 0;
`;

export const AccordionSection = ({
  title,
  children,
  resetToggleAllState,
  expandedAll,
  id = 'accordion-section',
  showTag = false,
}: Props) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState<boolean>(true);

  useEffect(() => {
    if (expandedAll !== undefined) {
      setExpanded(expandedAll);
    }
  }, [expandedAll]);

  const toggleSection = () => {
    setExpanded(!expanded);
    if (resetToggleAllState !== undefined) {
      resetToggleAllState();
    }
  };

  return (
    <>
      <Heading id={`${id}-heading`}>
        <HeadingButton
          onClick={toggleSection}
          aria-expanded={expanded}
          id={`${id}-button`}
        >
          <HeadingText id={`${id}-heading-text`}>
            <ToggleTextFocus>{title}</ToggleTextFocus>
          </HeadingText>
          <Toggle>
            <Arrow expanded={expanded} id={`${id}-arrow`} />
            <ToggleText id={`${id}-toggle-text`}>
              {expanded ? t('actions.hide') : t('actions.show')} {t('section')}
            </ToggleText>
          </Toggle>
          {showTag && (
            <UpdateNeeded tint="BLUE">{t('status.actualNeeded')}</UpdateNeeded>
          )}
        </HeadingButton>
      </Heading>
      <Content expanded={expanded} id={`${id}-content`}>
        {children}
      </Content>
    </>
  );
};
