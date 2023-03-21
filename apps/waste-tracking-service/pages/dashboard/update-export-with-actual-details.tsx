import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, Heading, Main, GridRow, GridCol } from 'govuk-react';
import { CompleteHeader } from '../../components/CompleteHeader';
import { CompleteFooter } from '../../components/CompleteFooter';
import styled from 'styled-components';

export function UpdateWithActualExport() {
  const { t } = useTranslation();

  const BreadCrumbWrap = styled(Main)`
    padding-top: 0;
  `;

  return (
    <div>
      <CompleteHeader />
      <BreadCrumbWrap>
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">{t('app.title')}</Breadcrumbs.Link>
          <Breadcrumbs.Link href="/dashboard">
            {t('app.channel.title')}
          </Breadcrumbs.Link>
          {t('updateExportWithActualDetails.breadcrumb')}
        </Breadcrumbs>
      </BreadCrumbWrap>
      <Main>
        <GridRow>
          <GridCol setWidth="two-thirds">
            <Heading size="MEDIUM" id="template-heading">
              {t('updateExportWithActualDetails.title')}
            </Heading>
          </GridCol>
        </GridRow>
      </Main>
      <CompleteFooter />
    </div>
  );
}

export default UpdateWithActualExport;
