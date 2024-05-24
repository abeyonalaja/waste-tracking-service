import {
  Button,
  ButtonGroup,
  Heading,
  NotificationBanner,
  Paragraph,
  WarningText,
} from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
import { SubmitButton } from './SubmitButton';

interface ValidationSuccessProps {
  recordCount: number;
  hasCorrectedErrors: boolean;
  filename: string;
  hasEstimates: boolean;
  submissionId: string;
  token: string;
}

export function ValidationSuccess({
  recordCount,
  hasCorrectedErrors,
  filename,
  hasEstimates = false,
  submissionId,
  token,
}: ValidationSuccessProps): JSX.Element {
  const t = useTranslations('multiples.success');
  return (
    <div id="upload-page-success">
      <NotificationBanner
        headingLevel={1}
        success={true}
        title={t('notificationTitle')}
        id="success-banner-csv-upload"
      >
        {hasCorrectedErrors
          ? t('headingAfterCorrection', { count: recordCount })
          : t('heading', { count: recordCount })}
      </NotificationBanner>
      <Heading level={2}>{t('pageHeading', { count: recordCount })}</Heading>
      {hasEstimates && <WarningText>{t('warning')}</WarningText>}
      <Paragraph mb={8}>{t('body')}</Paragraph>
      <ButtonGroup>
        <SubmitButton
          buttonText={t('button')}
          submissionId={submissionId}
          token={token}
        />
        <Button
          href={`${submissionId}/cancel?filename=${filename}`}
          secondary={true}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </div>
  );
}
