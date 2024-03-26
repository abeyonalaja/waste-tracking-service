import { useTranslation } from 'react-i18next';
import * as GovUK from 'govuk-react';
import {
  AppLink,
  Footer,
  Header,
  BreadCrumbLink,
  BreadcrumbWrap,
} from 'components';
import Head from 'next/head';
import styled from 'styled-components';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const TableCell = styled(GovUK.Table.Cell)`
  vertical-align: top;
`;

const TableHeader = styled(GovUK.Table.CellHeader)`
  vertical-align: top;
`;

const ListItemDashed = styled(GovUK.ListItem)`
  list-style-type: '— ';
`;

const BreadCrumbs = () => {
  const { t } = useTranslation();
  return (
    <BreadcrumbWrap>
      <GovUK.Breadcrumbs>
        <BreadCrumbLink href="/">{t('app.parentTitle')}</BreadCrumbLink>
        <BreadCrumbLink href="/">{t('app.title')}</BreadCrumbLink>
        {t('export.homepage.multiples.guidance.link')}
      </GovUK.Breadcrumbs>
    </BreadcrumbWrap>
  );
};

const Guidance = () => {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MULTIPLES_ENABLED !== 'true') {
      router.push({
        pathname: `/`,
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>{t('multiples.guidance.page.title')}</title>
      </Head>
      <GovUK.Page
        id="content"
        header={<Header />}
        footer={<Footer />}
        beforeChildren={<BreadCrumbs />}
      >
        <GovUK.GridRow>
          <GovUK.GridCol setWidth="two-thirds">
            <GovUK.Caption>Guidance</GovUK.Caption>
            <GovUK.Heading size="L">
              {t('multiples.guidance.page.title')}
            </GovUK.Heading>
            <GovUK.LeadParagraph>
              Use this guidance to help you to complete a CSV template to upload
              multiple Annex VII records for the `Export green list waste&rsquo;
              service.
            </GovUK.LeadParagraph>
            <GovUK.SectionBreak level="LARGE" visible />

            <GovUK.Paragraph>Contents</GovUK.Paragraph>
            <GovUK.UnorderedList>
              <ListItemDashed>
                <AppLink href={'#details'}>Details</AppLink>
              </ListItemDashed>
              <ListItemDashed>
                <AppLink href={'#reference'}>Your unique reference</AppLink>
              </ListItemDashed>
              <ListItemDashed>
                <AppLink href={'#waste'}>Waste codes and description</AppLink>
              </ListItemDashed>
              <ListItemDashed>
                <AppLink href={'#quantity'}>Quantity of waste</AppLink>
              </ListItemDashed>
              <ListItemDashed>
                <AppLink href={'#exporter'}>
                  Exporter and importer details
                </AppLink>
              </ListItemDashed>
              <ListItemDashed>
                <AppLink href={'#journey'}>Journey of waste</AppLink>
              </ListItemDashed>
              <ListItemDashed>
                <AppLink href={'#treatment'}>Treatment of waste</AppLink>
              </ListItemDashed>
            </GovUK.UnorderedList>

            <GovUK.H2 size="MEDIUM">
              <a id="details">Details</a>
            </GovUK.H2>
            <GovUK.Paragraph>
              Use this CSV template and guidance if you want to submit multiple
              Annex VII records at the same time to the Export waste from the UK
              service https://track-waste-prd.azure.defra.cloud/. This is
              instead of submitting one Annex VII record at a time.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              It’s important the information you enter is:
            </GovUK.Paragraph>
            <GovUK.UnorderedList>
              <GovUK.ListItem>accurate</GovUK.ListItem>
              <GovUK.ListItem>spelt correctly</GovUK.ListItem>
              <GovUK.ListItem>formatted correctly</GovUK.ListItem>
            </GovUK.UnorderedList>
            <GovUK.Paragraph>
              Make sure you check for errors before you upload your file.
            </GovUK.Paragraph>
            <GovUK.H3 size="SMALL">Documents </GovUK.H3>
            <GovUK.Paragraph>
              Green list waste multiple exports: Multiple Annex VII CSV template
            </GovUK.Paragraph>
            <GovUK.H3 size="SMALL">Multiple Annex VII CSV template</GovUK.H3>
            <GovUK.Paragraph>
              You need to fill in the CSV template with information you would
              usually provide when you complete an Annex VII record. The
              template is designed so that it is accessible for most users and
              is compatible with as many programs as possible. For example, it
              does not include colours, freeze panes or pre-populated dropdowns,
              as these features do not work on all systems.
            </GovUK.Paragraph>
            <GovUK.H3 size="SMALL">Get help with technical issues</GovUK.H3>
            <GovUK.Paragraph>
              You can contact the waste tracking service support team if you
              need help with a technical issue, such as:
            </GovUK.Paragraph>
            <GovUK.UnorderedList>
              <GovUK.ListItem>
                problems with uploading green list waste export details using a
                CSV file
              </GovUK.ListItem>
              <GovUK.ListItem>
                any other technical service-related query
              </GovUK.ListItem>
            </GovUK.UnorderedList>
            <GovUK.Paragraph>
              You can contact the waste tracking service support team by
              emailing wastetracking@defra.gov.uk
            </GovUK.Paragraph>
            <GovUK.H3 size="SMALL">Get help with regulatory issues</GovUK.H3>
            <GovUK.Paragraph>
              The waste tracking service support team will not be able to answer
              regulatory questions. You should contact your relevant regulatory
              team instead.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              Your national regulatory team will not be able to answer technical
              questions about service problems.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              Use this guidance to help you complete the CSV template to upload
              multiple exports at a time. If there are any sections or questions
              that do not apply to your shipment, leave the cell blank. You must
              complete all compulsory sections for all your records, which
              includes: your unique reference all relevant waste codes
              (including at least one European Waste Code (EWC) exporter (person
              who organises the shipment) details importer (consignee) details
              waste quantity and collection date If you start to fill in a
              section that applies to your shipment (for example, a waste
              carrier or recovery facility), you need to complete all relevant
              details for that section and cannot leave any cells blank.
            </GovUK.Paragraph>

            <GovUK.H2 size="MEDIUM">
              <a id="reference">Your unique reference</a>
            </GovUK.H2>

            <GovUK.Paragraph>
              You need to use a unique reference for each new record you submit.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              Your unique reference can be anything that helps you to identify
              your shipment. For example, it could match a reference on a system
              you already use to identify shipments.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              Your unique reference can only have numbers and letters and should
              be a maximum of 20 characters. For example, ABC10001.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              Make sure your unique reference is different for each shipment.
              Each row on the CSV template is a unique shipment. For example, if
              you put ABC10001 in one row, then you might put ABC10002 in the
              next to show it is different.
            </GovUK.Paragraph>

            <GovUK.H2 size="MEDIUM">
              <a id="waste">Waste codes and description</a>
            </GovUK.H2>
            <GovUK.H3 size="SMALL">Waste codes</GovUK.H3>
            <GovUK.Paragraph>
              Not all waste codes will apply to your waste export. Enter all the
              waste codes (opens in new tab) that are relevant to your shipment
              in the relevant columns in the template.
            </GovUK.Paragraph>

            <GovUK.Table>
              <GovUK.Table.Row>
                <TableHeader setWidth="50%" id="table-heading-waste-code-type">
                  Waste code type
                </TableHeader>
                <TableHeader
                  setWidth="50%"
                  id="table-heading-waste-code-answer"
                >
                  Answer format
                </TableHeader>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Basel Annex IX</TableHeader>
                <TableCell>
                  This should be 1 letter and 4 numbers. For example, B1030.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>OECD</TableHeader>
                <TableCell>
                  This should be 2 letters and 3 numbers. For example, GC010.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Annex IIIA</TableHeader>
                <TableCell>
                  This should be 1 or 2 letters and 4 numbers. For example,
                  A4150 or BEU04.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Annex IIIB</TableHeader>
                <TableCell>
                  This should be 3 letters and 2 numbers. For example, BEU04.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Unlisted waste</TableHeader>
                <TableCell>
                  If your unlisted waste is going to a laboratory, only enter
                  `Yes` or `Y` in this column and leave all other code columns
                  blank.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>European Waste Catalogue (EWC)</TableHeader>
                <TableCell>
                  This should be 6 digits. For example 010101. <br />
                  You must enter at least 1 EWC code, but can enter up to 5
                  codes if you need to, separated by commas.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>National code (commodity code)</TableHeader>
                <TableCell>
                  This can be 10 to 14 digits. For example, `4707301000.``
                </TableCell>
              </GovUK.Table.Row>
            </GovUK.Table>

            <GovUK.H3 size="SMALL">Waste description</GovUK.H3>

            <GovUK.Paragraph>
              Enter a description. Give the usual description of the waste. For
              example, `baled PET bottles, bagged HDPE pellets or OCC
              paper.&rsquo;
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              Your description must be 100 characters or less.
            </GovUK.Paragraph>

            <GovUK.H2 size="MEDIUM">
              <a id="quantity">Quantity of waste and description</a>
            </GovUK.H2>

            <GovUK.H3 size="SMALL">Waste quantity</GovUK.H3>
            <GovUK.Paragraph>
              Provide the waste quantity either in tonnes or in cubic metres.
              You do not need to provide both.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              For example, if you provided the waste quantity in tonnes, leave
              the volume cell blank.
            </GovUK.Paragraph>

            <GovUK.Table>
              <GovUK.Table.Row>
                <TableHeader
                  setWidth="50%"
                  id="table-heading-waste-quantity-type"
                >
                  Waste details
                </TableHeader>
                <TableHeader
                  setWidth="50%"
                  id="table-heading-waste-quantity-answer"
                >
                  Answer format
                </TableHeader>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>
                  Bulk waste quantity in tonnes (leave this cell blank if you
                  enter the quantity in cubic metres)
                </TableHeader>
                <TableCell>
                  Enter the waste quantity using only numbers and a decimal
                  point, for example &lsquo;13.5&rsquo;. Do not write `tonnes`
                  after the number.
                  <br />
                  Do not include the weight of the container or vehicle.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>
                  Bulk waste quantity in cubic metres (leave this cell blank if
                  you enter the quantity in tonnes)
                </TableHeader>
                <TableCell>
                  Enter the waste quantity using only numbers and a decimal
                  point, for example &lsquo;13.5&rsquo;. Do not write
                  &lsquo;cubic metres&rsquo; after the number. <br />
                  Do not include the weight of the container or vehicle.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>
                  Unlisted waste quantity in kilograms (only if waste is going
                  to a laboratory)
                </TableHeader>
                <TableCell>
                  Enter the waste quantity using only numbers and a decimal
                  point, for example &lsquo;13.5&rsquo;. Do not write
                  &lsquo;cubic metres&rsquo; after the number. This can be up to
                  25kg.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Estimated or actual waste quantity</TableHeader>
                <TableCell>
                  Enter whether the waste quantity is an estimate or the actual
                  amount. Enter &lsquo;estimated&rsquo; or &lsquo;actual&rsquo;.
                </TableCell>
              </GovUK.Table.Row>
            </GovUK.Table>

            <GovUK.H3 size="SMALL">Waste collection (shipping) date</GovUK.H3>

            <GovUK.Paragraph>
              Enter the date the waste will be collected. The collection date is
              also known as the shipping date.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              Use slashes between the day, month and year. For example,
              &lsquo;06/10/2024&rsquo;.
            </GovUK.Paragraph>

            <GovUK.H4 size="SMALL">
              Estimated or actual waste collection date
            </GovUK.H4>

            <GovUK.Paragraph>
              Enter whether the waste collection date is an estimate or the
              actual date. Enter &lsquo;estimated&rsquo; or
              &lsquo;actual&rsquo;.
            </GovUK.Paragraph>

            <GovUK.H2 size="MEDIUM">
              <a id="exporter">Exporter and importer details</a>
            </GovUK.H2>
            <GovUK.H3 size="SMALL">
              Exporter (person who organises the shipment) details
            </GovUK.H3>

            <GovUK.Paragraph>
              The exporter is also known as the person who organises the
              shipment. This section must be completed in full.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              The email address of the exporter will be where we will send the
              confirmation email of your submitted exports.
            </GovUK.Paragraph>

            <GovUK.H3 size="SMALL">
              Exporter address and contact details
            </GovUK.H3>

            <GovUK.Table>
              <GovUK.Table.Row>
                <TableHeader
                  setWidth="50%"
                  id="table-heading-waste-exporter-type"
                >
                  Exporter (person who organises the shipment) details
                </TableHeader>
                <TableHeader
                  setWidth="50%"
                  id="table-heading-waste-exporter-answer"
                >
                  Answer format
                </TableHeader>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Organisation name</TableHeader>
                <TableCell>
                  Enter the full organisation name of the waste exporter.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Address</TableHeader>
                <TableCell>
                  Enter as much of the address as you can. Include the postcode
                  if you have it.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Country</TableHeader>
                <TableCell>
                  Enter the exporter&rsquo;s nation in full. This must be
                  &lsquo;England&rsquo;, &lsquo;Wales&rsquo;,
                  &lsquo;Scotland&rsquo;, or &lsquo;Northern Ireland&rsquo;.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Contact full name</TableHeader>
                <TableCell>
                  Enter the exporter&rsquo;s contact first and last name, for
                  example &lsquo;Philip Stockton&rsquo;.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Phone number</TableHeader>
                <TableCell>
                  This should be a 15-digit phone number, including the country
                  code in brackets, for example (44) 7700 9001077 <br />
                  Do not use any other special characters.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Email address</TableHeader>
                <TableCell>
                  Enter the email address in the correct format. For example,
                  bob.walker@ccma.co.uk
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Fax number (optional)</TableHeader>
                <TableCell>
                  Enter the exporter&rsquo;s fax number in the correct format.
                  If you do not have it, leave the cell blank.
                </TableCell>
              </GovUK.Table.Row>
            </GovUK.Table>

            <GovUK.H3 size="SMALL">Importer (consignee) details</GovUK.H3>

            <GovUK.Paragraph>
              The importer is also known as the consignee. This section must be
              completed in full.
            </GovUK.Paragraph>
            <GovUK.H3 size="SMALL">
              Importer (consignee) address and contact details
            </GovUK.H3>

            <GovUK.Table>
              <GovUK.Table.Row>
                <TableHeader
                  setWidth="50%"
                  id="table-heading-waste-importer-type"
                >
                  Importer (consignee) details
                </TableHeader>
                <TableHeader
                  setWidth="50%"
                  id="table-heading-waste-importer-answer"
                >
                  Answer format
                </TableHeader>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Importer organisation name</TableHeader>
                <TableCell>
                  Enter the full organisation name of the waste importer.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Importer address</TableHeader>
                <TableCell>
                  Enter as much of the address as you can. Include the postcode
                  if you have it.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Importer postcode</TableHeader>
                <TableCell>
                  Enter the importer postcode in the correct format, for
                  example, GL12 WTS
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Importer contact full name</TableHeader>
                <TableCell>
                  Enter the importer&rsquo;s contact first and last name, for
                  example &lsquo;Philip Stockton&rsquo;.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Importer phone number</TableHeader>
                <TableCell>
                  This should be a 15-digit phone number, including the country
                  code in brackets, for example (0091) 98144 21012. <br />
                  Do not use any other special characters.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Importer email address</TableHeader>
                <TableCell>
                  Enter the email address in the correct format. For example,
                  bob.walker@ccma.co.uk We will send the confirmation of any
                  submitted records to this email address. If you enter multiple
                  exporter details, each exporter email address will get the
                  confirmation of the particular records attached to them.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Importer fax number (optional)</TableHeader>
                <TableCell>
                  Enter the importer&rsquo;s fax number in the correct format.
                  If you do not have it, leave the cell blank.
                </TableCell>
              </GovUK.Table.Row>
            </GovUK.Table>

            <GovUK.H2 size="MEDIUM">
              <a id="journey">Journey of waste</a>
            </GovUK.H2>
            <GovUK.H3 size="SMALL">Waste carrier details</GovUK.H3>
            <GovUK.Paragraph>
              You can enter up to 5 sets of information for any carriers
              involved in the transportation of your waste. If you do not have a
              particular waste carrier`s information, you can leave these
              sections blank.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              If you start to fill in a section for a particular waste carrier,
              you need to complete all relevant details for that section and
              cannot leave any cells blank.
            </GovUK.Paragraph>

            <GovUK.H3 size="SMALL">
              Waste carrier address and contact details
            </GovUK.H3>

            <GovUK.Table>
              <GovUK.Table.Row>
                <TableHeader
                  setWidth="50%"
                  id="table-heading-waste-carrier-type"
                >
                  Waste carrier details
                </TableHeader>
                <TableHeader
                  setWidth="50%"
                  id="table-heading-waste-carrier-answer"
                >
                  Answer format
                </TableHeader>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Waste carrier organisation name</TableHeader>
                <TableCell>
                  Enter the full organisation name of the waste carrier.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Waste carrier address</TableHeader>
                <TableCell>
                  Enter as much of the address as you can, including the country
                  if you have it.
                </TableCell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <TableHeader>Waste carrier contact full name</TableHeader>
                <TableCell>
                  Enter the waste carrier&rsquo;s contact first and last name,
                  for example &lsquo;Philip Stockton&rsquo;.
                </TableCell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <TableHeader>Waste carrier phone number</TableHeader>
                <TableCell>
                  This should be a 15-digit phone number, including the country
                  code in brackets, for example (0091) 98144 21012. <br />
                  Do not use any other special characters, such as (+).
                </TableCell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <TableHeader>Waste carrier email address</TableHeader>
                <TableCell>
                  Enter the waste carrier&rsquo;s email address in the correct
                  format. For example, bob.walker@ccma.co.uk
                </TableCell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <TableHeader>Waste carrier fax number (optional)</TableHeader>
                <TableCell>
                  Enter the waste carrier&rsquo;s fax number in the correct
                  format. If you do not have it, leave the cell blank.
                </TableCell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <TableHeader>Waste carrier means of transport</TableHeader>
                <TableCell>
                  Enter if the waste is travelling by &lsquo;road&rsquo;,
                  &lsquo;rail&rsquo;, &lsquo;sea&rsquo;, &lsquo;air&rsquo;, or
                  &lsquo;inland waterways&rsquo;.
                </TableCell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <TableHeader>
                  Waste carrier mode of transport details (optional)
                </TableHeader>
                <TableCell>
                  Enter any details you have about the mode of transport, for
                  example any:
                  <br />
                  <br />
                  <GovUK.UnorderedList>
                    <GovUK.ListItem>shipping container numbers</GovUK.ListItem>
                    <GovUK.ListItem>
                      vehicle and trailer registrations
                    </GovUK.ListItem>
                    <GovUK.ListItem>
                      International Maritime Organisation (IMO) numbers
                    </GovUK.ListItem>
                    <GovUK.ListItem>
                      details of specialist containers being transported
                    </GovUK.ListItem>
                  </GovUK.UnorderedList>
                  If you do not have any of these, leave the cells blank.
                </TableCell>
              </GovUK.Table.Row>
              <GovUK.Table.Row>
                <TableHeader>Location waste will leave the UK</TableHeader>
                <TableCell>
                  Enter the nearest town, port, or terminal where the waste will
                  leave the UK, for example, Felixstowe. If you do not know
                  this, leave the cell blank.
                </TableCell>
              </GovUK.Table.Row>
            </GovUK.Table>

            <GovUK.Paragraph>
              Countries the waste will travel through (transit countries,
              optional)
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              Enter all the transit countries the waste will travel through. You
              need to write the full name of the countries. You can enter up to
              5 transit countries, separated by commas, in the order the waste
              travels through them.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              If you do not need to enter any transit countries, leave the cells
              blank.
            </GovUK.Paragraph>

            <GovUK.H2 size="MEDIUM">
              <a id="treatment">Treatment of waste</a>
            </GovUK.H2>
            <GovUK.Paragraph>
              If you are exporting small waste to a recovery facility or
              laboratory, you need to fill in this section. You can enter 1
              laboratory&rsquo;s details, or up to 1 interim site and 5 recovery
              facility details.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              For any recovery facility or laboratory details you enter, you
              must complete all the address and contact details for that
              facility.
            </GovUK.Paragraph>
            <GovUK.Paragraph>
              Interim site, recovery facility and laboratory address and contact
              details
            </GovUK.Paragraph>

            <GovUK.Table>
              <GovUK.Table.Row>
                <TableHeader
                  setWidth="50%"
                  id="table-heading-waste-treatment-type"
                >
                  Interim site, recovery facility or laboratory details
                </TableHeader>
                <TableHeader
                  setWidth="50%"
                  id="table-heading-waste-treatment-answer"
                >
                  Answer format
                </TableHeader>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Organisation name</TableHeader>
                <TableCell>
                  Enter the organisation name of the recovery facility or
                  laboratory.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Address</TableHeader>
                <TableCell>
                  Enter as much of the address as you can. Include the postcode
                  if you have it.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Country</TableHeader>
                <TableCell>
                  Enter the recovery facilty or laboratory&rsquo;s country. You
                  can write the name out in full, or use the two letter alpha
                  code format (opens in new tab), for example, &lsquo;DE&rsquo;
                  for Germany.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Contact full name</TableHeader>
                <TableCell>
                  Enter the recovery facility or laboratory&rsquo;s contact
                  first and last name, for example &lsquo;Philip
                  Stockton&rsquo;.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Phone number</TableHeader>
                <TableCell>
                  This should be a 15-digit phone number, including the country
                  code in brackets, for example (0091) 98144 21012. <br />
                  Do not use any other special characters.
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Email address</TableHeader>
                <TableCell>
                  Enter the recovery facility or laboratory&rsquo;s email
                  address in the correct format. For example,
                  bob.walker@ccma.co.uk
                </TableCell>
              </GovUK.Table.Row>

              <GovUK.Table.Row>
                <TableHeader>Fax number (optional)</TableHeader>
                <TableCell>
                  Enter the recovery facility or laboratory&rsquo;s fax number
                  in the correct format. If you do not have it, leave the cell
                  blank.
                </TableCell>
              </GovUK.Table.Row>
            </GovUK.Table>
          </GovUK.GridCol>
        </GovUK.GridRow>
      </GovUK.Page>
    </>
  );
};

export default Guidance;
Guidance.auth = true;
