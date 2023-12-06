import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import {
  AppLink,
  Card,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
} from 'components';
import React, { useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useSubmissionContext } from 'contexts';

const DocumentSection = styled.section`
  font-size: 1.1875rem;
  line-height: 1.3157894737;
  margin-bottom: 30px !important;
  position: relative;
  display: block;
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
  font-size: 1.1875rem;
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

const BreadCrumbs = () => {
  const { t } = useTranslation();
  return (
    <BreadcrumbWrap>
      <GovUK.Breadcrumbs>
        <GovUK.Breadcrumbs.Link href="/">
          {t('app.parentTitle')}
        </GovUK.Breadcrumbs.Link>
        <GovUK.Breadcrumbs.Link>{t('app.title')}</GovUK.Breadcrumbs.Link>
      </GovUK.Breadcrumbs>
    </BreadcrumbWrap>
  );
};

export function HowToCreateCSV() {
  const { setSubmission } = useSubmissionContext();

  useEffect(() => {
    setSubmission({});
  }, [setSubmission]);

  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>
          Export green list waste: how to submit multiple exports from a CSV
          file
        </title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.Heading size="L">
          Export green list waste: how to submit multiple exports from a CSV
          file
        </GovUK.Heading>
      </GovUK.Page>
    </>
  );
}

export default HowToCreateCSV;
