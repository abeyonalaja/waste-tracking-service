import { Page } from '@wts/ui/shared-ui/server';
import { Metadata } from 'next';
import { Breadcrumbs } from '@wts/ui/shared-ui';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { getTranslations } from 'next-intl/server';
import {
  TaskList,
  generateSectionStatuses,
} from '@wts/app-uk-waste-movements/feature-single';
import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import { generateApiUrl } from '../../../utils';
import { GetUkwmSubmissionResponse } from '@wts/api/waste-tracking-gateway';

export const metadata: Metadata = {
  title: 'Create a new single waste movement',
  description: 'Create a new single waste movement',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function TaskListPage({
  params,
}: PageProps): Promise<React.ReactNode> {
  const t = await getTranslations('single.taskList');
  const session = await getServerSession(options);
  const apiUrl = generateApiUrl();

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

  if (!response.ok) {
    if (response.status === 404) {
      return redirect('/404');
    } else {
      return redirect('/error');
    }
  }

  const draft: GetUkwmSubmissionResponse = await response.json();

  const sectionStatuses = generateSectionStatuses(draft);

  return (
    <Page
      beforeChildren={
        <Breadcrumbs
          items={[
            { text: t('breadCrumbs.one'), href: '../../../' },
            { text: t('breadCrumbs.two'), href: '/' },
            { text: t('breadCrumbs.three') },
          ]}
        />
      }
    >
      <GovUK.GridRow>
        <GovUK.GridCol>
          <p className="govuk-heading-l" id="unique-reference-caption">
            <GovUK.Caption>{t('caption')}</GovUK.Caption>
            {draft.reference}
          </p>
          <GovUK.Heading>{t('title')}</GovUK.Heading>
          <TaskList
            sections={[
              {
                heading: t('producerAndCollection.heading'),
                description: t('producerAndCollection.description'),
                overallSectionStatus: sectionStatuses.producer.overall,
                tasks: [
                  {
                    name: t('producerAndCollection.organisationAddress'),
                    href: `${params.id}/producer/address`,
                    status: draft.producerAndCollection.producer.address.status,
                  },
                  {
                    name: t('producerAndCollection.organisationContactDetails'),
                    href: `${params.id}/producer/contact?source=tasklist`,
                    status: draft.producerAndCollection.producer.contact.status,
                  },
                  {
                    name: t('producerAndCollection.sicCode'),
                    href: `${params.id}/producer/sic-code`,
                    status:
                      draft.producerAndCollection.producer.sicCodes.status,
                  },
                  {
                    name: t('producerAndCollection.collectionDetails'),
                    href:
                      draft.producerAndCollection.producer.address.status ===
                        'Complete' &&
                      draft.producerAndCollection.wasteCollection.address
                        .status === 'NotStarted'
                        ? `${params.id}/producer/collection-details/reuse`
                        : `${params.id}/producer/collection-details`,
                    status:
                      draft.producerAndCollection.wasteCollection.address
                        .status,
                  },
                  {
                    name: t('producerAndCollection.sourceOfWaste'),
                    href: `${params.id}/producer/source`,
                    status:
                      draft.producerAndCollection.wasteCollection.wasteSource
                        .status,
                  },
                  {
                    name: t('producerAndCollection.checkYourAnswers'),
                    href: `${params.id}/producer/check-your-answers`,
                    status: sectionStatuses.producer.checkYourAnswers,
                  },
                ],
              },
              {
                heading: t('carrier.heading'),
                description: t('carrier.description'),
                overallSectionStatus: sectionStatuses.carrier.overall,
                tasks: [
                  {
                    name: t('carrier.carrierAddress'),
                    href: `${params.id}/carrier/address`,
                    status: draft.carrier.address.status,
                  },
                  {
                    name: t('carrier.carrierContactDetails'),
                    href: `${params.id}/carrier/contact?source=tasklist`,
                    status: draft.carrier.contact.status,
                  },
                  {
                    name: t('carrier.modeOfTransport'),
                    href: `${params.id}/carrier/transport`,
                    status: draft.carrier.modeOfTransport.status,
                  },
                  {
                    name: t('carrier.checkYourAnswers'),
                    href: `${params.id}/carrier/check-your-answers`,
                    status: sectionStatuses.carrier.checkYourAnswers,
                  },
                ],
              },
              {
                heading: t('receiver.heading'),
                description: t('receiver.description'),
                overallSectionStatus: sectionStatuses.receiver.overall,
                tasks: [
                  {
                    name: t('receiver.receiverAddress'),
                    href: `${params.id}/receiver/address`,
                    status: draft.receiver.address.status,
                  },
                  {
                    name: t('receiver.receiverContactDetails'),
                    href: `${params.id}/receiver/contact?source=tasklist`,
                    status: draft.receiver.contact.status,
                  },
                  {
                    name: t('receiver.receiverPermitDetails'),
                    href: `${params.id}/receiver/permit`,
                    status: draft.receiver.permitDetails.status,
                  },
                  {
                    name: t('receiver.checkYourAnswers'),
                    href: `${params.id}/receiver/check-your-answers`,
                    status: 'CannotStart',
                  },
                ],
              },
            ]}
          />
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
