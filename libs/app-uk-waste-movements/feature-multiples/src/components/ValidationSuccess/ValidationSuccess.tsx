import {
  Button,
  ButtonGroup,
  Heading,
  NotificationBanner,
  Paragraph,
  WarningText,
} from '@wts/ui/govuk-react-ui';
import { Link } from '@wts/ui/navigation';
import { useTranslations } from 'next-intl';

type ValidationSuccessProps = {
  recordCount: number;
  hasCorrectedErrors: boolean;
  hasEstimates: boolean;
};

export function ValidationSuccess({
  recordCount,
  hasCorrectedErrors,
  hasEstimates = false,
}: ValidationSuccessProps) {
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
        <>
          <Button>{t('button')}</Button>
          <Link
            href={'#'}
            className={'govuk-link govuk-link--no-visited-state'}
          >
            {t('cancelLink')}
          </Link>
        </>
      </ButtonGroup>
    </div>
  );
}
