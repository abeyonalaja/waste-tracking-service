import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
// import { getServerSession } from 'next-auth';
import { Metadata } from 'next';
import { BackLink } from '@wts/ui/shared-ui/server';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Producer SIC Codes',
  description: 'Create a new single waste movement',
};

interface PageProps {
  params: {
    id: string;
  };
}
export default async function ProducerSicCodesPage({
  params,
}: PageProps): Promise<React.ReactNode> {
  const t = await getTranslations('single.producer.sicCodes');
  // const session = await getServerSession(options);
  // const token = session?.token;

  return (
    <Page
      beforeChildren={
        <BackLink
          text={t('backLink')}
          href={`/single/${params.id}/producer/contact`}
        />
      }
    >
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Caption>{t('caption')}</GovUK.Caption>
          <GovUK.Heading size={'l'} level={1}>
            {t('heading')}
          </GovUK.Heading>
          <GovUK.Paragraph>For id: {params.id}</GovUK.Paragraph>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
