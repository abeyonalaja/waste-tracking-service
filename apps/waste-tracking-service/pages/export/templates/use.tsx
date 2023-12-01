import React, {
  useEffect,
  useState,
  useReducer,
  useCallback,
  FormEvent,
} from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import { useTranslation } from 'react-i18next';
import {
  CompleteFooter,
  CompleteHeader,
  BreadcrumbWrap,
  Loading,
  Error404Content,
  Paragraph,
} from 'components';
import { isNotEmpty, validateReference } from 'utils/validators';

const VIEWS = {
  DEFAULT: 1,
};

type State = {
  data: any;
  isLoading: boolean;
  isError: boolean;
  showView: number;
  errors: {
    reference?: string;
  };
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'DATA_UPDATE'
    | 'ERRORS_UPDATE'
    | 'SHOW_VIEW';
  payload?: any;
};

const initialState: State = {
  data: { status: 'Started', values: [] },
  isLoading: true,
  isError: false,
  showView: VIEWS.DEFAULT,
  errors: null,
};

const templateReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'DATA_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'DATA_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'DATA_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'DATA_UPDATE':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case 'ERRORS_UPDATE':
      return {
        ...state,
        errors: action.payload,
      };
    case 'SHOW_VIEW':
      return {
        ...state,
        errors: null,
        isLoading: false,
        isError: false,
        showView: action.payload,
      };
    default:
      throw new Error();
  }
};

const TemplateUse = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [templatePage, dispatchTemplatePage] = useReducer(
    templateReducer,
    initialState
  );
  const [templateId, setTemplateId] = useState(null);
  const [reference, setReference] = useState<string>(null);

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(router.query.templateId);
    }
  }, [router.isReady, router.query.templateId]);

  useEffect(() => {
    dispatchTemplatePage({ type: 'DATA_FETCH_INIT' });
    if (templateId !== null) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${templateId}`
      )
        .then((response) => {
          if (response.ok) return response.json();
          else {
            dispatchTemplatePage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          if (data !== undefined) {
            dispatchTemplatePage({
              type: 'DATA_FETCH_SUCCESS',
              payload: data,
            });
          }
        });
    }
  }, [router.isReady, templateId]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      const newErrors = {
        reference: validateReference(reference),
      };
      if (isNotEmpty(newErrors)) {
        dispatchTemplatePage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        dispatchTemplatePage({ type: 'ERRORS_UPDATE', payload: null });
        const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/copy-template/${templateId}`;
        const body = JSON.stringify({ reference });
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
              router.push({
                pathname: `/export/incomplete/tasklist`,
                query: { id, context: 'createdFromTemplate' },
              });
            });
        } catch (e) {
          console.error(e);
        }
      }
      e.preventDefault();
    },
    [templateId, reference]
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
          {router.query.context === 'manage' && (
            <GovUK.Breadcrumbs.Link href="/export/templates">
              {t('templates.manage.title')}
            </GovUK.Breadcrumbs.Link>
          )}
          {router.query.context === 'use' && (
            <GovUK.Breadcrumbs.Link href="/export/templates?context=use">
              {t('templates.useTemplates.title')}
            </GovUK.Breadcrumbs.Link>
          )}
        </GovUK.Breadcrumbs>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('templates.use.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            {templatePage.isError && !templatePage.isLoading && (
              <Error404Content />
            )}
            {templatePage.isLoading && <Loading />}
            {!templatePage.isError && !templatePage.isLoading && (
              <>
                {templatePage.errors &&
                  !!Object.keys(templatePage.errors).length && (
                    <GovUK.ErrorSummary
                      heading={t('errorSummary.title')}
                      errors={Object.keys(templatePage.errors).map((key) => ({
                        targetName: key,
                        text: templatePage.errors[key],
                      }))}
                    />
                  )}
                {templatePage.showView === VIEWS.DEFAULT && (
                  <>
                    <GovUK.Heading size="LARGE" id="template-use-title">
                      {t('templates.use.title')}
                    </GovUK.Heading>
                    <Paragraph>{t('templates.use.intro')}</Paragraph>
                    <GovUK.GridRow>
                      <GovUK.GridCol setWidth="one-half">
                        <form onSubmit={handleSubmit}>
                          <GovUK.FormGroup>
                            <GovUK.InputField
                              input={{
                                name: 'reference',
                                id: 'reference',
                                value: reference === null ? '' : reference,
                                maxLength: 50,
                                onChange: (e) => setReference(e.target.value),
                              }}
                              meta={{
                                error: templatePage.errors?.reference,
                                touched: !!templatePage.errors?.reference,
                              }}
                            >
                              {t('yourReference.inputLabel')}
                            </GovUK.InputField>
                          </GovUK.FormGroup>
                          <GovUK.Button id="saveButton">
                            {t('saveButton')}
                          </GovUK.Button>
                        </form>
                      </GovUK.GridCol>
                    </GovUK.GridRow>
                  </>
                )}
              </>
            )}
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default TemplateUse;
