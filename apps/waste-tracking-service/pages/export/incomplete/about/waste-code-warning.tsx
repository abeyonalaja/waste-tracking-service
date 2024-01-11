import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import { useTranslation } from 'react-i18next';

import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  ButtonGroup,
  Paragraph,
  SaveReturnButton,
} from 'components';

const WasteCodeWarning = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            history.back();
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>
          {' '}
          {t('exportJourney.checkAnswers.changeWasteCode.pageTitle')}
        </title>
      </Head>

      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            <GovUK.Caption id="my-reference">
              {t('exportJourney.checkAnswers.caption')}
            </GovUK.Caption>

            <GovUK.Heading size="LARGE" id="template-heading">
              {t('exportJourney.checkAnswers.changeWasteCode.heading')}
            </GovUK.Heading>

            <Paragraph>
              {t('exportJourney.checkAnswers.changeWasteCode.paragraph')}
            </Paragraph>
          </GovUK.GridCol>
        </GovUK.GridRow>

        <ButtonGroup>
          <GovUK.Button
            id="saveButton"
            onClick={() =>
              router.push({
                pathname: `/export/incomplete/about/waste-code`,
                query: { id },
              })
            }
          >
            {t('exportJourney.checkAnswers.changeWasteCode.confirmButton')}
          </GovUK.Button>
          <SaveReturnButton
            onClick={() =>
              router.push({
                pathname: `/export/incomplete/tasklist`,
                query: { id },
              })
            }
          >
            {t('exportJourney.checkAnswers.returnButton')}
          </SaveReturnButton>
        </ButtonGroup>
      </GovUK.Page>
    </>
  );
};

export default WasteCodeWarning;
