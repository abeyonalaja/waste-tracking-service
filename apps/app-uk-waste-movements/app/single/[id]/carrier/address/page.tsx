import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/auth/[...nextauth]/options';
import { generateApiUrl } from '../../../../../utils';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { AddressSearch } from '@wts/app-uk-waste-movements/feature-single';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('single.carrierAddress.metadata');

  return {
    title: t('title'),
    description: t('description'),
  };
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function CarrierAddressPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const session = await getServerSession(options);
  const t = await getTranslations('single.postcode');
  const apiUrl = generateApiUrl();

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/ukwm/drafts/${params.id}/carrier-address`,
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
      console.error('Draft not found');
      return redirect('/404');
    } else {
      return redirect('/error');
    }
  }

  const carrierAddress = await response.json();
  const status = carrierAddress.status;
  const defaultView = status !== 'NotStarted' ? 'edit' : 'search';
  let savedFormValues;

  if (status !== 'NotStarted') {
    savedFormValues = {
      postcode: carrierAddress.postcode,
      buildingNameOrNumber: carrierAddress.buildingNameOrNumber,
      addressLine1: carrierAddress.addressLine1,
      addressLine2: carrierAddress.addressLine2,
      townCity: carrierAddress.townCity,
      country: carrierAddress.country,
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
    const t = await getTranslations('single.carrierAddress');
    return (
      <>
        <GovUK.Caption>{t('caption')}</GovUK.Caption>
        <GovUK.Heading size="l" level={1}>
          {t(`postcode.${key}.heading`)}
        </GovUK.Heading>
        {key === 'search' && (
          <GovUK.Paragraph>{t('postcode.search.intro')}</GovUK.Paragraph>
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
      destination="/carrier/contact"
      apiPartial="/carrier-address"
      section="Carrier"
    />
  );
}
