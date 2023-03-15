import styled from 'styled-components';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Heading, Main, GridRow, GridCol } from 'govuk-react';
import { CompleteHeader } from '../../components/CompleteHeader';
import { CompleteFooter } from '../../components/CompleteFooter';

const BreadCrumbWrap = styled(Main)`
  padding-top: 0;
`;


export function SubmitAnExport() {
  const { t } = useTranslation();

  return (
    <div>
      <CompleteHeader />
      
      <BreadCrumbWrap>
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">{t('app.title')}</Breadcrumbs.Link>
          <Breadcrumbs.Link href="/dashboard">
            {t('app.channel.title')}
          </Breadcrumbs.Link>
          <Breadcrumbs.Link href="/dashboard/your-reference">
          {t('yourReference.breadcrumb')}
          </Breadcrumbs.Link>
          {t('exportJourney.submitAnExport.breadcrumb')}
        </Breadcrumbs>
      </BreadCrumbWrap>
      <Main>
        <GridRow>
          <GridCol setWidth="two-thirds">
            <Heading size="LARGE" id="template-heading">
              {t('exportJourney.submitAnExport.title')}
            </Heading>
          </GridCol>
        </GridRow>
      </Main>
      <CompleteFooter />
    </div>
  );
}
export default SubmitAnExport;
