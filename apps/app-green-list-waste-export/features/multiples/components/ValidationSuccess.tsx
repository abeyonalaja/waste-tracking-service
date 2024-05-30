import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import {
  NotificationBanner,
  Paragraph,
  SaveReturnButton,
  ButtonGroup,
} from 'components';

interface ValidationSuccessProps {
  recordCount: number;
  hasCorrectedErrors: boolean;
}

export function ValidationSuccess({
  recordCount,
  hasCorrectedErrors,
}: ValidationSuccessProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div id="upload-page-success">
      <NotificationBanner
        headingLevel={1}
        type="success"
        id="success-banner-csv-upload"
        headingText={t(
          hasCorrectedErrors
            ? 'multiples.success.heading.afterCorrection_one'
            : 'multiples.success.heading',
          {
            count: recordCount,
          },
        )}
      />
      <Paragraph>{t('multiples.success.intro')}</Paragraph>
      <ButtonGroup>
        <GovUK.Button
          onClick={(e) => {
            e.preventDefault();
            router.push(`/multiples/${router.query.id}/submit/confirm`);
          }}
          id="continueButton"
        >
          {t('multiples.success.submitButton')}
        </GovUK.Button>
        <SaveReturnButton
          onClick={(e) => {
            e.preventDefault();
            router.push(`/multiples/${router.query.id}/submit/cancel`);
          }}
        >
          {t('cancelButton')}
        </SaveReturnButton>
      </ButtonGroup>
    </div>
  );
}
