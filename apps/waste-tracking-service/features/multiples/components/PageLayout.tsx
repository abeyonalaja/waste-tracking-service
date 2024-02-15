import { ReactNode } from 'react';
import Head from 'next/head';
import { Page } from 'govuk-react';
import { Footer, Header } from 'components';
import { useTranslation } from 'react-i18next';

type PageLayoutProps = {
  breadCrumbs: ReactNode;
  children: ReactNode;
};

export function PageLayout({ breadCrumbs, children }: PageLayoutProps) {
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
        beforeChildren={breadCrumbs}
      >
        {children}
      </Page>
    </>
  );
}
