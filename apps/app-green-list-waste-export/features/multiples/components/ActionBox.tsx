import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as GovUK from 'govuk-react';
import { Paragraph } from 'components';
import { BLUE } from 'govuk-colours';

const StyledActionBox = styled.div`
  border-top: 2px solid ${BLUE};
  padding-top: 20px;
  padding-bottom: 20px;

  @media screen and (min-width: 640px) {
    padding-bottom: 0;
  }
`;

interface ActionBoxProps {
  pageCount: number;
}

export function ActionBox({ pageCount }: ActionBoxProps): React.ReactNode {
  const { t } = useTranslation();

  return (
    <StyledActionBox>
      <GovUK.Heading size="SMALL" as={'h2'}>
        {t('multiples.submitted.action.heading')}
      </GovUK.Heading>
      <Paragraph>
        {/* TODO: Add link to download page */}
        <GovUK.Link href="#">
          {t('multiples.submitted.action.link', { pageCount: pageCount })}
        </GovUK.Link>
      </Paragraph>
    </StyledActionBox>
  );
}
