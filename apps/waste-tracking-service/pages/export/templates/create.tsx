import React, { useState, useCallback, FormEvent } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  BreadcrumbWrap,
  ButtonGroup,
  ErrorSummary,
  TextareaCharCount,
  SaveReturnButton,
} from 'components';
import {
  isNotEmpty,
  validateTemplateName,
  validateTemplateDesc,
} from 'utils/validators';
import useApiConfig from 'utils/useApiConfig';

const TemplateCreate = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [templateName, setTemplateName] = useState<string>('');
  const [templateDesc, setTemplateDesc] = useState<string>('');
  const [errors, setErrors] = useState<{
    templateName?: string;
    templateDesc?: string;
  }>({});

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const newErrors = {
        templateName: validateTemplateName(templateName),
        templateDesc: validateTemplateDesc(templateDesc),
      };
      if (isNotEmpty(newErrors)) {
        setErrors(newErrors);
      } else {
        setErrors(null);
        const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates`;
        const body = JSON.stringify({
          templateDetails: {
            name: templateName,
            description: templateDesc,
          },
        });
        try {
          await fetch(url, {
            method: 'POST',
            headers: apiConfig,
            body: body,
          })
            .then((response) => response.json())
            .then((data) => {
              if (data?.statusCode === 409) {
                const newErrors = {
                  templateName: data?.message,
                };
                setErrors(newErrors);
              } else {
                router.push({
                  pathname: `/export/templates/tasklist`,
                  query: { templateId: data.id, context: 'created' },
                });
              }
            });
        } catch (e) {
          console.error(e);
        }
      }
    },
    [router, templateName, templateDesc]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        <GovUK.BackLink
          href="#"
          onClick={(e) => {
            router.push({
              pathname:
                router.query.context === 'dashboard'
                  ? `/export/`
                  : `/export/templates`,
            });
            e.preventDefault();
          }}
        >
          {t('back')}
        </GovUK.BackLink>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('templates.create.title')}</title>
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
              <ErrorSummary
                heading={t('errorSummary.title')}
                errors={Object.keys(errors).map((key) => ({
                  targetName: key,
                  text: errors[key],
                }))}
              />
            )}
            <GovUK.Caption size="L">
              {t('templates.create.caption')}
            </GovUK.Caption>
            <GovUK.Heading size="L">
              {t('templates.create.title')}
            </GovUK.Heading>
            <GovUK.GridRow>
              <GovUK.GridCol setWidth="two-thirds">
                <form onSubmit={handleSubmit}>
                  <GovUK.FormGroup>
                    <GovUK.InputField
                      input={{
                        name: 'templateName',
                        id: 'templateName',
                        value: templateName,
                        maxLength: 50,
                        onChange: (e) => setTemplateName(e.target.value),
                      }}
                      meta={{
                        error: errors?.templateName,
                        touched: !!errors?.templateName,
                      }}
                    >
                      {t('templates.create.nameLabel')}
                    </GovUK.InputField>
                  </GovUK.FormGroup>
                  <TextareaCharCount
                    id="templateDesc"
                    name="templateDesc"
                    onChange={(e) => setTemplateDesc(e.target.value)}
                    errorMessage={errors?.templateDesc}
                    charCount={100}
                    rows={3}
                    value={templateDesc}
                  >
                    <GovUK.Label htmlFor="templateDesc">
                      <GovUK.LabelText>
                        {t('templates.create.descLabel')}
                      </GovUK.LabelText>
                    </GovUK.Label>
                  </TextareaCharCount>

                  <ButtonGroup>
                    <GovUK.Button>
                      {t('templates.create.createButton')}
                    </GovUK.Button>
                    <SaveReturnButton
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push({
                          pathname:
                            router.query.context === 'dashboard'
                              ? `/export/`
                              : `/export/templates`,
                        });
                      }}
                    >
                      {t('cancelButton')}
                    </SaveReturnButton>
                  </ButtonGroup>
                </form>
              </GovUK.GridCol>
            </GovUK.GridRow>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default TemplateCreate;
TemplateCreate.auth = true;
