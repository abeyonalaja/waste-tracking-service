import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingBox } from 'govuk-react';
import styled from 'styled-components';
import 'i18n/config';

interface Props {
  testId?: string;
}

const LoadingStyled = styled(LoadingBox)`
  padding: 0;
  width: 30px;
  * {
    position: relative;
    display: inline-block;
  }
  .overlay {
    display: none;
  }
  .icon-loading {
    position: relative;
    width: 100%;
  }
`;

export const Loading = ({ testId }: Props) => {
  const { t } = useTranslation();
  return (
    <LoadingStyled
      loading
      data-testid={testId}
      aria-busy="true"
      title={t('loading')}
    >
      {}
    </LoadingStyled>
  );
};
