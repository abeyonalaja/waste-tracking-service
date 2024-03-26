import React, { useCallback, useEffect, useReducer, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as GovUK from 'govuk-react';
import { useTranslation } from 'react-i18next';
import {
  Footer,
  Header,
  BreadCrumbLink,
  BreadcrumbWrap,
  Paragraph,
  SubmissionNotFound,
  Loading,
  AppLink,
  ButtonGroup,
  BreakableString,
  ErrorSummary,
  NotificationBanner,
  Pagination,
} from 'components';
import { formatDate } from 'utils/formatDate';
import styled from 'styled-components';
import { isNotEmpty, validateConfirmRemove } from 'utils/validators';
import useApiConfig from 'utils/useApiConfig';

enum VIEWS {
  LIST = 0,
  CONFIRM = 1,
}

const ActionHeader = styled(GovUK.H2)`
  border-top: 2px solid #1d70b8;
  padding-top: 1em;
  margin-bottom: 0.5em;
`;

const ActionLink = styled.div`
  margin-bottom: 7px;
`;

type State = {
  data: any;
  showView: number;
  isLoading: boolean;
  isError: boolean;
  errors: {
    confirmRemove: string;
  };
};

type Action = {
  type:
    | 'DATA_FETCH_INIT'
    | 'DATA_FETCH_SUCCESS'
    | 'DATA_FETCH_FAILURE'
    | 'ERRORS_UPDATE'
    | 'SHOW_VIEW';
  payload?: any;
};

const manageTemplatesState: State = {
  data: null,
  showView: VIEWS.LIST,
  isLoading: true,
  isError: false,
  errors: null,
};

const templatesReducer = (state: State, action: Action) => {
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

const TableCell = styled(GovUK.Table.Cell)`
  vertical-align: top;
`;

const TableCellActions = styled(GovUK.Table.Cell)`
  vertical-align: top;
`;

const TableHeader = styled(GovUK.Table.CellHeader)`
  vertical-align: top;
`;

const ManageTemplates = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const apiConfig = useApiConfig();
  const [templatesPage, dispatchTemplatePage] = useReducer(
    templatesReducer,
    manageTemplatesState
  );
  const [templateId, setTemplateId] = useState<string>(null);
  const [context, setContext] = useState<string>(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [paginationToken, setPaginationToken] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      setPaginationToken(router.query.paginationToken || 'NO_TOKEN_SET');
      setTemplateId(String(router.query.templateId));
      setContext(String(router.query.context));
    }
  }, [
    router.isReady,
    router.query.templateId,
    router.query.context,
    router.query.paginationToken,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      let url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates?order=desc`;
      if (paginationToken !== 'NO_TOKEN_SET') {
        url = `${url}&paginationToken=${paginationToken}`;
      }
      dispatchTemplatePage({ type: 'DATA_FETCH_INIT' });
      await fetch(url, { headers: apiConfig })
        .then((response) => {
          if (response.ok) return response.json();
          else {
            if (response.status === 403) {
              router.push({
                pathname: `/403/`,
              });
            }
            dispatchTemplatePage({ type: 'DATA_FETCH_FAILURE' });
          }
        })
        .then((data) => {
          dispatchTemplatePage({
            type: 'DATA_FETCH_SUCCESS',
            payload: data,
          });
        });
    };
    if (paginationToken) {
      fetchData();
    }
  }, [paginationToken]);

  useEffect(() => {
    if (templateId && templatesPage.data) {
      if (templatesPage.data.values !== undefined) {
        const item = templatesPage.data.values.find(
          (template) => template.id === templateId
        );
        if (item) {
          setItemToDelete(item);
          dispatchTemplatePage({
            type: 'SHOW_VIEW',
            payload: VIEWS.CONFIRM,
          });
        }
      }
    }
  }, [templateId, templatesPage.data]);

  const handleDelete = (e, item) => {
    setItemToDelete(item);
    dispatchTemplatePage({
      type: 'SHOW_VIEW',
      payload: VIEWS.CONFIRM,
    });
    e.preventDefault();
  };

  const handleConfirmRemove = useCallback(
    async (e) => {
      e.preventDefault();
      const newErrors = {
        confirmRemove: validateConfirmRemove(confirmRemove, 'record template'),
      };
      if (isNotEmpty(newErrors)) {
        dispatchTemplatePage({ type: 'ERRORS_UPDATE', payload: newErrors });
      } else {
        if (confirmRemove === 'No') {
          dispatchTemplatePage({
            type: 'SHOW_VIEW',
            payload: VIEWS.LIST,
          });
          setConfirmRemove(null);
          dispatchTemplatePage({ type: 'ERRORS_UPDATE', payload: null });
        }
        if (confirmRemove === 'Yes') {
          try {
            await fetch(
              `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/templates/${itemToDelete.id}`,
              {
                method: 'DELETE',
                headers: apiConfig,
              }
            ).then(() => {
              const filteredDate = templatesPage.data;
              filteredDate.values = filteredDate.values.filter(
                (template) => template.id !== itemToDelete.id
              );
              dispatchTemplatePage({
                type: 'DATA_FETCH_SUCCESS',
                payload: filteredDate,
              });
              dispatchTemplatePage({
                type: 'SHOW_VIEW',
                payload: VIEWS.LIST,
              });
              setConfirmRemove(null);
              setShowBanner(true);
              dispatchTemplatePage({ type: 'ERRORS_UPDATE', payload: null });
              router.replace('/templates', undefined, { shallow: true });
            });
          } catch (e) {
            console.error(e);
          }
        }
      }
    },
    [confirmRemove, itemToDelete, dispatchTemplatePage]
  );

  const BreadCrumbs = () => {
    return (
      <BreadcrumbWrap>
        {templatesPage.showView === VIEWS.LIST && (
          <GovUK.Breadcrumbs>
            <BreadCrumbLink href="/">{t('app.parentTitle')}</BreadCrumbLink>
            <BreadCrumbLink href="/">{t('app.title')}</BreadCrumbLink>
            {context === 'use'
              ? t('templates.useTemplates.title')
              : t('templates.manage.title')}
          </GovUK.Breadcrumbs>
        )}
        {templatesPage.showView === VIEWS.CONFIRM && (
          <>
            <GovUK.BackLink
              href="#"
              onClick={(e) => {
                dispatchTemplatePage({
                  type: 'SHOW_VIEW',
                  payload: VIEWS.LIST,
                });
                e.preventDefault();
              }}
            >
              {t('back')}
            </GovUK.BackLink>
          </>
        )}
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>
          {context === 'use'
            ? t('templates.useTemplates.title')
            : t('templates.manage.title')}
        </title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        {templatesPage.isError && !templatesPage.isLoading && (
          <SubmissionNotFound />
        )}
        {templatesPage.isLoading && <Loading />}
        {!templatesPage.isError && !templatesPage.isLoading && (
          <>
            {templatesPage.showView === VIEWS.LIST && (
              <>
                {showBanner && (
                  <GovUK.GridRow>
                    <GovUK.GridCol setWidth="two-thirds">
                      <NotificationBanner
                        type="success"
                        id={`template-banner-delete`}
                        headingText={t('templates.manage.deleteBanner.title')}
                      />
                    </GovUK.GridCol>
                  </GovUK.GridRow>
                )}
                <GovUK.GridRow>
                  <GovUK.GridCol setWidth="two-thirds">
                    {context !== 'use' ? (
                      <>
                        <GovUK.Heading size="LARGE" id="template-heading">
                          {t('templates.manage.title')}
                        </GovUK.Heading>
                        <Paragraph>{t('templates.manage.intro')}</Paragraph>
                      </>
                    ) : (
                      <>
                        <GovUK.Heading size="LARGE" id="template-heading">
                          {t('templates.useTemplates.title')}
                        </GovUK.Heading>
                        <Paragraph>
                          {t('templates.useTemplates.intro')}
                        </Paragraph>
                      </>
                    )}
                  </GovUK.GridCol>
                  <GovUK.GridCol setWidth="one-third">
                    <ActionHeader size="S">
                      {t('templates.manage.newTitle')}
                    </ActionHeader>
                    <GovUK.UnorderedList listStyleType={'none'}>
                      <GovUK.ListItem>
                        <AppLink
                          href={{
                            pathname: `/templates/create`,
                          }}
                        >
                          {t('templates.createLink')}
                        </AppLink>
                      </GovUK.ListItem>
                    </GovUK.UnorderedList>
                  </GovUK.GridCol>
                </GovUK.GridRow>
                <GovUK.GridRow>
                  <GovUK.GridCol>
                    {templatesPage.data === undefined ||
                    templatesPage.data.values === undefined ||
                    templatesPage.data.values?.length === 0 ? (
                      <>
                        <GovUK.Heading size="SMALL">
                          {t('templates.manage.noResults')}
                        </GovUK.Heading>
                      </>
                    ) : (
                      <>
                        <GovUK.Table>
                          <GovUK.Table.Row>
                            <TableHeader
                              id="manage-templates-table-name"
                              setWidth="two-thirds"
                            >
                              {t('templates.template')}
                            </TableHeader>
                            <TableHeader id="manage-templates-table-last-used">
                              {t('templates.manage.table.col.lastUpdated')}
                            </TableHeader>
                            <TableHeader
                              id="manage-templates-table-actions"
                              scope="col"
                            >
                              {t('actions')}
                            </TableHeader>
                          </GovUK.Table.Row>

                          {templatesPage.data.values.map((item, index) => (
                            <GovUK.Table.Row key={`template-row-${index}`}>
                              <TableCell id={`template-name-${index}`}>
                                <AppLink
                                  id={'template-link-tasklist-' + index}
                                  isBold={true}
                                  href={{
                                    pathname: '/templates/tasklist',
                                    query: {
                                      templateId: item.id,
                                      context: 'manage',
                                    },
                                  }}
                                >
                                  {item.templateDetails.name}
                                </AppLink>
                                <GovUK.HintText>
                                  <BreakableString>
                                    {item.templateDetails.description}
                                  </BreakableString>
                                </GovUK.HintText>
                              </TableCell>
                              <TableCell id={`template-last-used-${index}`}>
                                {formatDate(item.templateDetails.lastModified)}
                              </TableCell>
                              <TableCellActions
                                id={`template-actions-${index}`}
                              >
                                <ActionLink>
                                  <AppLink
                                    id={'template-link-use-' + index}
                                    href={{
                                      pathname: '/templates/use',
                                      query: {
                                        templateId: item.id,
                                        context:
                                          context === 'use' ? 'use' : 'manage',
                                      },
                                    }}
                                  >
                                    {t('templates.manage.table.link.use')}
                                  </AppLink>
                                </ActionLink>
                                {context !== 'use' && (
                                  <>
                                    <ActionLink>
                                      <AppLink
                                        id={'template-link-copy-' + index}
                                        href={{
                                          pathname: '/templates/copy',
                                          query: {
                                            templateId: item.id,
                                            context: 'manage',
                                          },
                                        }}
                                      >
                                        {t('templates.manage.table.link.copy')}
                                      </AppLink>
                                    </ActionLink>
                                    <AppLink
                                      id={'template-link-delete-' + index}
                                      href="#"
                                      onClick={(e) => handleDelete(e, item)}
                                    >
                                      {t('templates.manage.table.link.delete')}
                                    </AppLink>
                                  </>
                                )}
                              </TableCellActions>
                            </GovUK.Table.Row>
                          ))}
                        </GovUK.Table>
                        <Pagination
                          url="/templates"
                          pages={templatesPage.data.pages}
                          currentPage={templatesPage.data.currentPage}
                          totalPages={templatesPage.data.totalPages}
                        />
                      </>
                    )}
                  </GovUK.GridCol>
                </GovUK.GridRow>
              </>
            )}
            {templatesPage.showView === VIEWS.CONFIRM && (
              <GovUK.GridRow>
                <GovUK.GridCol setWidth="two-thirds">
                  {templatesPage.errors &&
                    !!Object.keys(templatesPage.errors).length && (
                      <ErrorSummary
                        heading={t('errorSummary.title')}
                        errors={Object.keys(templatesPage.errors).map(
                          (key) => ({
                            targetName: key,
                            text: templatesPage.errors[key],
                          })
                        )}
                      />
                    )}
                  <GovUK.Caption size="L">
                    {t('templates.templateName')}:{' '}
                    {itemToDelete.templateDetails.name}
                  </GovUK.Caption>
                  <form onSubmit={handleConfirmRemove}>
                    <GovUK.Fieldset>
                      <GovUK.Fieldset.Legend isPageHeading size="LARGE">
                        {t('templates.manage.delete.title')}
                      </GovUK.Fieldset.Legend>
                      <GovUK.MultiChoice
                        mb={6}
                        label=""
                        meta={{
                          error: templatesPage.errors?.confirmRemove,
                          touched: !!templatesPage.errors?.confirmRemove,
                        }}
                      >
                        <GovUK.Radio
                          name="removeTemplate"
                          id="removeTemplateYes"
                          checked={confirmRemove === 'Yes'}
                          onChange={(e) => setConfirmRemove(e.target.value)}
                          value="Yes"
                        >
                          {t('radio.yes')}
                        </GovUK.Radio>
                        <GovUK.Radio
                          name="removeTemplate"
                          id="removeTemplateNo"
                          checked={confirmRemove === 'No'}
                          onChange={(e) => setConfirmRemove(e.target.value)}
                          value="No"
                        >
                          {t('radio.no')}
                        </GovUK.Radio>
                      </GovUK.MultiChoice>
                    </GovUK.Fieldset>
                    <ButtonGroup>
                      <GovUK.Button id="confirmContinueButton">
                        {t('confirmContinueButton')}
                      </GovUK.Button>
                    </ButtonGroup>
                  </form>
                </GovUK.GridCol>
              </GovUK.GridRow>
            )}
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default ManageTemplates;
ManageTemplates.auth = true;
