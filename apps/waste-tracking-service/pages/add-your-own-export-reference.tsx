import React, { useState, useCallback, FormEvent } from 'react';
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
import { validateOwnReference, validateReference } from '../utils/validators';
import { useSubmissionContext } from '../contexts';

function isNotEmpty(obj) {
  return Object.keys(obj).some((key) => obj[key]?.length > 0);
}

export function AddYourOwnExportReference() {
  const { t } = useTranslation();
  const router = useRouter();
  const { submission, setSubmission } = useSubmissionContext();
  const [ownReference, setOwnReference] = useState<string>(
    submission?.ownReference
  );
  const [reference, setReference] = useState<string>(
    submission?.reference || ''
  );
  const [errors, setErrors] = useState<{
    ownReference?: string;
    reference?: string;
  }>({});

  const postData = () => {
    try {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference: reference,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const { id } = data;
          setSubmission({
            id: id,
            ownReference: ownReference,
            reference: reference,
          });
          router.push({
            pathname: '/dashboard/submit-an-export',
            query: { id: id, reference: reference },
          });
        });
    } catch (e) {
      console.error(e);
    }
  };

  const updateData = () => {
    try {
      fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${submission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reference: reference,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const { submissionId } = data;
          setSubmission({
            id: submission.id,
            ownReference: ownReference,
            reference: reference,
          });
          router.push({
            pathname: '/dashboard/submit-an-export',
            query: { id: submission.id, reference: reference },
          });
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      const newErrors = {
        ownReference: validateOwnReference(ownReference),
        reference: validateReference(ownReference, reference),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        if (submission?.id === undefined) {
          postData();
        } else {
          updateData();
        }
      }
      e.preventDefault();
    },
    [ownReference, reference]
  );

  return (
    <>
      <Head>
        <title>{t('yourReference.title')}</title>
      </Head>
      <CompleteHeader />
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
      <main id="content">
        <GovUK.Main>
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
                    mb={8}
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
                            value: reference,
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
                <GovUK.Button id="saveButton">
                  {t('yourReference.button')}
                </GovUK.Button>
              </form>
            </GovUK.GridCol>
          </GovUK.GridRow>
        </GovUK.Main>
      </main>
      <CompleteFooter />
    </>
  );
}

export default AddYourOwnExportReference;
