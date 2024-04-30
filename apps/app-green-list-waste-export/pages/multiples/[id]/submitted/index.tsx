import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import useApiConfig from 'utils/useApiConfig';
import * as GovUK from 'govuk-react';
import {
  BreadcrumbWrap,
  BreadCrumbLink,
  DownloadMultiplePDFLink,
} from 'components';
import {
  PageLayout,
  SubmittedTable,
  Loader,
  Transaction,
  Pagination,
  getValidationResult,
  sortTransactions,
} from 'features/multiples';
import useSafePush from 'utils/useRouterChange';
import React from 'react';
import styled from 'styled-components';

function SubmittedBreadCrumbs() {
  const { t } = useTranslation();
  return (
    <BreadcrumbWrap>
      <GovUK.Breadcrumbs>
        <BreadCrumbLink href="../../">
          {t('multiples.submitted.breadCrumbOne')}
        </BreadCrumbLink>
        <BreadCrumbLink href="/">
          {t('multiples.submitted.breadCrumbTwo')}
        </BreadCrumbLink>
      </GovUK.Breadcrumbs>
    </BreadcrumbWrap>
  );
}

const ActionHeader = styled(GovUK.H2)`
  border-top: 2px solid #1d70b8;
  padding-top: 1em;
  margin-bottom: 0.5em;
`;

export default function Submitted() {
  const { t } = useTranslation();
  const router = useRouter();
  const { safePush } = useSafePush();
  const apiConfig = useApiConfig();

  const { isPending, data, error } = useQuery({
    queryKey: ['multiples', router.query.id],
    queryFn: async () => {
      return await getValidationResult(router.query.id as string);
    },
    staleTime: 5 * (60 * 1000),
    gcTime: 10 * (60 * 1000),
    refetchOnWindowFocus: false,
    enabled: !!router.query.id,
  });

  let allTransactions: Transaction[];
  let displayedTransactions: Transaction[];
  let pageNumber: number;
  let totalPages: number;
  let sortOrder: string | string[];

  if (data) {
    allTransactions = data.data.state.submissions;
    sortOrder = router.query.sort;
    pageNumber = Number(router.query.page);
    totalPages = Math.ceil(allTransactions.length / 10);

    if (sortOrder !== 'asc' && sortOrder !== 'desc') {
      safePush(`/multiples/${router.query.id}/submitted?sort=asc&page=1`);
    }

    if (pageNumber > totalPages || Number.isNaN(pageNumber)) {
      safePush(`/multiples/${router.query.id}/submitted?sort=asc&page=1`);
    }

    if (sortOrder === 'asc') {
      allTransactions = sortTransactions(allTransactions, 'asc');
    } else {
      allTransactions = sortTransactions(allTransactions, 'desc');
    }

    displayedTransactions = allTransactions.slice(
      (pageNumber - 1) * 10,
      pageNumber * 10
    );
  }

  if (error) {
    router.push('/404');
  }

  return (
    <PageLayout breadCrumbs={<SubmittedBreadCrumbs />} setWidth="full">
      <GovUK.GridRow mb={6}>
        <GovUK.GridCol setWidth={'two-thirds'}>
          <GovUK.Heading size="L">
            {t('multiples.submitted.heading')}
          </GovUK.Heading>
        </GovUK.GridCol>
        {data && (
          <GovUK.GridCol setWidth={'one-third'}>
            <ActionHeader size="S">{t('actions')}</ActionHeader>
            <GovUK.UnorderedList listStyleType={'none'}>
              <GovUK.ListItem>
                <DownloadMultiplePDFLink
                  submissionId={data.data.id}
                  transactionId={data.data.state.transactionId}
                  apiConfig={apiConfig}
                >
                  {t('multiples.submitted.action.link', {
                    pageCount: allTransactions.length * 2,
                  })}
                </DownloadMultiplePDFLink>
              </GovUK.ListItem>
            </GovUK.UnorderedList>
          </GovUK.GridCol>
        )}
      </GovUK.GridRow>
      <GovUK.GridRow>
        <GovUK.GridCol setWidth={'full'}>
          {isPending && <Loader />}
          {data && (
            <>
              <SubmittedTable
                transactions={displayedTransactions}
                apiConfig={apiConfig}
                sortOrder={sortOrder}
                pageNumber={pageNumber}
              />
              <Pagination
                order={sortOrder}
                currentPage={pageNumber}
                totalPages={totalPages}
                url={`/multiples/${router.query.id}/submitted`}
              />
            </>
          )}
        </GovUK.GridCol>
      </GovUK.GridRow>
    </PageLayout>
  );
}

Submitted.auth = true;
