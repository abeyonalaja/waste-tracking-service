import { ReactNode } from 'react';
import Head from 'next/head';
import { Page } from 'govuk-react';
import { Footer, Header } from 'components';
import { useTranslation } from 'react-i18next';
import { UploadBreadCrumbs } from './UploadBreadCrumbs';

type PageLayoutProps = {
  uploadId: string;
  children: ReactNode;
};

export function PageLayout({ uploadId, children }: PageLayoutProps) {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t('multiples.guidance.heading')}</title>
      </Head>
      <Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<UploadBreadCrumbs id={uploadId} />}
      >
        {children}
      </Page>
    </>
  );
}
