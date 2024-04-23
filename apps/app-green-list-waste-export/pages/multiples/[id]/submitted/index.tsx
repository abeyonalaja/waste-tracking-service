import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import useApiConfig from 'utils/useApiConfig';
import * as GovUK from 'govuk-react';
import { BreadcrumbWrap, BreadCrumbLink } from 'components';
import {
  PageLayout,
  SubmittedTable,
  Loader,
  Transaction,
  Pagination,
  getValidationResult,
} from 'features/multiples';
import useSafePush from 'utils/useRouterChange';

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
      allTransactions = data.data.state.submissions.sort(
        (a: Transaction, b: Transaction) =>
          new Date(a.collectionDate).getTime() -
          new Date(b.collectionDate).getTime()
      );
    } else {
      allTransactions = data.data.state.submissions.sort(
        (a: Transaction, b: Transaction) =>
          new Date(b.collectionDate).getTime() -
          new Date(a.collectionDate).getTime()
      );
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
