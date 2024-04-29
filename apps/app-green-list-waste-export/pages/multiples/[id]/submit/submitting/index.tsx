import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import useSafePush from 'utils/useRouterChange';
import { PageLayout, Loader } from 'features/multiples';
import { getValidationResult } from 'features/multiples';
import styled from 'styled-components';
import * as GovUK from 'govuk-react';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Index() {
  const router = useRouter();
  const { safePush } = useSafePush();

  const reFetchUntil = (q) => {
    const uploadStatus = q.state.data?.data.state.status || null;

    if (q.state.fetchFailureReason?.request.status === 404) {
      safePush('/404');
      return;
    }

    if (uploadStatus === 'Submitted') {
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

      if (uploadStatus === 'Submitted') {
        safePush(`/multiples/${router.query.id}/submitted?sort=asc&page=1`);
      }
    }
  }, [data, router.query.id]);

  if (error) {
    router.push(`/multiples/${router.query.id}/submit/error`);
    return;
  }

  return (
    <PageLayout setWidth="full">
      <StyledDiv>
        <GovUK.Heading size={'LARGE'}>
          Loading submission confirmation
        </GovUK.Heading>
        <Loader />
      </StyledDiv>
    </PageLayout>
  );
}

Index.auth = true;
