import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import * as GovUK from 'govuk-react';

const StyledDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 500px;

  @media screen and (min-width: 641px) {
    flex-wrap: nowrap;
  }
`;

export function Search(): React.ReactNode {
  const { t } = useTranslation();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <>
      <GovUK.H2 size="MEDIUM" mb={1}>
        {t('multiples.submitted.search.heading')}
      </GovUK.H2>
      <GovUK.FormGroup>
        <form onSubmit={handleSubmit}>
          <GovUK.Label>
            {/* TODO: Sort out this missing label from design */}
            {/* <GovUK.LabelText>
              {t('multiples.submitted.search.heading')}
            </GovUK.LabelText> */}
            <GovUK.HintText>
              {t('multiples.submitted.search.hint')}
            </GovUK.HintText>
            <StyledDiv>
              <GovUK.Input />
              <GovUK.Button>
                {t('multiples.submitted.search.button')}
              </GovUK.Button>
            </StyledDiv>
          </GovUK.Label>
        </form>
      </GovUK.FormGroup>
    </>
  );
}
