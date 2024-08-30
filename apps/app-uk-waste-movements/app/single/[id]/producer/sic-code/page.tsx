import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/auth/[...nextauth]/options';
import { getTranslations } from 'next-intl/server';
import { SicCodes } from '@wts/app-uk-waste-movements/feature-single';

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
  const session = await getServerSession(options);

  const strings = {
    backLink: t('backLink'),
    caption: t('caption'),
    maxWarning: t('maxWarning'),
    titleNone: t('titleNone'),
    titleOne: t('titleOne'),
    titleMultipleOne: t('titleMultipleOne'),
    titleMultipleTwo: t('titleMultipleTwo'),
    description: t('description'),
    link: t('link'),
    saveAndContinue: t('saveAndContinue'),
    saveAndReturn: t('saveAndReturn'),
    remove: {
      backLink: t('backLink'),
      caption: t('caption'),
      title: t('remove.title'),
      yesRadio: t('yesRadio'),
      noRadio: t('noRadio'),
      saveAndContinue: t('saveAndContinue'),
      saveAndReturn: t('saveAndReturn'),
      errorMessage: t('remove.errorMessage'),
      errorSummary: t('errorSummary'),
    },
    add: {
      title: t('add.title'),
      label: t('add.label'),
      hiddenError: t('add.hiddenError'),
      selectionErrorMessage: t('add.selectionErrorMessage'),
      errorMessageEmpty: t('add.errorMessageEmpty'),
      errorMessageDuplicate: t('add.errorMessageDuplicate'),
      yesRadio: t('yesRadio'),
      noRadio: t('noRadio'),
      saveAndContinue: t('saveAndContinue'),
      saveAndReturn: t('saveAndReturn'),
      errorSummary: t('errorSummary'),
    },
    list: {
      remove: t('list.remove'),
      hidden: t('list.hidden'),
    },
  };

  if (!session?.token) {
    console.error('No token found');
    return redirect('/error');
  }
  const token = session?.token;
  const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

  if (!apiUrl) {
    console.error('No API URL found');
    return redirect('/error');
  }
  return (
    <SicCodes id={params.id} token={token} strings={strings} apiUrl={apiUrl} />
  );
}
