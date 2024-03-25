import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import useApiConfig from 'utils/useApiConfig';
import axios from 'axios';
import { Heading, UnorderedList, ListItem, Button } from 'govuk-react';
import { Paragraph } from 'components';
import { EstimatesBanner } from './EstimatesBanner';

type SubmissionDeclarationProps = {
  recordCount: number;
  hasEstimates: boolean;
};

export function SubmissionDeclaration({
  recordCount,
  hasEstimates,
}: SubmissionDeclarationProps) {
  const { t } = useTranslation();
  const apiConfig = useApiConfig();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (uploadId: string) => {
      const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/batches/${uploadId}/finalize`;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: apiConfig.Authorization,
      };
      return axios.post(url, {}, { headers });
    },
    onError: async (err) => {
      console.error(err);
    },
    onSuccess: async () => {
      router.push(`/multiples/${router.query.id}/submit/submitted`);
    },
  });

  function handleSubmission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate(router.query.id as string);
  }

  return (
    <>
      <Heading size={'L'}>
        {t('multiples.submit.heading', { count: recordCount })}
      </Heading>
      {hasEstimates && <EstimatesBanner />}
      <Heading as={'h2'} size={'M'}>
        {t('multiples.submit.declaration')}
      </Heading>
      <Paragraph>{t('multiples.submit.list.heading')}</Paragraph>
      <UnorderedList mb={8}>
        <ListItem>{t('multiples.submit.list.itemOne')}</ListItem>
        {hasEstimates && (
          <ListItem>{t('multiples.submit.list.itemTwo')}</ListItem>
        )}
        <ListItem>{t('multiples.submit.list.itemThree')}</ListItem>
        <ListItem>{t('multiples.submit.list.itemFour')}</ListItem>
      </UnorderedList>
      <form onSubmit={handleSubmission}>
        <Button type="submit" id="submitButton">
          {t('multiples.submit.button')}
        </Button>
      </form>
    </>
  );
}
