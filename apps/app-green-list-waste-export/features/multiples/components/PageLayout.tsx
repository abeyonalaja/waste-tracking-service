import { ReactNode } from 'react';
import Head from 'next/head';
import { Page, GridRow, GridCol } from 'govuk-react';
import { Footer, Header } from 'components';
import { useTranslation } from 'react-i18next';

interface PageLayoutProps {
  breadCrumbs?: ReactNode;
  setWidth?: string;
  children: ReactNode;
}

export function PageLayout({
  breadCrumbs = null,
  setWidth = 'two-thirds',
  children,
}: PageLayoutProps) {
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
        beforeChildren={breadCrumbs ? breadCrumbs : null}
      >
        <GridRow>
          <GridCol setWidth={setWidth}>{children}</GridCol>
        </GridRow>
      </Page>
    </>
  );
}
