import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { options } from '../../../../../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import { generateApiUrl } from '../../../../../../utils';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { BackLink, Page } from '@wts/ui/shared-ui/server';
import { ReuseProducerAddressPrompt } from '@wts/app-uk-waste-movements/feature-single';

export const metadata: Metadata = {
  title: 'Waste collection details',
  description: 'Create a new single waste movement',
};

interface PageProps {
  params: {
    id: string;
  };
}
export default async function ReuseProducerAddressPromptPage({
  params,
}: PageProps): Promise<React.ReactNode> {
  const t = await getTranslations(
    'single.producer.wasteCollectionDetails.sameAsProducer.prompt',
  );
  const session = await getServerSession(options);
  const token = session?.token;
  const apiUrl = generateApiUrl();

  const formStrings = {
    radioOne: t('radioOne'),
    radioTwo: t('radioTwo'),
    buttonOne: t('buttonOne'),
    buttonTwo: t('buttonTwo'),
    errorSummaryTitle: t('errorSummaryTitle'),
    validationError: t('validationError'),
  };

  if (!token) {
    console.error('No token present');
    return redirect('/error');
  }

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/ukwm/drafts/${params.id}/producer-address`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      },
    );
  } catch (error) {
    console.error('Failed to fetch producer address', error);
    return redirect('/error');
  }

  if (!response.ok) {
    if (response.status === 404) {
      return redirect('/404');
    }
    return redirect('/error');
  }

  const producerAddress = await response.json();

  if (producerAddress.status !== 'Complete') {
    return redirect(`/single/${params.id}/producer/collection-details`);
  }

  return (
    <Page
      beforeChildren={
        <BackLink text={t('backLink')} href={`#`} routerBack={true} />
      }
    >
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <ReuseProducerAddressPrompt id={params.id} formStrings={formStrings}>
            <GovUK.Heading size={'l'} level={1}>
              <GovUK.Caption>{t('caption')}</GovUK.Caption>
              {t('heading')}
            </GovUK.Heading>
            <GovUK.Paragraph>{t('paragraphOne')}</GovUK.Paragraph>
            <GovUK.InsetText>
              <div>
                {producerAddress.buildingNameOrNumber && (
                  <>
                    {producerAddress.buildingNameOrNumber}
                    <br />
                  </>
                )}

                {producerAddress.addressLine1}
                <br />
                {producerAddress.addressLine2 && (
                  <>
                    {producerAddress.addressLine2}
                    <br />
                  </>
                )}
                {producerAddress.townCity}
                <br />
                {producerAddress.postcode && (
                  <>
                    {producerAddress.postcode}
                    <br />
                  </>
                )}

                {producerAddress.country}
              </div>
            </GovUK.InsetText>
          </ReuseProducerAddressPrompt>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
