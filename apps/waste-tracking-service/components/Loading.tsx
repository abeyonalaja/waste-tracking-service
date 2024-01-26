import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingBox } from 'govuk-react';
import styled from 'styled-components';
import 'i18n/config';

interface Props {
  size?: string;
  testId?: string;
}

const LoadingStyled = styled(LoadingBox)<{ $size?: string }>`
  padding: 0;
  width: ${(props) => (props.$size === 'L' ? '120px' : '30px')};
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
  svg {
    width: ${(props) => (props.$size === 'L' ? '120px' : '30px')} !important;
  }
`;

export const Loading = ({ size, testId }: Props) => {
  const { t } = useTranslation();
  return (
    <LoadingStyled
      $size={size}
      loading
      data-testid={testId}
      aria-busy="true"
      title={t('loading')}
    >
      {}
    </LoadingStyled>
  );
};
