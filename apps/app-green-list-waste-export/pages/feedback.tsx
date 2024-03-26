import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Page, GridRow, GridCol, Heading } from 'govuk-react';
import { Footer, Header } from 'components';
import {
  Error,
  FeedbackBreadCrumbs,
  FeedbackForm,
  SuccessBanner,
} from 'features/feedback';

export default function Feedback() {
  const router = useRouter();
  const { t } = useTranslation();
  const [newWindow, setNewWindow] = useState<boolean>(false);

  // Removes back link if feedback page is opened in new window/tab
  // and links user back to home page rather than navigating back
  useEffect(() => {
    if (typeof window !== 'undefined' && window.history?.length === 1) {
      setNewWindow(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{t('feedback.title')}</title>
      </Head>
      <Page
        id="content"
        header={<Header showPhaseBanner={false} />}
        beforeChildren={<FeedbackBreadCrumbs newWindow={newWindow} />}
        footer={<Footer />}
      >
        <GridRow>
          <GridCol setWidth="two-thirds">
            {router.query.success === 'true' && (
              <SuccessBanner newWindow={newWindow} />
            )}
            {router.query.success === 'false' && (
              <Error newWindow={newWindow} />
            )}
            {router.query.success === undefined && (
              <FeedbackForm>
                <Heading size="LARGE">{t('feedback.title')}</Heading>
              </FeedbackForm>
            )}
          </GridCol>
        </GridRow>
      </Page>
    </>
  );
}

Feedback.auth = true;
