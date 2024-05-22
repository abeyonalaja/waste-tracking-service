import {
  Heading,
  List,
  ListItem,
  Panel,
  Paragraph,
} from '@wts/ui/govuk-react-ui';
import { Link } from '@wts/ui/navigation';
import { useTranslations } from 'next-intl';

interface SubmissionConfirmationProps {
  submissionId: string;
  recordCount: number;
}

export function SubmissionConfirmation({
  submissionId,
  recordCount = 0,
}: SubmissionConfirmationProps): JSX.Element {
  const t = useTranslations('multiples.confirmation');
  return (
    <>
      <Panel title={t('banner', { count: recordCount })} />
      <Heading size={'m'} level={2}>
        {t('subHeading1')}
      </Heading>
      <Paragraph>{t('bodyP1')}</Paragraph>
      <Paragraph>{t('bodyP2')}</Paragraph>
      <List type={'unordered'}>
        <ListItem>
          <Link
            href={`/multiples/${submissionId}/view?page=1`}
            target={'_blank'}
          >
            {t('bullet1')}
          </Link>
        </ListItem>
      </List>
      <Heading size={'m'} level={2}>
        {t('subHeading2')}
      </Heading>
      <Paragraph>{t('bodyP3')}</Paragraph>
      <Link href="/" className="govuk-button govuk-button--secondary">
        {t('button')}
      </Link>
    </>
  );
}
