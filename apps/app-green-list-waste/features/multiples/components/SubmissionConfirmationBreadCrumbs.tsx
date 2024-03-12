import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from 'govuk-react';
import { BreadcrumbWrap } from 'components';

export function SubmissionConfirmationBreadCrumbs() {
  const { t } = useTranslation();

  return (
    <BreadcrumbWrap>
      <Breadcrumbs>
        <Breadcrumbs.Link href="/">{t('app.parentTitle')}</Breadcrumbs.Link>
        <Breadcrumbs.Link href="/export">{t('app.title')}</Breadcrumbs.Link>
      </Breadcrumbs>
    </BreadcrumbWrap>
  );
}
