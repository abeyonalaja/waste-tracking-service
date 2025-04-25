import * as GovUK from '@wts/ui/govuk-react-ui';
import { useTranslations } from 'next-intl';
import { SubmitButton } from './SubmitButton';

interface ValidationCancelProps {
  submissionId: string;
  filename: string;
  token: string | null | undefined;
}

export function ValidationCancel({
  submissionId,
  filename,
  token,
}: ValidationCancelProps): JSX.Element {
  const t = useTranslations('multiples.cancel');
  return (
    <>
      <GovUK.Heading size={'l'}>{t('heading')}</GovUK.Heading>
      <GovUK.Paragraph mb={8}>{t('paragraph')}</GovUK.Paragraph>
      <GovUK.ButtonGroup>
        <GovUK.Button href={'/multiples'}>{t('button')}</GovUK.Button>
        <SubmitButton
          buttonText={t('buttonSecondary')}
          secondary={true}
          submissionId={submissionId}
          filename={filename}
          token={token}
        />
      </GovUK.ButtonGroup>
    </>
  );
}
