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
        <GovUK.SectionBreak size="m" visible={false} />
        <GovUK.Heading size={'s'} level={3}>
          {t('cardTitleTwo')}
        </GovUK.Heading>
        <Link href="/multiples"> {t('cardLink')} </Link>
        <GovUK.SectionBreak size="l" visible={false} />
      </div>
    </div>
  );
}
