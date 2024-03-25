import { useTranslation } from 'react-i18next';
import { WarningText } from 'govuk-react';
import styled from 'styled-components';

const StyledWarningText = styled(WarningText)<{
  $mb?: number;
}>`
  margin-bottom: ${(props) => (props.$mb ? `${props.$mb}px` : '0')};
`;

export function EstimatesBanner() {
  const { t } = useTranslation();

  return (
    <StyledWarningText $mb={25}>
      {t('multiples.estimates.text')}
    </StyledWarningText>
  );
}
