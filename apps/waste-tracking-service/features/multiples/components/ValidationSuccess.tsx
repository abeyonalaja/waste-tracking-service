import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import styled from 'styled-components';
import {
  NotificationBanner,
  Paragraph,
  SaveReturnButton,
  ButtonGroup,
} from 'components';
import { SetShowCancelPrompt, SetShowDeclaration } from '../types';

const BackLinkWrap = styled.div`
  margin-top: -30px;
  margin-bottom: 30px;
`;

type ValidationSuccessProps = {
  setShowCancelPrompt: SetShowCancelPrompt;
  isSecondForm?: boolean;
  uploadCount: number;
  setShowDeclaration: SetShowDeclaration;
};

export function ValidationSuccess({
  setShowCancelPrompt,
  isSecondForm,
  uploadCount,
  setShowDeclaration,
}: ValidationSuccessProps) {
  const { t } = useTranslation();

  return (
    <div id="upload-page-success">
      <BackLinkWrap>
        <GovUK.BackLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowCancelPrompt(true);
          }}
        >
          {t('Back')}
        </GovUK.BackLink>
      </BackLinkWrap>
      <NotificationBanner
        type="success"
        id="success-banner-csv-upload"
        headingText={t(
          isSecondForm
            ? 'multiples.success.heading.afterCorrection'
            : 'multiples.success.heading',
          {
            count: uploadCount || 0,
          }
        )}
      />
      <Paragraph>{t('multiples.success.intro')}</Paragraph>
      <ButtonGroup>
        <GovUK.Button
          onClick={(e) => {
            e.preventDefault();
            setShowDeclaration(true);
          }}
        >
          {t('multiples.success.submitButton')}
        </GovUK.Button>
        <SaveReturnButton
          onClick={(e) => {
            e.preventDefault();
            setShowCancelPrompt(true);
          }}
        >
          {t('cancelButton')}
        </SaveReturnButton>
      </ButtonGroup>
    </div>
  );
}
