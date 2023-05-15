import React from 'react';
import { LoadingBox } from 'govuk-react';
import styled from 'styled-components';

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
  return (
    <LoadingStyled
      loading
      data-testid={testId}
      aria-busy="true"
      title="Loading"
    >
      {}
    </LoadingStyled>
  );
};
