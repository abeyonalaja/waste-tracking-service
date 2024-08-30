'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { Add, AddStrings } from './_Add';
import { List, ListStrings } from './_List';
import { Remove, RemoveStrings } from './_Remove';
import * as GovUK from '@wts/ui/govuk-react-ui';
import { BackLink, Loading, Page } from '@wts/ui/shared-ui/server';
import type { SICCode } from '@wts/api/reference-data';

interface Strings {
  backLink: string;
  caption: string;
  maxWarning: string;
  titleNone: string;
  titleOne: string;
  titleMultipleOne: string;
  titleMultipleTwo: string;
  description: string;
  link: string;
  saveAndContinue: string;
  saveAndReturn: string;
  remove: RemoveStrings;
  add: AddStrings;
  list: ListStrings;
}

interface SicCodesProps {
  id: string;
  token: string;
  apiUrl: string;
  strings: Strings;
}

export function SicCodes({
  id,
  token,
  apiUrl,
  strings,
}: SicCodesProps): React.ReactNode {
  const router = useRouter();
  const locale = useLocale();
  const [codeToRemove, setCodeToRemove] = useState<string>('');

  const addedCodesQuery = useQuery({
    queryKey: ['sicCodes', id],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/ukwm/drafts/${id}/sic-code`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    },
  });

  const referenceDataQuery = useQuery({
    queryKey: ['referenceSicCodes'],
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 60,
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/reference-data/sic-codes`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    },
  });

  if (addedCodesQuery.isError || referenceDataQuery.isError) {
    console.error(addedCodesQuery.error || referenceDataQuery.error);
    router.push('/error');
  }

  if (addedCodesQuery.isFetching || referenceDataQuery.isFetching) {
    return (
      <Page>
        <GovUK.GridRow>
          <GovUK.GridCol size="full">
            <Loading centered={true} />
          </GovUK.GridCol>
        </GovUK.GridRow>
      </Page>
    );
  }

  if (codeToRemove) {
    const codeReference = referenceDataQuery.data.find(
      (item: SICCode) => item.code === codeToRemove,
    );

    const codeWithLocaleDescription = {
      code: codeToRemove,
      description:
        locale === 'en'
          ? codeReference.description.en
          : codeReference.description.cy,
    };

    return (
      <Page
        beforeChildren={
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCodeToRemove('');
            }}
            className={`govuk-back-link`}
          >
            {strings.backLink}
          </Link>
        }
      >
        <GovUK.GridRow>
          <GovUK.GridCol>
            <Remove
              id={id}
              code={codeWithLocaleDescription}
              token={token}
              apiUrl={apiUrl}
              setCodeToRemove={setCodeToRemove}
              strings={strings.remove}
            />
          </GovUK.GridCol>
        </GovUK.GridRow>
      </Page>
    );
  }

  const codesWithLocaleDescriptions = addedCodesQuery.data.values.map(
    (value: string) => {
      const codeReference = referenceDataQuery.data.find(
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

  if (addedCodesQuery.data.values.length === 4) {
    return (
      <Page beforeChildren={<BackLink routerBack={true} href="#" />}>
        <GovUK.GridRow>
          <GovUK.GridCol>
            <GovUK.Caption>{strings.caption}</GovUK.Caption>
            <GovUK.Heading>
              {strings.titleMultipleOne} {addedCodesQuery.data.values.length}{' '}
              {strings.titleMultipleTwo}
            </GovUK.Heading>
            <GovUK.WarningText>{strings.maxWarning}</GovUK.WarningText>
            <List
              addedCodes={codesWithLocaleDescriptions}
              setCodeToRemove={setCodeToRemove}
              strings={strings.list}
            />
            <GovUK.ButtonGroup>
              <GovUK.Button
                href={`/single/${id}/producer/collection-details/reuse`}
              >
                {strings.saveAndContinue}
              </GovUK.Button>
              <GovUK.Button secondary={true} href={`/single/${id}/`}>
                {strings.saveAndReturn}
              </GovUK.Button>
            </GovUK.ButtonGroup>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </Page>
    );
  }

  if (addedCodesQuery.data.values.length === 0) {
    return (
      <Page beforeChildren={<BackLink routerBack={true} href="#" />}>
        <GovUK.GridRow>
          <GovUK.GridCol>
            <Add
              id={id}
              token={token}
              apiUrl={apiUrl}
              addedCodes={addedCodesQuery.data.values}
              strings={strings.add}
            >
              <GovUK.Caption>{strings.caption}</GovUK.Caption>
              <GovUK.Heading>{strings.titleNone}</GovUK.Heading>
              <p>
                {strings.description}
                <Link
                  href="https://find-and-update.company-information.service.gov.uk/"
                  target="__blank"
                >
                  {strings.link}
                </Link>
                .
              </p>
              <List
                addedCodes={codesWithLocaleDescriptions}
                setCodeToRemove={setCodeToRemove}
                strings={strings.list}
              />
            </Add>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </Page>
    );
  }

  return (
    <Page beforeChildren={<BackLink routerBack={true} href="#" />}>
      <GovUK.GridRow>
        <GovUK.GridCol>
          <Add
            id={id}
            token={token}
            apiUrl={apiUrl}
            addedCodes={addedCodesQuery.data.values}
            strings={strings.add}
          >
            <GovUK.Caption>{strings.caption}</GovUK.Caption>
            <GovUK.Heading>
              {addedCodesQuery.data.values.length === 1
                ? strings.titleOne
                : `${strings.titleMultipleOne} ${addedCodesQuery.data.values.length} ${strings.titleMultipleTwo}`}
            </GovUK.Heading>
            <List
              addedCodes={codesWithLocaleDescriptions}
              setCodeToRemove={setCodeToRemove}
              strings={strings.list}
            />
          </Add>
        </GovUK.GridCol>
      </GovUK.GridRow>
    </Page>
  );
}
