import * as GovUK from '@wts/ui/govuk-react-ui';
import { AddressSearch } from '@wts/app-uk-waste-movements/feature-single';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/auth/[...nextauth]/options';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { generateApiUrl } from '../../../../../utils';

export const metadata: Metadata = {
  title: 'Waste collection details',
  description: 'Create a new single waste movement',
};

interface PageProps {
  params: {
    id: string;
  };
}
export default async function CollectionAddressPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const session = await getServerSession(options);
  const t = await getTranslations('single.postcode');
  const apiUrl = generateApiUrl();

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/ukwm/drafts/${params.id}/waste-collection-address`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      },
    );
  } catch (error) {
    console.error(error);
    return redirect('/error');
  }

  if (!response.ok) {
    if (response.status === 404) {
      return redirect('/404');
    } else {
      return redirect('/error');
    }
  }

  const collectionAddress = await response.json();

  const defaultView =
    collectionAddress.status !== 'NotStarted' ? 'edit' : 'search';

  let savedFormValues;

  if (collectionAddress.status !== 'NotStarted') {
    savedFormValues = {
      postcode: collectionAddress.postcode,
      buildingNameOrNumber: collectionAddress.buildingNameOrNumber,
      addressLine1: collectionAddress.addressLine1,
      addressLine2: collectionAddress.addressLine2,
      townCity: collectionAddress.townCity,
      country: collectionAddress.country,
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
          {t(`wasteCollectionDetails.postcode.${key}.heading`)}
        </GovUK.Heading>
        {key === 'search' && (
          <GovUK.Paragraph>
            {t('wasteCollectionDetails.postcode.search.intro')}
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
