import * as GovUK from '@wts/ui/govuk-react-ui';
import { AddressSearch } from '@wts/app-uk-waste-movements/feature-single';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/auth/[...nextauth]/options';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Collection address details',
};

interface PageProps {
  params: {
    id: string;
  };
}
export default async function ProducerAddressPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const session = await getServerSession(options);
  const t = await getTranslations('single.postcode');

  const headerList = headers();
  let hostname = headerList.get('host') || '';
  let protocol = 'https';

  if (hostname.indexOf('localhost') === 0) {
    hostname = 'localhost:3000';
    protocol = 'http';
  }
  const apiUrl = `${protocol}://${hostname}/api`;

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/ukwm/drafts/${params.id}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    });
  } catch (error) {
    console.error(error);
    return redirect('/error');
  }

  const draft = await response.json();
  const status = draft.producerAndCollection.wasteCollection.address.status;

  const defaultView = status !== 'NotStarted' ? 'edit' : 'search';
  let savedFormValues;

  if (status !== 'NotStarted') {
    const address = draft.producerAndCollection.wasteCollection.address;
    savedFormValues = {
      postcode: address.postcode,
      buildingNameOrNumber: address.buildingNameOrNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      townCity: address.townCity,
      country: address.country,
    };
  }

  const content = {
    inputLabel: t('input.label'),
    inputHint: t('input.hint'),
    buildingNameLabel: t('buildingName.label'),
    buildingNameHint: t('buildingName.hint'),
    addressLine1Label: t('addressLine1.label'),
    addressLine1Hint: t('addressLine1.hint'),
    addressLine2Label: t('addressLine2.label'),
    addressLine2Hint: t('addressLine2.hint'),
    townCityLabel: t('townCity.label'),
    postcodeLabel: t('postcodeManual.label'),
    countryLabel: t('country.label'),
    button: t('button'),
    buttonSave: t('buttonSave'),
    manualLink: t('manualLink'),
    manualLinkShort: t('manualLinkShort'),
    searchAgain: t('searchAgain'),
    legend: t('legend'),
    buttonSecondary: t('buttonSecondary'),
    notFound: t('notFound'),
    notFoundPrompt: t('notFoundPrompt'),
    addressFound: t('addressFound'),
    addressesFound: t('addressesFound'),
    useAddress: t('useAddress'),
    useDifferentAddress: t('useDifferentAddress'),
  };

  const CreateContent = async (key: string) => {
    const t = await getTranslations('single.producer');
    return (
      <>
        <GovUK.Caption>{t('caption')}</GovUK.Caption>
        <GovUK.Heading size="l" level={1}>
          {t(`collection.postcode.${key}.heading`)}
        </GovUK.Heading>
        {key === 'search' && (
          <GovUK.Paragraph>
            {t('collection.postcode.search.intro')}
          </GovUK.Paragraph>
        )}
      </>
    );
  };

  return (
    <AddressSearch
      defaultView={defaultView}
      searchContent={await CreateContent('search')}
      resultsContent={await CreateContent('results')}
      noResultsContent={await CreateContent('noResults')}
      confirmationContent={await CreateContent('confirmation')}
      manualContent={await CreateContent('manual')}
      editContent={await CreateContent('edit')}
      token={session?.token}
      content={content}
      id={params.id}
      savedFormValues={savedFormValues}
      apiPartial={'/waste-collection-address'}
      destination={'/producer/source'}
    />
  );
}
