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
  Footer,
  Header,
  BreadcrumbWrap,
  ErrorSummary,
  Loading,
  Error404Content,
  TextareaCharCount,
  ButtonGroup,
  SaveReturnButton,
  SubmissionSummary,
} from 'components';
import {
  isNotEmpty,
  validateTemplateDesc,
  validateTemplateName,
} from 'utils/validators';
import useApiConfig from 'utils/useApiConfig';

const VIEWS = {
  DEFAULT: 1,
};

type State = {
  data: any;
  isLoading: boolean;
  isError: boolean;
  showView: number;
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'SHOW_VIEW';
  payload?: any;
};

const initialState: State = {
  data: { status: 'Started', values: [] },
  isLoading: true,
  isError: false,
  showView: VIEWS.DEFAULT,
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

const TemplateCreateFromRecord = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [templatePage, dispatchTemplatePage] = useReducer(
    templateReducer,
    initialState
  );
  const [id, setId] = useState(null);
  const [returnUrl, setReturnUrl] = useState(null);
  const [templateName, setTemplateName] = useState<string>('');
  const [templateDesc, setTemplateDesc] = useState<string>('');
  const [errors, setErrors] = useState<{
    templateName?: string;
    templateDesc?: string;
  }>({});

  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
      if (router.query.context === 'created') {
        setReturnUrl('/submitted/export-submitted');
      }
      if (router.query.context === 'view') {
        setReturnUrl('/submitted/view');
      }
      if (router.query.context === 'index') {
        setReturnUrl('/submitted');
      }
    }
  }, [router.isReady, router.query.id, router.query.context]);

  useEffect(() => {
    const fetchData = async () => {
      dispatchTemplatePage({ type: 'DATA_FETCH_INIT' });
      if (id !== null) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/submissions/${id}`,
          {
            headers: apiConfig,
          }
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
    };
    fetchData();
  }, [router.isReady, id]);

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
        const url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/copy-submission/${id}`;
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
                  pathname: `/templates/tasklist`,
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
              pathname: returnUrl,
              query: { id },
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
        <title>{t('templates.copy.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
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
                {errors && !!Object.keys(errors).length && (
                  <ErrorSummary
                    heading={t('errorSummary.title')}
                    errors={Object.keys(errors).map((key) => ({
                      targetName: key,
                      text: errors[key],
                    }))}
                  />
                )}
                {templatePage.showView === VIEWS.DEFAULT && (
                  <>
                    <GovUK.Caption size="L">
                      {t('exportJourney.updateAnnexSeven.delete.caption')}{' '}
                      {
                        templatePage.data.submissionDeclaration.values
                          .transactionId
                      }
                    </GovUK.Caption>
                    <GovUK.Heading size="L">
                      {t('templates.create.fromRecord.title')}
                    </GovUK.Heading>
                    <form onSubmit={handleSubmit}>
                      <GovUK.GridRow>
                        <GovUK.GridCol setWidth="two-thirds">
                          <GovUK.FormGroup>
                            <GovUK.InputField
                              input={{
                                name: 'templateName',
                                id: 'templateName',
                                value: templateName,
                                maxLength: 50,
                                onChange: (e) =>
                                  setTemplateName(e.target.value),
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
                        </GovUK.GridCol>
                      </GovUK.GridRow>
                      <ButtonGroup>
                        <GovUK.Button>
                          {t('templates.create.createButton')}
                        </GovUK.Button>
                        <SaveReturnButton
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push({
                              pathname: returnUrl,
                              query: { id },
                            });
                          }}
                        >
                          {t('templates.create.cancelButton')}
                        </SaveReturnButton>
                      </ButtonGroup>
                    </form>
                    <SubmissionSummary
                      data={templatePage.data}
                      showChangeLinks={false}
                      isTemplate={true}
                      apiConfig={apiConfig}
                    />
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

export default TemplateCreateFromRecord;
TemplateCreateFromRecord.auth = true;
