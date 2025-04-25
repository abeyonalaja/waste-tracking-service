import * as GovUK from '@wts/ui/govuk-react-ui';
import { Page } from '@wts/ui/shared-ui/server';
// import { getServerSession } from 'next-auth';
import { Metadata } from 'next';
import { BackLink } from '@wts/ui/shared-ui/server';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Check your answers',
  description: 'Create a new single waste movement',
};

interface PageProps {
  params: {
    id: string;
  };
}
export default async function CarrierCheckYourAnswersPage({
  params,
}: PageProps): Promise<React.ReactNode> {
  const t = await getTranslations('single.producer.sicCodes');
  // const session = await getServerSession(options);
  // const token = session?.token;

  return (
    <Page
      beforeChildren={
        <BackLink text={t('backLink')} href="#" routerBack={true} />
      }
    >
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Caption>Carrier caption here</GovUK.Caption>
          <GovUK.Heading size={'l'} level={1}>
            Carrier check your answers page
          </GovUK.Heading>
          <GovUK.Paragraph>For id: {params.id}</GovUK.Paragraph>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
