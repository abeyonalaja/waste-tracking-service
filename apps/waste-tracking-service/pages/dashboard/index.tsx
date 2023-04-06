import styled from 'styled-components';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
} from '../../components';
import { Breadcrumbs, Heading, Link, H2, Page } from 'govuk-react';
import React from 'react';

const H2WithTopMargin = styled(H2)`
  margin-top: 50px;
`;

const Paragraph = styled.p`
  margin-bottom: 20px;
  font-size: 19px;
`;

const BreadCrumbs = () => {
  const { t } = useTranslation();
  return (
    <BreadcrumbWrap>
      <Breadcrumbs>
        <Breadcrumbs.Link href="/">{t('app.title')}</Breadcrumbs.Link>
        {t('app.channel.title')}
      </Breadcrumbs>
    </BreadcrumbWrap>
  );
};

export function Index() {
  const { t } = useTranslation();
  return (
    <>
      <Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <Heading size="XLARGE">{t('greenListOverview.heading')}</Heading>
        <H2 size="MEDIUM">{t('greenListOverview.tellExport.heading')}</H2>
        <Paragraph>
          <Link
            href="/add-your-own-export-reference"
            id="your-reference"
            noVisitedState
          >
            {t('greenListOverview.tellExport.linkOne')}
          </Link>
        </Paragraph>
        <Paragraph>
          <Link
            href="dashboard/template-submit-export"
            id="template-submit-export"
            noVisitedState
          >
            {t('greenListOverview.tellExport.linkTwo')}
          </Link>
        </Paragraph>
        <Paragraph>
          <Link
            href="dashboard/template-submit-csv"
            id="template-submit-csv"
            noVisitedState
          >
            {t('greenListOverview.tellExport.linkThree')}
          </Link>
        </Paragraph>
        <Paragraph>
          <Link href="dashboard/draft-export" id="draft-export" noVisitedState>
            {t('greenListOverview.tellExport.linkFour')} (6)
          </Link>
        </Paragraph>
        <H2WithTopMargin size="MEDIUM">
          {t('greenListOverview.allExport.heading')}
        </H2WithTopMargin>
        <Paragraph>
          <Link
            href="dashboard/update-export-with-actual-details"
            id="update-export-with-actual-details"
            noVisitedState
          >
            {t('greenListOverview.allExport.linkOne')} (6)
          </Link>
        </Paragraph>
        <Paragraph>
          <Link
            href="dashboard/check-all-submitted-exports"
            id="check-all-submitted-exports"
            noVisitedState
          >
            {t('greenListOverview.allExport.linkTwo')} (20)
          </Link>
        </Paragraph>
        <H2WithTopMargin size="MEDIUM">
          {t('greenListOverview.templates.heading')}
        </H2WithTopMargin>
        <Paragraph>
          <Link
            href="dashboard/create-new-template"
            id="create-new-template"
            noVisitedState
          >
            {t('greenListOverview.templates.linkOne')}
          </Link>
        </Paragraph>
        <Paragraph>
          <Link
            href="dashboard/manage-your-template"
            id="manage-your-template"
            noVisitedState
          >
            {t('greenListOverview.templates.linkTwo')}
          </Link>
        </Paragraph>
      </Page>
    </>
  );
}

export default Index;
