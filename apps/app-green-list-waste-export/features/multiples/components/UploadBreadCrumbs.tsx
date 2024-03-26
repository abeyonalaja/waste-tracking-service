import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from 'govuk-react';
import { BreadCrumbLink, BreadcrumbWrap } from 'components';

export function UploadBreadCrumbs() {
  const { t } = useTranslation();

  return (
    <BreadcrumbWrap>
      <Breadcrumbs>
        <BreadCrumbLink href="/">{t('app.parentTitle')}</BreadCrumbLink>
        <BreadCrumbLink href="/">{t('app.title')}</BreadCrumbLink>
        {t('multiples.guidance.heading')}
      </Breadcrumbs>
    </BreadcrumbWrap>
  );
}
