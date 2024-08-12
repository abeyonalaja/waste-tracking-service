import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/auth/[...nextauth]/options';
import { getTranslations } from 'next-intl/server';
import { generateApiUrl } from '../../../../../utils';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { BackLink, Page } from '@wts/ui/shared-ui/server';
import { WasteSourceForm } from '@wts/app-uk-waste-movements/feature-single';

export const metadata: Metadata = {
  title: 'Source of the waste',
  description: 'Create a new single waste movement',
};

interface PageProps {
  params: {
    id: string;
  };
}
export default async function SourceOfTheWastePage({
  params,
}: PageProps): Promise<React.ReactNode> {
  const t = await getTranslations('single.producer.sourceOfWaste');
  const session = await getServerSession(options);
  const token = session?.token;
  const apiUrl = generateApiUrl();

  const formStrings = {
    radioOne: t('radioOne'),
    radioTwo: t('radioTwo'),
    radioThree: t('radioThree'),
    radioFour: t('radioFour'),
    buttonOne: t('buttonOne'),
    buttonTwo: t('buttonTwo'),
    errorSummaryTitle: t('errorSummaryTitle'),
    errorMessage: t('errorMessage'),
  };

  if (!token) {
    console.error('No token found');
    return redirect('/error');
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl}/ukwm/drafts/${params.id}/waste-source`, {
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

  if (!response.ok) {
    if (response.status === 404) {
      console.error('Draft not found');
      return redirect('/404');
    } else {
      return redirect('/error');
    }
  }

  const wasteSource = await response.json();

  return (
    <Page
      beforeChildren={
        <BackLink text={t('backLink')} href="#" routerBack={true} />
      }
    >
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <WasteSourceForm
            id={params.id}
            token={token}
            wasteSource={wasteSource.value}
            formStrings={formStrings}
          >
            <GovUK.Caption>{t('caption')}</GovUK.Caption>
            <GovUK.Heading size={'l'} level={1}>
              {t('heading')}
            </GovUK.Heading>
          </WasteSourceForm>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
