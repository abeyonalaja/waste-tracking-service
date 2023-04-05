import styled from 'styled-components';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import { CompleteHeader } from '../../components/CompleteHeader';
import { CompleteFooter } from '../../components/CompleteFooter';

import { Breadcrumbs, Heading, Main, Link, H2 } from 'govuk-react';

const BreadCrumbWrap = styled(Main)`
  padding-top: 0;
`;

const H2WithTopMargin = styled(H2)`
  margin-top: 50px;
`;

const Paragraph = styled.div`
  margin-bottom: 20px;
  font-size: 19px;
`;

export function Index() {
  const { t } = useTranslation();

  return (
    <>
      <CompleteHeader />
      <BreadCrumbWrap>
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">{t('app.title')}</Breadcrumbs.Link>
          {t('app.channel.title')}
        </Breadcrumbs>
      </BreadCrumbWrap>

      <Main>
        <Heading size="XLARGE" role="heading">
          {t('greenListOverview.heading')}
        </Heading>

        <H2 size="MEDIUM">{t('greenListOverview.tellExport.heading')}</H2>

        <Paragraph>
          <Link href="/add-your-own-export-reference" id="your-reference" noVisitedState>
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
          <Link href="dashboard/template-submit-csv" id="template-submit-csv" noVisitedState>
            {t('greenListOverview.tellExport.linkThree')}
          </Link>
        </Paragraph>
        <Paragraph>
          <Link href="dashboard/draft-export" id="draft-export" noVisitedState>
            {t('greenListOverview.tellExport.linkFour')} (6)
          </Link>
        </Paragraph>

        <H2WithTopMargin size="MEDIUM">{t('greenListOverview.allExport.heading')}</H2WithTopMargin>

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
        <H2WithTopMargin size="MEDIUM">{t('greenListOverview.templates.heading')}</H2WithTopMargin>
        <Paragraph>
          <Link href="dashboard/create-new-template" id="create-new-template" noVisitedState>
            {t('greenListOverview.templates.linkOne')}
          </Link>
        </Paragraph>
        <Paragraph>
          <Link href="dashboard/manage-your-template" id="manage-your-template" noVisitedState>
            {t('greenListOverview.templates.linkTwo')}
          </Link>
        </Paragraph>
      </Main>

      <CompleteFooter />
    </>
  );
}

export default Index;
