import styled from 'styled-components';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import { CompleteFooter, CompleteHeader, BreadcrumbWrap } from '../components';
import React from 'react';

const Paragraph = styled.p`
  margin-bottom: 20px;
  font-size: 19px;
`;

const BreadCrumbs = () => {
  const { t } = useTranslation();
  return (
    <BreadcrumbWrap>
      <GovUK.Breadcrumbs>{t('app.title')}</GovUK.Breadcrumbs>
    </BreadcrumbWrap>
  );
};

export function Index() {
  const { t } = useTranslation();
  return (
    <>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <Paragraph>
          <GovUK.Link href="dashboard" noVisitedState>
            {t('app.channel.title')}
          </GovUK.Link>
        </Paragraph>
      </GovUK.Page>
    </>
  );
}

export default Index;
