import React, { useState, useCallback, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import '../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  ConditionalRadioWrap,
} from '../components';
import {
  isNotEmpty,
  validateOwnReference,
  validateReference,
} from '../utils/validators';
import { useSubmissionContext } from '../contexts';

export function AddYourOwnExportReference() {
  const { t } = useTranslation();
  const router = useRouter();
  const { submission, setSubmission } = useSubmissionContext();
  const [id, setId] = useState<string>(submission?.id || null);
  const [ownReference, setOwnReference] = useState<string>(
    submission?.ownReference
  );
  const [reference, setReference] = useState<string>(
    submission?.reference || null
  );
  const [errors, setErrors] = useState<{
    ownReference?: string;
    reference?: string;
  }>({});

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      if (id !== undefined) {
        try {
          fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}`)
            .then((response) => response.json())
            .then((data) => {
              const { id, reference } = data;
              setId(id);
              setReference(reference);
              setOwnReference(reference === null ? 'no' : 'yes');
            });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [router.isReady, router.query]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      const updateData = () => {
        const url = `${process.env.NX_API_GATEWAY_URL}/submissions/${id}/reference`;
        try {
          fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ownReference === 'yes' ? reference : null),
          }).then(() => {
            router.push({
              pathname: '/submit-an-export-tasklist',
              query: { id },
            });
          });
        } catch (e) {
          console.error(e);
        }
      };

      const postData = () => {
        let body;
        const url = `${process.env.NX_API_GATEWAY_URL}/submissions`;
        if (ownReference === 'yes') {
          body = JSON.stringify({ reference });
        } else {
          body = JSON.stringify({});
        }
        try {
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: body,
          })
            .then((response) => response.json())
            .then((data) => {
              const { id } = data;
              setSubmission({
                id: id,
                ownReference: ownReference,
                reference: ownReference === 'yes' ? reference : null,
              });
              router.push({
                pathname: '/submit-an-export-tasklist',
                query: { id },
              });
            });
        } catch (e) {
          console.error(e);
        }
      };

      const newErrors = {
        ownReference: validateOwnReference(ownReference),
        reference: validateReference(ownReference, reference),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        if (id === null) {
          postData();
        } else {
          updateData();
        }
      }
      e.preventDefault();
    },
    [ownReference, reference, id, router, setSubmission]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.Breadcrumbs>
          <GovUK.Breadcrumbs.Link href="/">
            {t('app.title')}
          </GovUK.Breadcrumbs.Link>
          <GovUK.Breadcrumbs.Link href="/dashboard">
            {t('app.channel.title')}
          </GovUK.Breadcrumbs.Link>
          {t('yourReference.breadcrumb')}
        </GovUK.Breadcrumbs>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('yourReference.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {errors && !!Object.keys(errors).length && (
              <GovUK.ErrorSummary
                heading={t('errorSummary.title')}
                errors={Object.keys(errors).map((key) => ({
                  targetName: key,
                  text: errors[key],
                }))}
              />
            )}
            <form onSubmit={handleSubmit}>
              <GovUK.Fieldset>
                <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                  {t('yourReference.title')}
                </GovUK.Fieldset.Legend>
                <GovUK.MultiChoice
                  mb={6}
                  hint={t('yourReference.hint')}
                  meta={{
                    error: errors?.ownReference,
                    touched: !!errors?.ownReference,
                  }}
                  label=""
                >
                  <GovUK.Radio
                    name="ownReference"
                    id="ownReferenceYes"
                    checked={ownReference === 'yes'}
                    onChange={() => setOwnReference('yes')}
                  >
                    Yes
                  </GovUK.Radio>
                  {ownReference === 'yes' && (
                    <ConditionalRadioWrap>
                      <GovUK.InputField
                        input={{
                          name: 'reference',
                          id: 'reference',
                          value: reference === null ? '' : reference,
                          maxLength: 50,
                          onChange: (e) => setReference(e.target.value),
                        }}
                        meta={{
                          error: errors?.reference,
                          touched: !!errors?.reference,
                        }}
                      >
                        {t('yourReference.inputLabel')}
                      </GovUK.InputField>
                    </ConditionalRadioWrap>
                  )}
                  <GovUK.Radio
                    name="ownReference"
                    id="ownReferenceNo"
                    checked={ownReference === 'no'}
                    onChange={() => setOwnReference('no')}
                  >
                    No
                  </GovUK.Radio>
                </GovUK.MultiChoice>
              </GovUK.Fieldset>
              <GovUK.Button id="saveButton">{t('saveButton')}</GovUK.Button>
            </form>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
}

export default AddYourOwnExportReference;
