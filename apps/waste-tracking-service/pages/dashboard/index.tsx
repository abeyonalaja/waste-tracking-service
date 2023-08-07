import styled from 'styled-components';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  AppLink,
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
} from '../../components';
import { Breadcrumbs, Heading, H2, Page } from 'govuk-react';
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
          <AppLink href="/add-your-own-export-reference" id="your-reference">
            {t('greenListOverview.tellExport.linkOne')}
          </AppLink>
        </Paragraph>
        <Paragraph>
          <AppLink
            href="dashboard/template-submit-export"
            id="template-submit-export"
          >
            {t('greenListOverview.tellExport.linkTwo')}
          </AppLink>
        </Paragraph>
        <Paragraph>
          <AppLink
            href="dashboard/template-submit-csv"
            id="template-submit-csv"
          >
            {t('greenListOverview.tellExport.linkThree')}
          </AppLink>
        </Paragraph>
        <Paragraph>
          <AppLink href="incomplete-annex-7" id="draft-export" noVisitedState>
            {t('greenListOverview.tellExport.linkFour')} (6)
          </AppLink>
        </Paragraph>
        <H2WithTopMargin size="MEDIUM">
          {t('greenListOverview.allExport.heading')}
        </H2WithTopMargin>
        <Paragraph>
          <AppLink href="update-annex-7" id="update-export-with-actual-details">
            {t('greenListOverview.allExport.linkOne')} (6)
          </AppLink>
        </Paragraph>
        <Paragraph>
          <AppLink href="submitted-annex-7" id="check-all-submitted-exports">
            {t('greenListOverview.allExport.linkTwo')} (20)
          </AppLink>
        </Paragraph>
        <H2WithTopMargin size="MEDIUM">
          {t('greenListOverview.templates.heading')}
        </H2WithTopMargin>
        <Paragraph>
          <AppLink
            href="dashboard/create-new-template"
            id="create-new-template"
          >
            {t('greenListOverview.templates.linkOne')}
          </AppLink>
        </Paragraph>
        <Paragraph>
          <AppLink
            href="dashboard/manage-your-template"
            id="manage-your-template"
          >
            {t('greenListOverview.templates.linkTwo')}
          </AppLink>
        </Paragraph>
      </Page>
    </>
  );
}

export default Index;
