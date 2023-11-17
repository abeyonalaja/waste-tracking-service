import React, { useEffect, useState, useReducer } from 'react';
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
  AppLink,
  Paragraph,
  DocumentStatus,
  SaveReturnButton,
  NotificationBanner,
  BreakableString,
} from 'components';
import styled from 'styled-components';
import { BORDER_COLOUR } from 'govuk-colours';
import { differenceInSeconds, parseISO } from 'date-fns';

enum VIEWS {
  DEFAULT = 0,
}

type State = {
  data: any;
  isLoading: boolean;
  isError: boolean;
  showView: number;
  errors: {
    error?: string;
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

const TaskListOL = styled.ol`
  counter-reset: tasklist;
  list-style-type: none;
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  max-width: 550px;
  > li {
    counter-increment: tasklist;
  }
`;

const TaskListSectionHeading = styled(GovUK.H2)<{ hideNumber?: boolean }>`
  display: table;
  margin-top: 1em;
  margin-bottom: 1em;
  &:before {
    content: counter(tasklist) '.';
    display: ${(props) => (props.hideNumber ? 'none' : 'inline-block')};
    min-width: 1em;
    @media (min-width: 40.0625em) {
      min-width: 30px;
    }
  }
`;

const TaskListItems = styled(GovUK.UnorderedList)`
  padding: 0;
  margin: 0 0 40px;
  list-style: none;
  @media (min-width: 40.0625em) {
    padding-left: 30px;
    margin-bottom: 60px;
  }
`;

const TaskListItem = styled(GovUK.ListItem)`
  border-bottom: 1px solid ${BORDER_COLOUR};
  margin-bottom: 0 !important;
  padding-top: 10px;
  padding-bottom: 10px;
  overflow: hidden;
  &:first-child {
    border-top: 1px solid ${BORDER_COLOUR};
  }
`;

const TaskName = styled.span`
  display: block;
  @media (min-width: 28.125em) {
    float: left;
  }
`;

const TaskStatus = styled.span`
  margin-top: 10px;
  margin-bottom: 5px;
  display: inline-block;
  @media (min-width: 28.125em) {
    float: right;
    margin: 0;
  }
`;

const ActionHeader = styled(GovUK.H2)`
  border-top: 2px solid #1d70b8;
  padding-top: 1em;
  margin-bottom: 0.5em;
`;

const ListItem = styled(GovUK.ListItem)`
  margin-bottom: 0.8em !important;
`;

const TemplateTasklist = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [templatePage, dispatchTemplatePage] = useReducer(
    templateReducer,
    initialState
  );
  const [templateId, setTemplateId] = useState<string>(null);
  const [context, setContext] = useState<string>('updated');
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      setTemplateId(String(router.query.templateId));
      if (router.query.context) {
        setContext(String(router.query.context));
      }
    }
  }, [router.isReady, router.query.templateId, router.query.context]);

  useEffect(() => {
    dispatchTemplatePage({ type: 'DATA_FETCH_INIT' });
    if (templateId !== null) {
      fetch(`${process.env.NX_API_GATEWAY_URL}/templates/${templateId}`)
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
          setShowBanner(
            differenceInSeconds(
              new Date(),
              parseISO(data?.templateDetails.lastModified)
            ) < 5
          );
        });
    }
  }, [router.isReady, templateId]);

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
          <GovUK.Breadcrumbs.Link href="/export/templates">
            {t('templates.manage.title')}
          </GovUK.Breadcrumbs.Link>
        </GovUK.Breadcrumbs>
      </BreadcrumbWrap>
    );
  };

  return (
    <>
      <Head>
        <title>{t('templates.taskList.caption')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<CompleteHeader />}
        footer={<CompleteFooter />}
        beforeChildren={<BreadCrumbs />}
      >
        {templatePage.isError && !templatePage.isLoading && <Error404Content />}
        {templatePage.isLoading && <Loading />}
        {!templatePage.isError && !templatePage.isLoading && (
          <>
            <GovUK.GridRow>
              <GovUK.GridCol setWidth="two-thirds">
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
                {showBanner && (
                  <NotificationBanner
                    type="success"
                    id={`template-tasklist-banner-${context}`}
                    headingText={
                      context === 'copied'
                        ? 'Your chosen template has been copied'
                        : `${templatePage.data.templateDetails.name} template has been ${context}`
                    }
                  />
                )}
              </GovUK.GridCol>
            </GovUK.GridRow>
            <GovUK.GridRow>
              <GovUK.GridCol setWidth="two-thirds">
                <GovUK.Caption size="L">
                  {t('templates.taskList.caption')}
                </GovUK.Caption>
                <GovUK.Heading size="L">
                  <BreakableString>
                    {templatePage.data.templateDetails.name}
                  </BreakableString>
                </GovUK.Heading>
                {templatePage.showView === VIEWS.DEFAULT && (
                  <>
                    <Paragraph>{t('templates.taskList.intro.p1')}</Paragraph>
                    <GovUK.UnorderedList>
                      <GovUK.ListItem>
                        {t('templates.taskList.intro.li1')}
                      </GovUK.ListItem>
                      <GovUK.ListItem>
                        {t('templates.taskList.intro.li2')}
                      </GovUK.ListItem>
                      <GovUK.ListItem>
                        {t('templates.taskList.intro.li3')}
                      </GovUK.ListItem>
                      <GovUK.ListItem>
                        {t('templates.taskList.intro.li4')}
                      </GovUK.ListItem>
                      <GovUK.ListItem>
                        {t('templates.taskList.intro.li5')}
                      </GovUK.ListItem>
                    </GovUK.UnorderedList>
                    <Paragraph mb={9}>
                      {t('templates.taskList.intro.p2')}
                    </Paragraph>

                    <TaskListOL>
                      <li>
                        <TaskListSectionHeading size="M" hideNumber={true}>
                          {t('templates.taskList.details')}
                        </TaskListSectionHeading>
                        <TaskListItems>
                          <TaskListItem>
                            <TaskName>
                              <AppLink
                                href={{
                                  pathname: `/export/templates/edit`,
                                  query: { templateId },
                                }}
                              >
                                {t('templates.taskList.nameAndDescription')}
                              </AppLink>
                            </TaskName>
                            <TaskStatus>
                              <DocumentStatus
                                id="name-and-description-status"
                                status={'Complete'}
                              />
                            </TaskStatus>
                          </TaskListItem>
                        </TaskListItems>
                      </li>
                    </TaskListOL>

                    <TaskListOL>
                      <li>
                        <TaskListSectionHeading size="M">
                          {t('exportJourney.submitAnExport.SectionOne.heading')}
                        </TaskListSectionHeading>
                        <TaskListItems>
                          <TaskListItem>
                            <TaskName>
                              <AppLink
                                href={{
                                  pathname: `/export/templates/about/waste-code`,
                                  query: { templateId },
                                }}
                              >
                                {t(
                                  'exportJourney.submitAnExport.SectionOne.wasteCodesAndDescription'
                                )}
                              </AppLink>
                            </TaskName>
                            <TaskStatus>
                              <DocumentStatus
                                id="waste-codes-and-description-status"
                                status={
                                  templatePage.data?.wasteDescription.status
                                }
                              />
                            </TaskStatus>
                          </TaskListItem>
                        </TaskListItems>
                      </li>
                      <li>
                        <TaskListSectionHeading size="M">
                          {t('exportJourney.submitAnExport.SectionTwo.heading')}
                        </TaskListSectionHeading>
                        <TaskListItems>
                          <TaskListItem>
                            <TaskName>
                              <AppLink
                                href={{
                                  pathname:
                                    templatePage.data?.exporterDetail.status ===
                                    'Complete'
                                      ? `/export/templates/exporter-importer/exporter-address`
                                      : templatePage.data?.exporterDetail
                                          .status === 'Started'
                                      ? `/export/templates/exporter-importer/exporter-details-manual`
                                      : `/export/templates/exporter-importer/exporter-postcode`,
                                  query: { templateId, templates: true },
                                }}
                                id="exporter-details"
                              >
                                {t(
                                  'exportJourney.submitAnExport.SectionTwo.exporterDetails'
                                )}
                              </AppLink>
                            </TaskName>
                            <TaskStatus>
                              <DocumentStatus
                                id="exporter-details-status"
                                status={
                                  templatePage.data?.exporterDetail.status
                                }
                              />
                            </TaskStatus>
                          </TaskListItem>
                          <TaskListItem>
                            <TaskName>
                              <AppLink
                                href={{
                                  pathname: `/export/templates/exporter-importer/importer-details`,
                                  query: { templateId },
                                }}
                                id="importer-details"
                              >
                                {t(
                                  'exportJourney.submitAnExport.SectionTwo.importerDetails'
                                )}
                              </AppLink>
                            </TaskName>
                            <TaskStatus>
                              <DocumentStatus
                                id="importer-details-status"
                                status={
                                  templatePage.data?.importerDetail.status
                                }
                              />
                            </TaskStatus>
                          </TaskListItem>
                        </TaskListItems>
                      </li>
                      <li>
                        <TaskListSectionHeading size="M">
                          {t(
                            'exportJourney.submitAnExport.SectionThree.heading'
                          )}
                        </TaskListSectionHeading>
                        <TaskListItems>
                          <TaskListItem>
                            <TaskName>
                              <AppLink
                                href={{
                                  pathname: `/export/templates/journey/waste-carriers`,
                                  query: { templateId },
                                }}
                                id="waste-carriers"
                              >
                                {t(
                                  'exportJourney.submitAnExport.SectionThree.wasteCarriers'
                                )}
                              </AppLink>
                            </TaskName>
                            <TaskStatus>
                              <DocumentStatus
                                id="waste-carriers-status"
                                status={templatePage.data?.carriers.status}
                              />
                            </TaskStatus>
                          </TaskListItem>
                          <TaskListItem>
                            <TaskName>
                              <AppLink
                                href={{
                                  pathname: `/export/templates/journey/collection-details`,
                                  query: { templateId, dashboard: true },
                                }}
                                id="collection-details"
                              >
                                {t(
                                  'exportJourney.submitAnExport.SectionThree.wasteCollectionDetails'
                                )}
                              </AppLink>
                            </TaskName>
                            <TaskStatus>
                              <DocumentStatus
                                id="waste-collection-details-status"
                                status={
                                  templatePage.data?.collectionDetail.status
                                }
                              />
                            </TaskStatus>
                          </TaskListItem>
                          <TaskListItem>
                            <TaskName>
                              <AppLink
                                href={{
                                  pathname: `/export/templates/journey/exit-location`,
                                  query: { templateId, dashboard: true },
                                }}
                                id="location-waste-leaves-the-uk"
                              >
                                {t(
                                  'exportJourney.submitAnExport.SectionThree.locationWasteLeavesUK'
                                )}
                              </AppLink>
                            </TaskName>
                            <TaskStatus>
                              <DocumentStatus
                                id="location-waste-leaves-the-uk-status"
                                status={
                                  templatePage.data?.ukExitLocation.status
                                }
                              />
                            </TaskStatus>
                          </TaskListItem>
                          <TaskListItem>
                            <TaskName>
                              <AppLink
                                href={{
                                  pathname: `/export/templates/journey/transit-countries`,
                                  query: { templateId, dashboard: true },
                                }}
                                id="countries-waste-will-travel-through"
                              >
                                {t(
                                  'exportJourney.submitAnExport.SectionThree.countriesWasteWillTravel'
                                )}
                              </AppLink>
                            </TaskName>
                            <TaskStatus>
                              <DocumentStatus
                                id="countries-waste-will-travel-through-status"
                                status={
                                  templatePage.data?.transitCountries.status
                                }
                              />
                            </TaskStatus>
                          </TaskListItem>
                        </TaskListItems>
                      </li>
                      <li>
                        <TaskListSectionHeading size="M">
                          {t(
                            'exportJourney.submitAnExport.SectionFour.heading'
                          )}
                        </TaskListSectionHeading>
                        <TaskListItems>
                          <TaskListItem>
                            <TaskName>
                              {templatePage.data?.recoveryFacilityDetail
                                .status === 'CannotStart' &&
                                t(
                                  'exportJourney.submitAnExport.SectionFour.recoveryFacilityLaboratory'
                                )}
                              {(templatePage.data?.wasteDescription.status ===
                                'Started' ||
                                templatePage.data?.wasteDescription.status ===
                                  'Complete') &&
                                templatePage.data?.wasteDescription?.wasteCode
                                  ?.type === 'NotApplicable' && (
                                  <AppLink
                                    href={{
                                      pathname: `/export/templates/treatment/laboratory`,
                                      query: { templateId, dashboard: true },
                                    }}
                                  >
                                    {t(
                                      'exportJourney.submitAnExport.SectionFour.laboratoryDetails'
                                    )}
                                  </AppLink>
                                )}
                              {(templatePage.data?.wasteDescription.status ===
                                'Started' ||
                                templatePage.data?.wasteDescription.status ===
                                  'Complete') &&
                                templatePage.data?.wasteDescription?.wasteCode
                                  ?.type !== 'NotApplicable' &&
                                templatePage.data?.wasteDescription?.wasteCode
                                  ?.type !== undefined && (
                                  <AppLink
                                    href={{
                                      pathname: `/export/templates/treatment/interim-site`,
                                      query: { templateId, dashboard: true },
                                    }}
                                  >
                                    {t(
                                      'exportJourney.submitAnExport.SectionFour.recoveryDetails'
                                    )}
                                  </AppLink>
                                )}
                            </TaskName>
                            <TaskStatus>
                              <DocumentStatus
                                id="recovery-facility-or-laboratory-status"
                                status={
                                  templatePage.data?.recoveryFacilityDetail
                                    .status
                                }
                              />
                            </TaskStatus>
                          </TaskListItem>
                        </TaskListItems>
                      </li>
                    </TaskListOL>
                    {context === 'manage' && (
                      <SaveReturnButton
                        href="#"
                        onClick={(e) => {
                          router.push({
                            pathname: `/export/templates`,
                          });
                          e.preventDefault();
                        }}
                      >
                        {t('templates.taskList.returnButtonManage')}
                      </SaveReturnButton>
                    )}
                    {context !== 'manage' && (
                      <SaveReturnButton
                        href="#"
                        onClick={(e) => {
                          router.push({
                            pathname: `/export`,
                          });
                          e.preventDefault();
                        }}
                      >
                        {t('templates.taskList.returnButton')}
                      </SaveReturnButton>
                    )}
                  </>
                )}
              </GovUK.GridCol>
              <GovUK.GridCol setWidth="one-third">
                <ActionHeader size="S">{t('actions')}</ActionHeader>
                <GovUK.UnorderedList listStyleType={'none'}>
                  <ListItem>
                    <AppLink
                      id="template-tasklist-link-use"
                      href={{
                        pathname: `/export/templates/use`,
                        query: { templateId },
                      }}
                    >
                      {t('templates.taskList.actionLink.use')}
                    </AppLink>
                  </ListItem>
                  <ListItem>
                    <AppLink
                      id="template-tasklist-link-copy"
                      href={{
                        pathname: `/export/templates/copy`,
                        query: { templateId },
                      }}
                    >
                      {t('templates.taskList.actionLink.copy')}
                    </AppLink>
                  </ListItem>
                  <ListItem>
                    <AppLink
                      id="template-tasklist-link-delete"
                      href={{
                        pathname: `/export/templates`,
                        query: { templateId },
                      }}
                    >
                      {t('templates.taskList.actionLink.delete')}
                    </AppLink>
                  </ListItem>
                  <ListItem>
                    <AppLink
                      id="template-tasklist-link-manage"
                      href={{
                        pathname: `/export/templates`,
                      }}
                    >
                      {t('templates.taskList.actionLink.manage')}
                    </AppLink>
                  </ListItem>
                </GovUK.UnorderedList>
              </GovUK.GridCol>
            </GovUK.GridRow>
          </>
        )}
      </GovUK.Page>
    </>
  );
};

export default TemplateTasklist;
