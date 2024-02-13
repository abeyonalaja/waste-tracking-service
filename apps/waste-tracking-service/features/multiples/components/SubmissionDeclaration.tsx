import { Dispatch, SetStateAction } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  BackLink,
  Heading,
  UnorderedList,
  ListItem,
  Button,
} from 'govuk-react';
import styled from 'styled-components';
import { Paragraph } from 'components';
import { SetSubmitted } from '../types';
import useApiConfig from 'utils/useApiConfig';
import axios from 'axios';

const BackLinkWrap = styled.div`
  margin-top: -30px;
  margin-bottom: 30px;
`;

type SubmissionDeclarationProps = {
  setShowDeclaration: Dispatch<SetStateAction<boolean>>;
  setSubmitted: SetSubmitted;
  uploadId: string;
  uploadCount: number;
};

export function SubmissionDeclaration({
  setShowDeclaration,
  setSubmitted,
  uploadId,
  uploadCount,
}: SubmissionDeclarationProps) {
  const { t } = useTranslation();
  const apiConfig = useApiConfig();

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
      setSubmitted(true);
    },
  });

  function handleSubmission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate(uploadId);
  }

  return (
    <div>
      <BackLinkWrap>
        <BackLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowDeclaration(false);
          }}
        >
          {t('Back')}
        </BackLink>
      </BackLinkWrap>
      <Heading size={'L'}>
        {t('multiples.submit.heading', { count: uploadCount })}
      </Heading>
      <Heading as={'h2'} size={'M'}>
        {t('multiples.submit.declaration')}
      </Heading>
      <Paragraph>{t('multiples.submit.list.heading')}</Paragraph>
      <UnorderedList mb={8}>
        <ListItem>{t('multiples.submit.list.itemOne')}</ListItem>
        <ListItem>{t('multiples.submit.list.itemTwo')}</ListItem>
        <ListItem>{t('multiples.submit.list.itemThree')}</ListItem>
        <ListItem>{t('multiples.submit.list.itemFour')}</ListItem>
      </UnorderedList>
      <form onSubmit={handleSubmission}>
        <Button type="submit">{t('multiples.submit.button')}</Button>
      </form>
    </div>
  );
}
