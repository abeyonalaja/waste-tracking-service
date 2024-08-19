import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { options } from '../../../../../../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import { generateApiUrl } from '../../../../../../../utils';
import * as GovUK from '@wts/ui/govuk-react-ui';
import Link from 'next/link';
import { BackLink, Page } from '@wts/ui/shared-ui/server';
import {
  ReuseProducerAddressConfirm,
  formatAddress,
} from '@wts/app-uk-waste-movements/feature-single';

export const metadata: Metadata = {
  title: 'Waste collection details',
  description: 'Create a new single waste movement',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ReuseProducerAddressConfirmPage({
  params,
}: PageProps): Promise<React.ReactNode> {
  const t = await getTranslations(
    'single.producer.wasteCollectionDetails.sameAsProducer.confirm',
  );
  const session = await getServerSession(options);
  const token = session?.token;
  const apiUrl = generateApiUrl();

  const formStrings = {
    buttonOne: t('buttonOne'),
    buttonTwo: t('buttonTwo'),
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

  const address = {
    buildingNameOrNumber: producerAddress.buildingNameOrNumber,
    addressLine1: producerAddress.addressLine1,
    addressLine2: producerAddress.addressLine2,
    townCity: producerAddress.townCity,
    postcode: producerAddress.postcode,
    country: producerAddress.country,
  };

  return (
    <Page
      beforeChildren={
        <BackLink
          text={t('backLink')}
          href={`/single/${params.id}/producer/collection-details/reuse`}
        />
      }
    >
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Heading size={'l'} level={1}>
            <GovUK.Caption>{t('caption')}</GovUK.Caption>
            {t('heading')}
          </GovUK.Heading>
          <GovUK.InsetText>
            {formatAddress(JSON.stringify(producerAddress))}
          </GovUK.InsetText>
          <ReuseProducerAddressConfirm
            id={params.id}
            token={token}
            address={address}
            formStrings={formStrings}
          />
          <Link href={`/single/${params.id}/producer/collection-details`}>
            {t('useDifferentAddressLink')}
          </Link>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
