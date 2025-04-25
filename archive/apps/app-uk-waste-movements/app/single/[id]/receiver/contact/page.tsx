import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import { generateApiUrl } from '../../../../../utils';
import { Metadata } from 'next';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { BackLink, Page } from '@wts/ui/shared-ui/server';
import { ContactDetailsForm } from '@wts/app-uk-waste-movements/feature-single';
import { DraftContact } from '@wts/api/uk-waste-movements';

export const metadata: Metadata = {
  title: 'Receiver contact details',
  description: 'Create a new single waste movement',
};

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ProducerContactDetailsPage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactNode> {
  const t = await getTranslations('single.receiverAddress.contactDetails');
  const session = await getServerSession(options);
  const token = session?.token;
  const apiUrl = generateApiUrl();
  const section = 'Producer';

  const formStrings = {
    errorSummaryHeading: t('form.errorSummaryHeading'),
    labelOne: t('form.labelOne'),
    labelTwo: t('form.labelTwo'),
    hintOne: t('form.hintOne'),
    labelThree: t('form.labelThree'),
    labelFour: t('form.labelFour'),
    hintTwo: t('form.hintTwo'),
    labelFive: t('form.labelFive'),
    buttonOne: t('form.buttonOne'),
    buttonTwo: t('form.buttonTwo'),
  };

  if (!token) {
    console.error('No token present');
    return redirect('/error');
  }

  let response: Response;
  try {
    response = await fetch(
      `${apiUrl}/ukwm/drafts/${params.id}/receiver-contact`,
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

  const record: DraftContact = await response.json();

  let initialFormState = {};

  if (record.status === 'Complete' || record.status === 'Started') {
    initialFormState = {
      organisationName: record.organisationName,
      organisationContactPerson: record.fullName,
      emailAddress: record.emailAddress,
      phoneNumber: record.phoneNumber,
      faxNumber: record.faxNumber,
    };
  }

  return (
    <Page
      beforeChildren={
        <BackLink
          text={t('backLink')}
          href={
            searchParams?.source === 'tasklist'
              ? `/single/${params.id}`
              : `/single/${params.id}/receiver/address`
          }
        />
      }
    >
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <ContactDetailsForm
            id={params.id}
            token={token}
            formStrings={formStrings}
            initialFormState={initialFormState}
            section={section}
            endpoint={'receiver-contact'}
            nextPage={'receiver/permit'}
          >
            <GovUK.Caption>{t('caption')}</GovUK.Caption>
            <GovUK.Heading size={'l'} level={1}>
              {t('heading')}
            </GovUK.Heading>
          </ContactDetailsForm>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
