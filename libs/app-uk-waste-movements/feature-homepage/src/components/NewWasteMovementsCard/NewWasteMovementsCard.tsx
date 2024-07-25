import * as GovUK from '@wts/ui/govuk-react-ui';
import { Link } from '@wts/ui/navigation';
import { useTranslations } from 'next-intl';

export function NewWasteMovementsCard(): JSX.Element {
  const t = useTranslations('homePage.newWasteMovements');

  return (
    <div className="govuk-summary-card">
      <div className="govuk-summary-card__content">
        <GovUK.Heading size={'m'} level={2}>
          {t('title')}
        </GovUK.Heading>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-three-quarters">
            <GovUK.Paragraph> {t('description')}</GovUK.Paragraph>{' '}
          </div>
        </div>

        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-third">
            <GovUK.Heading size={'s'} level={3}>
              {t('singleMovementTitle')}
            </GovUK.Heading>
            <GovUK.Paragraph>
              <Link
                href="/single"
                className={'govuk-link govuk-link--no-visited-state'}
              >
                {t('singleMovementLink')}
              </Link>
            </GovUK.Paragraph>
          </div>
          <div className="govuk-grid-column-one-third">
            <GovUK.Heading size={'s'} level={3}>
              {t('multipleMovementTitle')}
            </GovUK.Heading>
            <GovUK.Paragraph>
              <Link
                href="/multiples"
                className={'govuk-link govuk-link--no-visited-state'}
              >
                {t('multipleMovementLink')}
              </Link>
            </GovUK.Paragraph>
          </div>
          <div className="govuk-grid-column-one-third">
            <GovUK.Heading size={'s'} level={3}>
              {t('allMovementsTitle')}
            </GovUK.Heading>
            <GovUK.Paragraph>{t('allMovementsLinkAbsent')}</GovUK.Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
}
