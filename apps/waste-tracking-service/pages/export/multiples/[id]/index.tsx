import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import useSafePush from 'utils/useRouterChange';
import { PageLayout, Loader } from 'features/multiples';
import { getValidationResult } from 'features/multiples';

export default function Index() {
  const router = useRouter();
  const { safePush } = useSafePush();

  const reFetchUntil = (q) => {
    const uploadStatus = q.state.data?.data.state.status || null;

    if (q.state.fetchFailureReason?.request.status === 404) {
      safePush('/404');
      return;
    }

    if (
      uploadStatus === 'Submitted' ||
      uploadStatus === 'PassedValidation' ||
      uploadStatus === 'FailedValidation'
    ) {
      return;
    }

    return 4000;
  };

  const { data, error } = useQuery({
    queryKey: ['multiples', router.query.id],
    queryFn: async () => {
      return await getValidationResult(router.query.id as string);
    },
    enabled: !!router.query.id,
    refetchInterval: (q) => reFetchUntil(q),
    staleTime: 60 * 60 * 10,
    gcTime: 60 * 60 * 30,
  });

  useEffect(() => {
    const apiData = data;

    if (apiData) {
      const uploadStatus = apiData.data.state.status || null;

      if (uploadStatus === 'FailedCsvValidation') {
        safePush(`/export/multiples/?columnsError=true`);
      }

      if (uploadStatus === 'FailedValidation') {
        safePush(`/export/multiples/${router.query.id}/errors?errors=true`);
        return;
      }

      if (uploadStatus === 'PassedValidation') {
        safePush(`/export/multiples/${router.query.id}/submit`);
        return;
      }
    }
  }, [data, router.query.id]);

  if (error) {
    router.push('/404');
    return;
  }

  return (
    <PageLayout setWidth="full">
      <Loader filename={router.query.filename as string} />
    </PageLayout>
  );
}

Index.auth = true;
