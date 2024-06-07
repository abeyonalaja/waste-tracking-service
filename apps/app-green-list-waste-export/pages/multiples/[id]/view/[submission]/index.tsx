import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';

import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  BreadcrumbWrap,
  ButtonGroup,
  Paragraph,
  SaveReturnButton,
  DownloadPDFLink,
  SubmittedSummary,
  AppLink,
} from 'components';
import useApiConfig from 'utils/useApiConfig';
import styled from 'styled-components';
import axios from 'axios';
import { Loader } from 'features/multiples';
import { WarningText } from 'govuk-react';

const StyledWarningText = styled(WarningText)`
  margin-bottom: 30px;
`;

const ActionHeader = styled(GovUK.H2)`
  border-top: 2px solid #1d70b8;
  padding-top: 1em;
  margin-bottom: 0.5em;
`;

export function ViewRecord(): React.ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();

  async function getSubmission() {
    const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${router.query.submission}?submitted=true`;
    const headers = {
      Authorization: apiConfig.Authorization,
    };
    return await axios.get(url, { headers });
  }

  const { isPending, data, error } = useQuery({
    queryKey: ['single', router.query.submission],
    queryFn: getSubmission,
    staleTime: 5 * (60 * 1000),

    enabled: !!router.query.submission,
  });
  if (error) {
    router.push('/404');
  }

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={() => {
            router.push({
              pathname: `/multiples/${router.query.id}/submitted`,
              query: { sort: router.query.sort, page: router.query.page },
            });
          }}
        >
          {t('back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('multiples.submitted.submittedId.caption')}</title>
      </Head>

      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        {isPending && <Loader />}
        {data && (
          <>
            <GovUK.GridRow>
              <GovUK.GridCol setWidth="two-thirds">
                <GovUK.Caption id="my-reference">
                  {t('multiples.submitted.submittedId.caption')}
                </GovUK.Caption>
                <GovUK.Heading size="LARGE" id="template-heading">
                  {t('exportJourney.submittedView.title')}:{' '}
                  {data.data.submissionDeclaration.transactionId}
                </GovUK.Heading>

                {data.data.submissionState.status ===
                'SubmittedWithEstimates' ? (
                  <>
                    <Paragraph mb={5}>
                      {t('multiples.submitted.submittedId.download.hint')}
                    </Paragraph>
                    <StyledWarningText>
                      {t('multiples.submitted.submittedId.estimates.warning')}
                    </StyledWarningText>
                  </>
                ) : (
                  <Paragraph mb={10}>
                    {t('multiples.submitted.submittedId.download.hint')}
                  </Paragraph>
                )}

                <SubmittedSummary
                  data={data.data}
                  showChangeLinks={false}
                  apiConfig={apiConfig}
                  estimate={
                    data.data.submissionState.status ===
                    'SubmittedWithEstimates'
                      ? true
                      : false
                  }
                  showEstimateLinks={false}
                  isMultiple={true}
                />
                <ButtonGroup>
                  <SaveReturnButton
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push({
                        pathname: `/multiples/${router.query.id}/submitted`,
                        query: {
                          sort: router.query.sort,
                          page: router.query.page,
                        },
                      });
                    }}
                  >
                    {t('exportJourney.submittedView.button')}
                  </SaveReturnButton>
                </ButtonGroup>
              </GovUK.GridCol>
              <GovUK.GridCol setWidth="one-third">
                <ActionHeader size="S">{t('actions')}</ActionHeader>
                <DownloadPDFLink
                  submissionId={String(router.query.submission)}
                  transactionId={data.data.submissionDeclaration.transactionId}
                  data={data.data}
                >
                  {t('exportJourney.submittedView.downloadPDF')}
                </DownloadPDFLink>
                <Paragraph>
                  {t('exportJourney.submittedView.downloadPDFinfo')}
                </Paragraph>
                <AppLink
                  href={{
                    pathname: `/templates/create-from-record`,
                    query: {
                      id: router.query.submission,
                      context: 'view',
                    },
                  }}
                >
                  {t('templates.create.fromRecord.linkUse')}
                </AppLink>
              </GovUK.GridCol>
            </GovUK.GridRow>
          </>
        )}
      </GovUK.Page>
    </>
  );
}

export default ViewRecord;
ViewRecord.auth = true;
