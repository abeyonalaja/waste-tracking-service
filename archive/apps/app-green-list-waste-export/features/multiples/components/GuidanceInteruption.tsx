import React from 'react';
import Link from 'next/link';
import * as GovUK from 'govuk-react';
import { AppLink, Paragraph } from 'components';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { BLACK, YELLOW, WHITE } from 'govuk-colours';

const MainHeading = styled(GovUK.Heading)`
  color: ${WHITE};
  margin-bottom: 30px;
`;

const WhiteAppLink = styled(Link)`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: underline;
  text-decoration-thickness: max(1px, 0.0625rem);
  text-underline-offset: 0.15em;
  color: ${WHITE};
  font-weight: 400;
  font-size: 19px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    font-size: 24px;
    line-height: 1.3;
  }
  &:hover {
    color: ${WHITE};
    text-decoration-thickness: max(3px, 0.1875rem, 0.12em);
    text-decoration-skip-ink: none;
  }
  &:focus {
    outline: 3px solid rgba(0, 0, 0, 0);
    color: ${BLACK};
    background-color: ${YELLOW};
    box-shadow:
      0 -2px ${YELLOW},
      0 4px #0b0c0c;
    text-decoration: none;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
`;

const FullContainer = styled.section`
  color: ${WHITE};
  background-color: #1d70b8;
  padding: 20px;
  margin-bottom: 50px;
  @media (min-width: 40.0625em) {
    padding: 30px;
  }
`;

const DocumentSection = styled.section`
  @media only screen and (min-width: 769px) {
    width: 66%;
  }
`;

const Thumbnail = styled.div`
  position: relative;
  width: auto;
  margin-bottom: 15px;
  padding: 5px;
  float: left;
`;

const Details = styled.div`
  padding-left: 114px;
  @media (min-width: 40.0625em) {
    padding-top: 16px;
  }
`;

const DetailsParagraph = styled.p`
  line-height: 1.3;
  margin-top: 12px;
  @media (min-width: 40.0625em) {
    margin: 19px 0;
  }
`;

const ButtonContainer = styled.p`
  clear: both;
  padding-top: 1em;
  margin-bottom: 0;
`;

const StyledSvg = styled.svg`
  display: block;
  width: auto;
  max-width: 99px;
  height: 120px;
  border: rgba(11, 12, 12, 0.1);
  outline: 5px solid rgba(11, 12, 12, 0.1);
  background: #fff;
  box-shadow: 0 2px 2px rgba(11, 12, 12, 0.4);
  fill: #b1b4b6;
  stroke: #b1b4b6;
`;

const StyledContinueButton = styled.button`
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
  box-sizing: border-box;
  display: inline-block;
  position: relative;
  width: 100%;
  margin: 0;
  padding: 7px 10px 7px;
  border: 2px solid rgba(0, 0, 0, 0);
  border-radius: 0;
  color: ${BLACK};
  background-color: ${WHITE};
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

interface GuidanceTypeProps {
  acknowledgeGuidance: () => void;
}

export const GuidanceInteruption = ({
  acknowledgeGuidance,
}: GuidanceTypeProps): React.ReactNode => {
  const { t } = useTranslation();

  return (
    <FullContainer>
      <MainHeading size="XL">
        {t('multiples.guidance.bouncePage.title')}
      </MainHeading>
      <Paragraph colour={'white'}>
        {t('multiples.guidance.bouncePage.firstParagraph')}
      </Paragraph>
      <Paragraph colour={'white'}>
        {t('multiples.guidance.bouncePage.secondParagraph')}
      </Paragraph>
      <DocumentSection>
        <Thumbnail>
          <AppLink href={'/multiples/guidance'} target="_blank">
            <GovUK.VisuallyHidden>
              {t('multiples.guidance.document.html.link')}
            </GovUK.VisuallyHidden>
            <StyledSvg
              version="1.1"
              viewBox="0 0 99 140"
              width="99"
              height="140"
              aria-hidden="true"
              color="grey"
            >
              <path
                d="M30,95h57v9H30V95z M30,77v9h39v-9H30z M30,122h48v-9H30V122z M12,68h9v-9h-9V68z M12,104h9v-9h-9V104z M12,86h9v-9h-9V86z M12,122h9v-9h-9V122z M87,12v27H12V12H87z M33,17h-4v8h-6v-8h-4v18h4v-7l6,0v7l4,0V17z M49,17H35l0,3h5v15h4V20l5,0V17z M68,17h-4 l-5,6l-5-6h-4v18h4l0-12l5,6l5-6l0,12h4V17z M81,32h-6V17h-4v18h10V32z M30,68h57v-9H30V68z"
                strokeWidth="0"
              />
            </StyledSvg>{' '}
          </AppLink>
        </Thumbnail>
        <Details>
          <WhiteAppLink href={'/multiples/guidance'} target="_blank">
            {t('multiples.guidance.document.html.link')}
          </WhiteAppLink>
          <DetailsParagraph>
            {t('multiples.guidance.document.html.sub')}
          </DetailsParagraph>
        </Details>
      </DocumentSection>
      <ButtonContainer>
        <StyledContinueButton onClick={acknowledgeGuidance}>
          {t('multiples.guidance.bouncePage.button')}
        </StyledContinueButton>
      </ButtonContainer>
    </FullContainer>
  );
};
