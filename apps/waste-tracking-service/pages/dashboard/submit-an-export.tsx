import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import '../../i18n/config';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumbs,
  Heading,
  Caption,
  Main,
  GridRow,
  GridCol,
  Paragraph,
  OrderedList,
  ListItem,
  H2,
  Table,
  SectionBreak,
  Link,
} from 'govuk-react';
import { CompleteHeader } from '../../components/CompleteHeader';
import { CompleteFooter } from '../../components/CompleteFooter';
import DocumentStatus from '../../components/DocumentStatus';

const BreadCrumbWrap = styled(Main)`
  padding-top: 0;
`;

const TableCellRight = styled(Table.Cell)`
  text-align: right;
`;

const BoldListItem = styled(ListItem)`
  font-weight: 600;
  font-size: 24px;
`;

const Lower = styled('div')`
  padding-top: 20px;
  padding-bottom: 60px;
`;

export function SubmitAnExport() {
  const { t } = useTranslation();

  const [content, setContent] = useState(null);
  const [isReady, setIsReady] = useState(false);

  function addFourNumbers(
    num1: number,
    num2: number,
    num3: number,
    num4: number
  ): number {
    return num1 + num2 + num3 + num4;
  }

  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      const fetchData = async () => {
        try {
          await fetch(`${process.env.NX_API_GATEWAY_URL}/submissions/${id}`)
            .then((response) => response.json())
            .then((data) => {
              setContent(data);
              setIsReady(true);
       
            });
        } catch (e) {
          console.error(e);
        }
      };
      fetchData();
    }
  }, );
  const {id} = router.query; 
  const BreadCrumbHref = (`../add-your-own-export-reference?id=${id}`);
  const WasteCodesHref = (`/waste-code?id=${id}`);


  const aboutTheWastetatus = 0;
  const exporterImporterStatus = 0;
  const journeyofWasteStatus = 0;
  const treatmentOfWasteStatus = 0;

  const sectionStatus = addFourNumbers(
    aboutTheWastetatus,
    exporterImporterStatus,
    journeyofWasteStatus,
    treatmentOfWasteStatus
  );

  return (
    <>
      {isReady && (
        <>
          <Head>
            <title>{t('exportJourney.submitAnExport.title')}</title>
          </Head>
          <CompleteHeader />

          <BreadCrumbWrap>
            <Breadcrumbs>
              <Breadcrumbs.Link href="/">{t('app.title')}</Breadcrumbs.Link>
              <Breadcrumbs.Link href="/dashboard">
                {t('app.channel.title')}
              </Breadcrumbs.Link>
              <Breadcrumbs.Link href={BreadCrumbHref}>
                {t('yourReference.breadcrumb')}
              </Breadcrumbs.Link>
              {t('exportJourney.submitAnExport.breadcrumb')}
            </Breadcrumbs>
          </BreadCrumbWrap>
          <Main>
            <GridRow>
              <GridCol setWidth="two-thirds">
                {content.reference ? (
                  <Caption id="my-reference">
                    {t('exportJourney.submitAnExport.yourRef')}:{' '}
                    {content.reference}
                  </Caption>
                ) : (
                  <></>
                )}

                <Heading size="LARGE" id="template-heading">
                  {t('exportJourney.submitAnExport.title')}
                </Heading>

                <Heading size="SMALL">
                  {sectionStatus < 4
                    ? t('exportJourney.submitAnExport.submissionIncomplete')
                    : t('exportJourney.submitAnExport.submissionComplete')}
                </Heading>
                <p
                  id="completed-section-count"
                  data-testid="completed-section-count"
                >
                  You have completed {sectionStatus} of 4 sections.
                </p>
                <OrderedList>
                  <BoldListItem>
                    <H2 size="MEDIUM">
                      {t('exportJourney.submitAnExport.SectionOne.heading')}
                    </H2>
                    <SectionBreak level="SMALL" visible />
                    <Table>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <Link href={WasteCodesHref} id="waste-codes-and-description">
                            {t(
                              'exportJourney.submitAnExport.SectionOne.wasteCodesAndDescription'
                            )}
                          </Link>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="waste-codes-and-description-status"
                            status={content.wasteDescription.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <span id="quanitity-of-waste">
                            {t(
                              'exportJourney.submitAnExport.SectionOne.quantityOfWaste'
                            )}
                          </span>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="quanitity-of-waste-status"
                            status={content.wasteQuantity.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                    </Table>
                  </BoldListItem>
                  <BoldListItem>
                    <H2 size="MEDIUM">
                      {t('exportJourney.submitAnExport.SectionTwo.heading')}
                    </H2>
                    <SectionBreak level="SMALL" visible />
                    <Table>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <Link href="" id="exporter-details">
                            {t(
                              'exportJourney.submitAnExport.SectionTwo.exporterDetails'
                            )}
                          </Link>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="exporter-details-status"
                            status={content.exporterDetail.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <Link href="" id="importer-details">
                            {t(
                              'exportJourney.submitAnExport.SectionTwo.importerDetails'
                            )}
                          </Link>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="importer-details-status"
                            status={content.importerDetail.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                    </Table>
                  </BoldListItem>
                  <BoldListItem>
                    <H2 size="MEDIUM">
                      {t('exportJourney.submitAnExport.SectionThree.heading')}
                    </H2>
                    <SectionBreak level="SMALL" visible />
                    <Table>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <Link href="" id="collection-details">
                            {t(
                              'exportJourney.submitAnExport.SectionThree.wasteCollectionDetails'
                            )}
                          </Link>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="collection-details-status"
                            status={content.collectionDate.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <Link href="" id="waste-carriers">
                            {t(
                              'exportJourney.submitAnExport.SectionThree.wasteCarriers'
                            )}
                          </Link>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="waste-carriers-status"
                            status={content.carriers.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <Link href="" id="waste-collection-details">
                            {t(
                              'exportJourney.submitAnExport.SectionThree.wasteCollectionDetails'
                            )}
                          </Link>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="waste-collection-details-status"
                            status={content.collectionDetail.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <Link href="" id="location-waste-leaves-the-uk">
                            {t(
                              'exportJourney.submitAnExport.SectionThree.locationWasteLeavesUK'
                            )}
                          </Link>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="location-waste-leaves-uk-status"
                            status={content.ukExitLocation.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <Link
                            href=""
                            id="countries-waste-will-travel-through"
                          >
                            {t(
                              'exportJourney.submitAnExport.SectionThree.countriesWasteWillTravel'
                            )}
                          </Link>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="countries-waste-will-travel-through-status"
                            status={content.transitCountries.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                    </Table>
                  </BoldListItem>
                  <BoldListItem>
                    <H2 size="MEDIUM">
                      {t('exportJourney.submitAnExport.SectionFour.heading')}
                    </H2>

                    <SectionBreak level="SMALL" visible />
                    <Table>
                      <Table.Row>
                        <Table.Cell setWidth="one-half">
                          <Link href="" id="recovery-faciltiy-or-laboratory">
                            {t(
                              'exportJourney.submitAnExport.SectionFour.recoveryFacilityLaboratory'
                            )}
                          </Link>
                        </Table.Cell>
                        <TableCellRight setWidth="one-third">
                          <DocumentStatus
                            id="recovery-faciltiy-or-laboratory-status"
                            status={content.recoveryFacilityDetail.status}
                          />
                        </TableCellRight>
                      </Table.Row>
                    </Table>
                  </BoldListItem>
                </OrderedList>
                <Lower>
                  <H2 size="MEDIUM">
                    {t('exportJourney.submitAnExport.finalCheck.title')}
                  </H2>
                  <Paragraph>
                    {t('exportJourney.submitAnExport.finalCheck.description')}
                  </Paragraph>
                  <Link href="">
                    {t('exportJourney.submitAnExport.returnLink')}
                  </Link>
                </Lower>
              </GridCol>
            </GridRow>
          </Main>
          <CompleteFooter />
        </>
      )}
    </>
  );
}

export default SubmitAnExport;
