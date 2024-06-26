import { getTranslations } from 'next-intl/server';
import { SubmittedFilters } from '@wts/app-uk-waste-movements/feature-multiples';
import { SubmittedResults } from '@wts/app-uk-waste-movements/feature-multiples/server';
import { getServerSession, Session } from 'next-auth';
import { options } from '../../../../api/auth/[...nextauth]/options';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { pick } from '../../../../../utils';
import { getMessages } from 'next-intl/server';
import { Breadcrumbs } from '@wts/ui/shared-ui';
import { Page } from '@wts/ui/shared-ui/server';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Loading } from '@wts/ui/shared-ui/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Creating multiple waste movements',
  description: 'Creating multiple waste movements',
};

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
  searchParams: {
    page: number;
    day: number;
    month: number;
    year: number;
    ewcCode: string;
    producerName: string;
    wasteMovementId: string;
    collectionDate: string;
  };
}

export default async function ManagePage({
  params,
  searchParams,
}: PageProps): Promise<React.ReactElement | undefined> {
  const t = await getTranslations('multiples.manage');
  const session: Session | null = await getServerSession(options);
  const messages = await getMessages();
  const token = session?.token;
  const headerList = headers();
  const hostname = headerList.get('host') || '';
  const breadcrumbs = [
    { text: t('breadCrumbs.home'), href: '../../account' },
    { text: t('breadCrumbs.moveWaste'), href: '/' },
    { text: t('breadCrumbs.current') },
  ];

  if (!token) {
    redirect('/404');
  }

  return (
    <Page beforeChildren={<Breadcrumbs items={breadcrumbs} />}>
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <GovUK.Heading>
            {session?.companyName
              ? t('headingOne', { company: session.companyName })
              : 'Waste movement records'}
          </GovUK.Heading>
        </GovUK.GridCol>
      </GovUK.GridRow>
      <NextIntlClientProvider messages={pick(messages, ['multiples'])}>
        <GovUK.GridRow>
          <GovUK.GridCol size="one-third-from-desktop">
            <SubmittedFilters />
          </GovUK.GridCol>
          <GovUK.GridCol size="two-thirds-from-desktop">
            <Suspense
              fallback={<Loading centered={true} />}
              key={JSON.stringify(searchParams)}
            >
              <SubmittedResults
                token={token}
                hostname={hostname}
                id={params.id}
                searchParams={searchParams}
              />
            </Suspense>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </NextIntlClientProvider>
    </Page>
  );
}
