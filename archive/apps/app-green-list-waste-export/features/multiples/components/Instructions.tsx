import React from 'react';
import * as GovUK from 'govuk-react';
import { AppLink } from 'components';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const DocumentSection = styled.section`
  font-size: 1.1875rem;
  line-height: 1.3157894737;
  margin-bottom: 30px !important;
  position: relative;
  display: block;
  overflow: hidden;
`;

const Thumbnail = styled.div`
  position: relative;
  width: auto;
  margin-right: 25px;
  margin-bottom: 15px;
  padding: 5px;
  float: left;
`;

const Details = styled.div`
  padding-left: 134px;
`;

const DetailsHeading = styled.h2`
  font-size: 1.6875rem;
  line-height: 1.1111111111;
  font-weight: 400;
`;

const DetailsParagraph = styled.p`
  line-height: 1.3157894737;
`;

const StyledSvg = styled.svg`
  display: block;
  width: auto;
  max-width: 99px;
  height: 140px;
  border: rgba(11, 12, 12, 0.1);
  outline: 5px solid rgba(11, 12, 12, 0.1);
  background: #fff;
  box-shadow: 0 2px 2px rgba(11, 12, 12, 0.4);
  fill: #b1b4b6;
  stroke: #b1b4b6;
`;

export function Instructions(): React.ReactNode {
  const { t } = useTranslation();

  return (
    <>
      <GovUK.Heading size="L">{t('multiples.guidance.heading')}</GovUK.Heading>
      <GovUK.H2 size="MEDIUM">{t('multiples.guidance.listHeading')}</GovUK.H2>
      <GovUK.OrderedList>
        <GovUK.ListItem>
          {t('multiples.guidance.listItemOne.start')}{' '}
          <AppLink href={'/multiples/guidance'} target="_blank">
            {t('multiples.guidance.listItemOne.link')}
          </AppLink>{' '}
          {t('multiples.guidance.listItemOne.end')}
        </GovUK.ListItem>
        <GovUK.ListItem>
          {t('multiples.guidance.listItemTwo.start')}{' '}
          <AppLink href={'/downloads/Multiples CSV template.csv'}>
            {t('multiples.guidance.listItemTwo.link')}
          </AppLink>{' '}
          {t('multiples.guidance.listItemTwo.end')}
        </GovUK.ListItem>
        <GovUK.ListItem>
          {t('multiples.guidance.listItemThree')}{' '}
        </GovUK.ListItem>
        <GovUK.ListItem>{t('multiples.guidance.listItemFour')}</GovUK.ListItem>
        <GovUK.ListItem>{t('multiples.guidance.listItemFive')}</GovUK.ListItem>
      </GovUK.OrderedList>
      <GovUK.SectionBreak level="LARGE" visible />
      <GovUK.H2 size="MEDIUM">
        {t('multiples.guidance.documentHeading')}
      </GovUK.H2>

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
          <AppLink href={'/multiples/guidance'} target="_blank">
            {t('multiples.guidance.document.html.link')}
          </AppLink>
          <DetailsParagraph>
            {t('multiples.guidance.document.html.sub')}
          </DetailsParagraph>
        </Details>
      </DocumentSection>
      <DocumentSection>
        <Thumbnail>
          <AppLink href={'/downloads/Multiples CSV template.csv'}>
            <GovUK.VisuallyHidden>
              {t('multiples.guidance.document.csv.heading')}
            </GovUK.VisuallyHidden>
            <StyledSvg
              version="1.1"
              viewBox="0 0 99 140"
              width="99"
              height="140"
              aria-hidden="true"
            >
              <path
                d="M12 12h75v27H12zm0 47h18.75v63H12zm55 2v59H51V61h16m2-2H49v63h20V59z"
                strokeWidth="0"
              />
              <path
                d="M49 61.05V120H32.8V61.05H49m2-2H30.75v63H51V59zm34 2V120H69.05V61.05H85m2-2H67v63h20V59z"
                strokeWidth="0"
              />
              <path
                d="M30 68.5h56.5M30 77.34h56.5M30 112.7h56.5M30 95.02h56.5M30 86.18h56.5M30 103.86h56.5"
                fill="none"
                strokeMiterlimit="10"
                strokeWidth="2"
              />
            </StyledSvg>
          </AppLink>
        </Thumbnail>
        <Details>
          <DetailsHeading>
            {t('multiples.guidance.document.csv.heading')}
          </DetailsHeading>
          <GovUK.HintText>
            {t('multiples.guidance.document.csv.sub')}
          </GovUK.HintText>
          <DetailsParagraph>
            <AppLink href={'/downloads/Multiples CSV template.csv'}>
              {t('multiples.guidance.document.csv.link')}
            </AppLink>
          </DetailsParagraph>
        </Details>
      </DocumentSection>
      <GovUK.SectionBreak level="LARGE" visible />
    </>
  );
}
