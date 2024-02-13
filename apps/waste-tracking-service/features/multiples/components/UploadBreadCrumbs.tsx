import { useTranslation } from 'react-i18next';
import { Breadcrumbs } from 'govuk-react';
import { BreadcrumbWrap } from 'components';

type BreadCrumbsProps = {
  id: string;
};

export const UploadBreadCrumbs = ({ id }: BreadCrumbsProps) => {
  const { t } = useTranslation();
  if (id) {
    return;
  } else {
    return (
      <BreadcrumbWrap>
        <Breadcrumbs>
          <Breadcrumbs.Link href="/">{t('app.parentTitle')}</Breadcrumbs.Link>
          <Breadcrumbs.Link href="/export">{t('app.title')}</Breadcrumbs.Link>
          {t('multiples.guidance.heading')}
        </Breadcrumbs>
      </BreadcrumbWrap>
    );
  }
};
