import React, { useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { VisuallyHidden } from 'govuk-react';
import { LINK_COLOUR, BLACK, YELLOW } from 'govuk-colours';
import i18n from 'i18next';
import '../i18n/config';

const LanguageSwitchWrap = styled.div``;

const StyledLink = styled(Link)<{ $isBold?: boolean; disabled?: boolean }>`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: underline;
  text-decoration-thickness: max(1px, 0.0625rem);
  text-underline-offset: 0.1em;
  color: ${LINK_COLOUR};
  font-weight: ${(props) => (props.$isBold ? '700' : '400')};
  font-size: 14px;
  line-height: 1.25;
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
  cursor: ${(props) => (props.disabled ? 'wait' : 'pointer')};
  @media (min-width: 40.0625em) {
    font-size: 14px;
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

const LanguageNav = styled.nav`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: GDS Transport, arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.1428571429;
`;

const LanguageList = styled.ul`
  float: right;
  margin-top: 1em;
  text-align: right;
  list-style: none;
`;

const LanguageListItem = styled.li`
  float: left;
  padding: 0.3em;
  :first-child:after {
    padding-left: 0.7em;
    border-right: 0.09375em solid #0b0c0c;
    content: '';
    display: inline-block;
    height: 1em;
    position: relative;
    top: 0.1875em;
  }
`;

const LanguageListItemCurrent = styled.li`
  float: left;
  padding: 0.3em;
  :first-child:after {
    padding-left: 0.7em;
    border-right: 0.09375em solid #0b0c0c;
    content: '';
    display: inline-block;
    height: 1em;
    position: relative;
    top: 0.1875em;
  }
`;

export const LanguageSwitch = () => {
  const { t } = useTranslation();
  const isLanguagesEnabled =
    process.env.NEXT_PUBLIC_LANGUAGES_ENABLED === 'true';
  const isEnglishActive = i18n.language === 'en';
  const isWelshActive = i18n.language === 'cy';

  const changeLanguage = (e, language) => {
    e.preventDefault();
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  useEffect(() => {
    if (isLanguagesEnabled) {
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage) {
        i18n.changeLanguage(storedLanguage);
      }
    }
  }, [isLanguagesEnabled]);

  return (
    isLanguagesEnabled && (
      <LanguageSwitchWrap id="languangeSwitch">
        <LanguageNav aria-label="{t('language.languageAriaLabel')}">
          {isWelshActive && (
            <LanguageList>
              <LanguageListItem>
                <StyledLink
                  href="/"
                  rel="alternate"
                  onClick={(e) => changeLanguage(e, 'en')}
                >
                  <VisuallyHidden>
                    {t('language.languageMessage')}
                  </VisuallyHidden>
                  <span aria-current={isEnglishActive ? 'true' : 'false'}>
                    {t('language.languageLinkEnglish')}
                  </span>
                </StyledLink>
              </LanguageListItem>
              <LanguageListItemCurrent>
                <span aria-hidden="true">
                  {t('language.languageLinkWelsh')}
                </span>
              </LanguageListItemCurrent>
            </LanguageList>
          )}
          {isEnglishActive && (
            <LanguageList>
              <LanguageListItemCurrent>
                <span aria-current="true">
                  {t('language.languageLinkEnglish')}
                </span>
              </LanguageListItemCurrent>
              <LanguageListItem>
                <StyledLink
                  href="/"
                  rel="alternate"
                  onClick={(e) => changeLanguage(e, 'cy')}
                >
                  <VisuallyHidden>
                    {t('language.languageMessage')}
                  </VisuallyHidden>
                  <span aria-hidden={isWelshActive ? 'false' : 'true'}>
                    {t('language.languageLinkWelsh')}
                  </span>
                </StyledLink>
              </LanguageListItem>
            </LanguageList>
          )}
        </LanguageNav>
      </LanguageSwitchWrap>
    )
  );
};
