import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { generateApiUrl } from '../../../../../utils';
import { options } from '../../../../api/auth/[...nextauth]/options';
import Link from 'next/link';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { BackLink, Page } from '@wts/ui/shared-ui/server';
import {
  ConfirmSectionAnswers,
  areSameAddress,
  formatAddress,
} from '@wts/app-uk-waste-movements/feature-single';
import { generateSectionStatuses } from '@wts/app-uk-waste-movements/feature-single';
import { getLocale } from 'next-intl/server';
import type { SICCode } from '@wts/api/reference-data';

export const metadata: Metadata = {
  title: 'Check your answers',
  description: 'Create a new single waste movement',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProducerCheckYourAnswersPage({
  params,
}: PageProps): Promise<React.ReactNode> {
  const t = await getTranslations('single.producer.checkYourAnswers');
  const session = await getServerSession(options);
  const apiUrl = generateApiUrl();
  const locale = (await getLocale()) as 'en' | 'cy';

  const formStrings = {
    legendText: t('form.legend'),
    radioOne: t('form.radioOne'),
    radioTwo: t('form.radioTwo'),
    button: t('form.button'),
    errorSummaryTitle: t('form.errorSummaryTitle'),
    validationError: t('form.validationError'),
  };

  if (!session?.token) {
    console.error('No token present');
    return redirect('/error');
  }

  let draftResponse: Response;
  try {
    draftResponse = await fetch(`${apiUrl}/ukwm/drafts/${params.id}`, {
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

  if (!draftResponse.ok) {
    if (draftResponse.status === 404) {
      return redirect('/404');
    } else {
      return redirect('/error');
    }
  }

  let sicCodesReferenceResponse: Response;
  try {
    sicCodesReferenceResponse = await fetch(
      `${apiUrl}/reference-data/sic-codes`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      },
    );
  } catch (error) {
    console.error(
      'An error occured whilst fetching reference SIC Codes',
      error,
    );
    return redirect('/error');
  }

  const referenceDataQuery = await sicCodesReferenceResponse.json();

  const draft = await draftResponse.json();

  const codesWithLocaleDescriptions =
    draft.producerAndCollection.producer.sicCodes.values.map(
      (value: string) => {
        const codeReference = referenceDataQuery.find(
          (item: SICCode) => item.code === value,
        );

        return {
          code: value,
          description:
            locale === 'en'
              ? codeReference.description.en
              : codeReference.description.cy,
        };
      },
    );

  const sectionStatuses = generateSectionStatuses(draft);

  if (sectionStatuses.producer.checkYourAnswers === 'CannotStart') {
    return redirect(`/single/${params.id}`);
  }

  const usesSameAddresses = areSameAddress(
    draft.producerAndCollection.producer.address,
    draft.producerAndCollection.wasteCollection.address,
  );

  return (
    <Page
      beforeChildren={
        <BackLink text={t('backLink')} href={`#`} routerBack={true} />
      }
    >
      <GovUK.GridRow>
        <GovUK.GridCol size="two-thirds">
          <ConfirmSectionAnswers
            token={session.token}
            endpoint={`${apiUrl}/ukwm/drafts/${params.id}/producer-confirmation`}
            nextPage={`/single/${params.id}`}
            formStrings={formStrings}
          >
            <GovUK.Heading size={'l'} level={1}>
              {t('headingOne')}
            </GovUK.Heading>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
            <GovUK.Heading size={'m'} level={2}>
              {t('headingTwo')}
            </GovUK.Heading>
            <GovUK.Paragraph>{t('description')}</GovUK.Paragraph>
            <GovUK.SummaryList
              hideBorders={true}
              items={[
                {
                  key: t('labels.producerAddress'),
                  value: formatAddress(
                    JSON.stringify(
                      draft.producerAndCollection.producer.address,
                    ),
                    1,
                  ),

                  action: (
                    <Link
                      href={`/single/${params.id}/producer/address?check=true`}
                    >
                      {t('changeLink')}
                      <span className="govuk-visually-hidden">
                        {t('labels.producerAddress')}
                      </span>
                    </Link>
                  ),
                },
              ]}
            />
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
            <GovUK.Heading size={'m'} level={3}>
              {t('headingThree')}
            </GovUK.Heading>
            <GovUK.SummaryList
              hideBorders={true}
              items={[
                {
                  key: t('labels.organisationName'),
                  value:
                    draft.producerAndCollection.producer.contact
                      .organisationName,
                  action: (
                    <Link
                      href={`/single/${params.id}/producer/contact?check=true`}
                    >
                      {t('changeLink')}
                      <span className="govuk-visually-hidden">
                        {t('headingThree')}
                      </span>
                    </Link>
                  ),
                },
                {
                  key: t('labels.contactName'),
                  value: draft.producerAndCollection.producer.contact.fullName,
                },
                {
                  key: t('labels.contactEmail'),
                  value:
                    draft.producerAndCollection.producer.contact.emailAddress,
                },
                {
                  key: t('labels.phoneNumber'),
                  value:
                    draft.producerAndCollection.producer.contact.phoneNumber,
                },
                {
                  key: t('labels.faxNumber'),
                  value:
                    draft.producerAndCollection.producer.contact.faxNumber ??
                    t('notProvided'),
                },
              ]}
            />
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
            <GovUK.SummaryList
              hideBorders={true}
              items={[
                {
                  key: t('labels.sicCodes', {
                    count: codesWithLocaleDescriptions.length,
                  }),
                  value: (
                    <ul className="govuk-list">
                      {codesWithLocaleDescriptions.map(
                        (code: { code: number; description: string }) => (
                          <li key={code.code}>
                            <span className="govuk-!-font-weight-bold">
                              {code.code}:{' '}
                            </span>
                            {code.description}
                          </li>
                        ),
                      )}
                    </ul>
                  ),
                  action: (
                    <Link
                      href={`/single/${params.id}/producer/sic-code?check=true`}
                    >
                      {t('changeLink')}
                      <span className="govuk-visually-hidden">
                        {t('labels.sicCodes', { count: 1 })}
                      </span>
                    </Link>
                  ),
                },
                {
                  key: t('labels.collectionAddress'),
                  value: (
                    <>
                      {usesSameAddresses && (
                        <>
                          <p>{t('sameAddress')}</p>
                          <br />
                        </>
                      )}

                      {formatAddress(
                        JSON.stringify(
                          draft.producerAndCollection.wasteCollection.address,
                        ),
                        2,
                      )}
                    </>
                  ),
                  action: (
                    <Link
                      href={`/single/${params.id}/producer/collection-details?check=true`}
                    >
                      {t('changeLink')}
                      <span className="govuk-visually-hidden">
                        {t('labels.collectionAddress')}
                      </span>
                    </Link>
                  ),
                },
              ]}
            />
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
            <GovUK.SummaryList
              hideBorders={true}
              items={[
                {
                  key: t('labels.wasteSource'),
                  value:
                    draft.producerAndCollection.wasteCollection.wasteSource
                      .value,
                  action: (
                    <Link
                      href={`/single/${params.id}/producer/source?check=true`}
                    >
                      {t('changeLink')}
                      <span className="govuk-visually-hidden">
                        {t('labels.wasteSource')}
                      </span>
                    </Link>
                  ),
                },
              ]}
            />
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
          </ConfirmSectionAnswers>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
