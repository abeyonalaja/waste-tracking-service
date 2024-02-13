import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import styled from 'styled-components';
import { Paragraph, SaveReturnButton, ButtonGroup } from 'components';
import {
  SetUploadId,
  SetValidationResult,
  SetShowCancelPrompt,
  SetShowDeclaration,
} from '../types';

const BackLinkWrap = styled.div`
  margin-top: -30px;
  margin-bottom: 30px;
`;

type CancelSubmissionProps = {
  setShowCancel: SetShowCancelPrompt;
  setShowDeclaration: SetShowDeclaration;
  setUploadId: SetUploadId;
  setValidationResult: SetValidationResult;
};

export function CancelSubmissionPrompt({
  setShowCancel,
  setShowDeclaration,
  setUploadId,
  setValidationResult,
}: CancelSubmissionProps) {
  const { t } = useTranslation();

  return (
    <>
      <BackLinkWrap>
        <GovUK.BackLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowCancel(false);
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      </BackLinkWrap>
      <GovUK.Heading size={'L'}>{t('multiples.cancel.title')}</GovUK.Heading>
      <Paragraph>{t('multiples.cancel.intro')}</Paragraph>
      <ButtonGroup>
        <GovUK.Button
          onClick={() => {
            setUploadId(null);
            setValidationResult(null);
          }}
        >
          {t('multiples.cancel.confirmButton')}
        </GovUK.Button>
        <SaveReturnButton
          onClick={(e) => {
            e.preventDefault();
            setShowCancel(false);
            setShowDeclaration(true);
          }}
        >
          {t('multiples.cancel.submitButton')}
        </SaveReturnButton>
      </ButtonGroup>
    </>
  );
}
