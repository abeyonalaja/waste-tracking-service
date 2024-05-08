import * as GovUK from '@wts/ui/govuk-react-ui';
import { Link } from '@wts/ui/navigation';
import { useTranslations } from 'next-intl';
export function DashboardCard() {
  const t = useTranslations('moveWastePage');
  return (
    <div className="govuk-summary-card">
      <div className="govuk-summary-card__content">
        <GovUK.Heading size={'m'} level={2}>
          {t('cardTitle')}
        </GovUK.Heading>
        <GovUK.Paragraph> {t('cardParagraphOne')}</GovUK.Paragraph>
        <GovUK.Heading size={'s'} level={3}>
          {t('cardTitleTwo')}
        </GovUK.Heading>
        <GovUK.Paragraph>
          {' '}
          <Link
            href="/multiples"
            className={'govuk-link govuk-link--no-visited-state'}
          >
            {' '}
            {t('cardLink')}{' '}
          </Link>
        </GovUK.Paragraph>
      </div>
    </div>
  );
}
