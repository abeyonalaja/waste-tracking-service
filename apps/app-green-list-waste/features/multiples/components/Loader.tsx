import styled from 'styled-components';
import { Loading } from 'components';
import * as GovUK from 'govuk-react';

const LoadingWrap = styled.div`
  padding: 30px;
  text-align: center;
`;

interface LoaderProps {
  filename?: string;
}

const LoaderWrap = styled.div`
  margin: 20px auto;
  width: 120px;
`;
export function Loader({ filename }: LoaderProps) {
  return (
    <LoadingWrap>
      <GovUK.Heading size={'L'}>Loading {filename && filename}</GovUK.Heading>
      <LoaderWrap>
        <Loading size={'L'} testId="multiples-loader" />
      </LoaderWrap>
    </LoadingWrap>
  );
}
