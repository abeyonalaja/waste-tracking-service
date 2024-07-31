import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { AddressSearch } from '@wts/app-uk-waste-movements/feature-single';
import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/auth/[...nextauth]/options';
import { BackLink } from '@wts/ui/shared-ui/server';

export const metadata: Metadata = {
  title: 'Producer details',
};

export default async function ProducerAddressPage(): Promise<JSX.Element> {
  const session = await getServerSession(options);
  const SearchContent = () => {
    const t = useTranslations('single.producer');
    return (
      <>
        <GovUK.Caption>{t('caption')}</GovUK.Caption>
        <GovUK.Heading size={'l'} level={1}>
          {t('postcode.search.heading')}
        </GovUK.Heading>
        <GovUK.Paragraph>{t('postcode.search.intro')}</GovUK.Paragraph>
      </>
    );
  };

  const ResultsContent = () => {
    const t = useTranslations('single.producer');
    return (
      <>
        <GovUK.Caption>{t('caption')}</GovUK.Caption>
        <GovUK.Heading size={'l'} level={1}>
          {t('postcode.results.heading')}
        </GovUK.Heading>
      </>
    );
  };

  const NoResultsContent = () => {
    const t = useTranslations('single.producer');
    return (
      <>
        <GovUK.Caption>{t('caption')}</GovUK.Caption>
        <GovUK.Heading size={'l'} level={1}>
          {t('postcode.noResults.heading')}
        </GovUK.Heading>
      </>
    );
  };

  const BackLinkWrap = () => {
    return <BackLink href={'../'} />;
  };

  return (
    <Page beforeChildren={<BackLinkWrap />}>
      <GovUK.GridRow>
        <GovUK.GridCol size={'two-thirds'}>
          <AddressSearch
            searchContent={<SearchContent />}
            resultsContent={<ResultsContent />}
            noResultsContent={<NoResultsContent />}
            token={session?.token}
          />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
