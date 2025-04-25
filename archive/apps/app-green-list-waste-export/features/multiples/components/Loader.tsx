import styled, { keyframes } from 'styled-components';
import * as GovUK from 'govuk-react';

interface LoaderProps {
  filename?: string;
}

const rotation = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`;

const StyledSpan = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSpinner = styled.span`
  width: 80px;
  height: 80px;
  border: 10px solid #bfc1c3;
  border-bottom-color: #1d70b8;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: ${rotation} 1s linear infinite;
`;

export function Loader({ filename }: LoaderProps): React.ReactNode {
  return (
    <StyledSpan>
      {filename && (
        <GovUK.Heading size={'L'}>Loading {filename && filename}</GovUK.Heading>
      )}
      <StyledSpinner data-testid="multiples-loader" />
    </StyledSpan>
  );
}
