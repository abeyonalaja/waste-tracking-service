import React, { useState, useCallback, FormEvent, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import { useSubmissionContext } from 'contexts';
import { useTranslation } from 'react-i18next';
import { Footer, Header, BreadcrumbWrap, Paragraph } from 'components';
import { isNotEmpty, validateReference } from 'utils/validators';
import { getApiConfig } from 'utils/api/apiConfig';
import { PageProps } from 'types/wts';

export const getServerSideProps = async (context) => {
  return getApiConfig(context);
};
export function Reference({ apiConfig }: PageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { submission, setSubmission } = useSubmissionContext();
  const [id, setId] = useState<string>(submission?.id || null);
  const [reference, setReference] = useState<string>(
    submission?.reference || null
  );
  const [errors, setErrors] = useState<{
    ownReference?: string;
    reference?: string;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      if (router.isReady) {
        const { id } = router.query;
        if (id !== undefined) {
          try {
            fetch(
              `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}`,
              {
                headers: apiConfig,
              }
            )
              .then((response) => response.json())
              .then((data) => {
                const { id, reference } = data;
                setId(id);
                setReference(reference);
              });
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    fetchData();
  }, [router.isReady, router.query]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      const updateData = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}/reference`;
        try {
          await fetch(url, {
            method: 'PUT',
            headers: apiConfig,
            body: JSON.stringify(reference.trim()),
          }).then(() => {
            router.push({
              pathname: `/export/incomplete/tasklist`,
              query: { id },
            });
          });
        } catch (e) {
          console.error(e);
        }
      };
      const postData = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions`;
        const body = JSON.stringify({ reference });
        try {
          await fetch(url, {
            method: 'POST',
            headers: apiConfig,
            body: body,
          })
            .then((response) => {
              if (response.ok) return response.json();
              else {
                if (response.status === 403) {
                  router.push({
                    pathname: `/403/`,
                  });
                }
              }
            })
            .then((data) => {
              const { id } = data;
              setSubmission({
                id,
                reference,
              });
              router.push({
                pathname: `/export/incomplete/tasklist`,
                query: { id },
              });
            });
        } catch (e) {
          console.error(e);
        }
      };

      const newErrors = {
        reference: validateReference(reference),
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
    [reference, id, router, setSubmission]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.Breadcrumbs>
          <GovUK.Breadcrumbs.Link href="/">
            {t('app.parentTitle')}
          </GovUK.Breadcrumbs.Link>
          <GovUK.Breadcrumbs.Link href="/export">
            {t('app.title')}
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
        header={<Header />}
        footer={<Footer />}
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

            <GovUK.Heading size="LARGE" id="template-use-title">
              {t('yourReference.title')}
            </GovUK.Heading>
            <Paragraph>{t('yourReference.intro')}</Paragraph>
            <GovUK.GridRow>
              <GovUK.GridCol setWidth="one-half">
                <form onSubmit={handleSubmit}>
                  <GovUK.FormGroup>
                    <GovUK.InputField
                      input={{
                        name: 'reference',
                        id: 'reference',
                        value: reference === null ? '' : reference,
                        maxLength: 20,
                        onChange: (e) => setReference(e.target.value),
                      }}
                      meta={{
                        error: errors?.reference,
                        touched: !!errors?.reference,
                      }}
                    >
                      {t('yourReference.inputLabel')}
                    </GovUK.InputField>
                  </GovUK.FormGroup>
                  <GovUK.Button id="saveButton">{t('saveButton')}</GovUK.Button>
                </form>
              </GovUK.GridCol>
            </GovUK.GridRow>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
}

export default Reference;
Reference.auth = true;
