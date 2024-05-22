import { Page, Document, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Submission } from '@wts/api/waste-tracking-gateway';
import React from 'react';
import { format } from 'date-fns';
import { EwcCodeType } from '../types/wts';

export interface PDFProps {
  title: string;
  author: string;
  description: string;
  data: Submission | Submission[];
}

const styles = StyleSheet.create({
  page: {
    fontSize: '8pt',
    fontFamily: 'Helvetica',
    fontWeight: 'light',
    lineHeight: '1.2',
    display: 'flex',
    padding: 20,
  },
  pageHeader: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
  },
  docTitle: {
    textDecoration: 'underline',
    fontSize: '10pt',
    marginBottom: 5,
  },
  standardText: {
    fontFamily: 'Helvetica',
  },
  label: {
    fontFamily: 'Helvetica-Oblique',
    color: '#333',
  },
  docSubTitle: { marginBottom: '1px', textAlign: 'center', padding: '0 29%' },
  references: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '10px',
    color: '#333',
  },
  row: {
    border: '1pt solid black',
    borderRight: 'none',
    position: 'relative',
    marginTop: '-1pt',
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    borderRight: '1pt solid black',
    padding: '4px',
    width: '50%',
    lineHeight: '1.4pt',
  },
  line: {
    height: '1pt',
    backgroundColor: '#000',
    margin: '2 -4 4',
  },
  cellFullWidth: {
    borderRight: '1pt solid black',
    padding: 4,
    width: '100%',
  },
  cellTitle: { fontFamily: 'Helvetica-Bold', marginBottom: 0 },
  inlineFax: { display: 'flex', flexDirection: 'row' },
  stackedFax: { flexDirection: 'column' },
  inlineFaxCell: { width: '50%' },
  subtitle: { marginBottom: '5px', fontSize: '8pt' },
  sup: {
    fontStyle: 'italic',
    fontSize: '7pt',
    fontFamily: 'Helvetica-Oblique',
    verticalAlign: 'super',
  },
  nameDateSig: {
    marginTop: '10px',
  },
  warning: {
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  meta: {
    fontSize: '7pt',
    marginTop: '5px',
  },
  metaBullet: {
    marginTop: '5px',
    paddingLeft: '15px',
  },
  metaBulletPoint: {
    position: 'absolute',
    left: 0,
  },
  flexWrap: {
    display: 'flex',
    borderLeft: '1px solid #000',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexRowCell: {
    flexBasis: '33.33%',
    borderRight: '1px solid #000',
    borderBottom: '1px solid #000',
    padding: '1px 0',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  flexRowCell2: {
    flexBasis: '25%',
  },
  flexRowCell3: {
    flexBasis: '20%',
  },
  flexRowCellHeader: {
    flexGrow: 1,
  },
});

export const PDFLayout = (props: PDFProps) => {
  return (
    <Document
      title={props.title}
      author={props.author}
      subject={props.description}
    >
      <>
        {Array.isArray(props.data) &&
          props.data.map((page, index) => (
            <Pages data={page} key={`page${index}`} />
          ))}
        {!Array.isArray(props.data) && <Pages data={props.data} />}
      </>
    </Document>
  );
};

const Pages = ({ data }) => {
  const recFacCount = data.recoveryFacilityDetail.length | 0;
  let ewcCodesCount = data.wasteDescription.ewcCodes.length | 0;

  let extraEwcCodesCount = 0;
  if (ewcCodesCount > 3) {
    extraEwcCodesCount = ewcCodesCount - 3;
    ewcCodesCount = 3;
  }
  const transitCount = data.transitCountries.length | 0;
  let transitColumns = 1;
  if (transitCount === 2) {
    transitColumns = 2;
  }
  if (transitCount > 2) {
    transitColumns = 3;
  }

  return (
    <>
      <Page style={styles.page} size="A4" wrap={false}>
        <Reference
          transactionId={data.submissionDeclaration.transactionId}
          reference={data.reference}
        />
        <View style={styles.pageHeader}>
          <Text style={styles.docTitle}>Annex VII</Text>
          <Text style={styles.docSubTitle}>
            Information Accompanying Shipments of Waste as referred to in
            Article 3 (2) and (4)
          </Text>
        </View>
        <Text style={styles.subtitle}>
          Consignment information <Text style={styles.sup}>(1)</Text>
        </Text>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellTitle}>
              1. Person who arranges the shipment (exporter)
            </Text>

            <AddressDetails
              address={data.exporterDetail.exporterAddress}
              contact={data.exporterDetail.exporterContactDetails}
            />
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellTitle}>2. Importer/consignee</Text>

            <AddressDetails
              address={data.importerDetail.importerAddressDetails}
              contact={data.importerDetail.importerContactDetails}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellTitle}>
              3. Actual quantity:{' '}
              <Text style={styles.standardText}>
                {data.wasteQuantity.type === 'EstimateData' && (
                  <>
                    {data.wasteDescription.wasteCode.type ===
                    'NotApplicable' ? (
                      <>&nbsp;kg: __________</>
                    ) : (
                      <>&nbsp;Tonnes (Mg): __________ m3: __________</>
                    )}
                  </>
                )}

                {data.wasteQuantity.type === 'ActualData' && (
                  <>
                    &nbsp;
                    {data.wasteQuantity.actualData.value}
                    <UnitDisplay
                      quantityType={data.wasteQuantity.actualData.quantityType}
                      type={data.wasteDescription.wasteCode.type}
                    />
                  </>
                )}
              </Text>
            </Text>
          </View>

          <View style={styles.cell}>
            <Text style={styles.cellTitle}>
              4. Actual date of shipment:
              <Text style={styles.standardText}>
                {data.collectionDate.type === 'ActualDate' &&
                  format(
                    new Date(
                      Number(data.collectionDate.actualDate.year),
                      Number(data.collectionDate.actualDate.month) - 1,
                      Number(data.collectionDate.actualDate.day)
                    ),
                    'd MMMM y'
                  )}
              </Text>
            </Text>
          </View>
        </View>
        <CarrierDetails carriers={data.carriers} />
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellTitle}>
              6. Waste generator <Text style={styles.sup}>(3)</Text>
            </Text>
            <Text style={styles.cellTitle}>
              Original producer(s), new producer(s) or collector:
            </Text>

            <AddressDetails
              address={data.collectionDetail.address}
              contact={data.collectionDetail.contactDetails}
            />
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellTitle}>
              8. Recovery operation (or if appropriate disposal operation in the
              case of waste referred to in Article 3(4)):
            </Text>
            <Text>
              {data.recoveryFacilityDetail.map((facility, index) => {
                if (facility.recoveryFacilityType.type === 'Laboratory') {
                  return (
                    <Text key={`facility${index}`}>
                      Disposal Code:{' '}
                      {facility.recoveryFacilityType.disposalCode}
                      {index + 1 !== recFacCount ? ', ' : ''}
                    </Text>
                  );
                }
                if (facility.recoveryFacilityType.type === 'InterimSite') {
                  return (
                    <Text key={`facility${index}`}>
                      Recovery Code:{' '}
                      {facility.recoveryFacilityType.recoveryCode}{' '}
                      (Interim-site){index + 1 !== recFacCount ? ', ' : ''}
                    </Text>
                  );
                }
                if (facility.recoveryFacilityType.type === 'RecoveryFacility') {
                  return (
                    <Text key={`facility${index}`}>
                      {facility.recoveryFacilityType.recoveryCode}
                      {index + 1 !== recFacCount ? ', ' : ''}
                    </Text>
                  );
                }
              })}
            </Text>
            <View style={styles.line} />
            <Text style={styles.cellTitle}>
              9. Usual description of the waste
            </Text>
            <Text>{data.wasteDescription.description}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}>
            <Text style={styles.cellTitle}>
              {data.wasteDescription.wasteCode.type === 'NotApplicable'
                ? '7. Laboratory'
                : '7. Recovery facility'}
            </Text>

            <SiteDetails
              data={data.recoveryFacilityDetail}
              type={
                data.wasteDescription.wasteCode.type === 'NotApplicable'
                  ? 'Laboratory'
                  : 'RecoveryFacility'
              }
              index={0}
              inlineFax={true}
            />
          </View>
          <View style={styles.cell}>
            <Text style={styles.cellTitle}>10. Waste identification:</Text>

            <>
              <Text>
                {data.wasteDescription.wasteCode.type === 'NotApplicable' ? (
                  <>
                    <Text style={styles.label}>Waste code: </Text>
                    Not applicable
                  </>
                ) : (
                  <>
                    <Text style={styles.label}>
                      {data.wasteDescription.wasteCode.type}:{' '}
                    </Text>
                    {data.wasteDescription.wasteCode.code}
                  </>
                )}
              </Text>
              <Text>
                <Text style={styles.label}>EC list of wastes: </Text>
                {data.wasteDescription.ewcCodes
                  .slice(0, 3)
                  .map((item: EwcCodeType, index) => (
                    <Text key={`ewcCode${item.code}`}>
                      {item.code}
                      {index + 1 !== ewcCodesCount ? ', ' : ''}
                    </Text>
                  ))}
              </Text>
              <Text>
                <Text style={styles.label}>National code: </Text>
                <>
                  {data.wasteDescription.nationalCode?.provided === 'Yes' &&
                    data.wasteDescription.nationalCode?.value}
                </>
              </Text>
            </>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellFullWidth}>
            <Text style={styles.cellTitle}>
              11. Countries/states concerned:
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.flexWrap}>
            <View style={styles.flexRow}>
              <View
                style={[
                  styles.flexRowCell,
                  styles[`flexRowCell${transitColumns}`],
                ]}
              >
                <Text>Export/dispatch</Text>
              </View>
              <View style={[styles.flexRowCell, styles.flexRowCellHeader]}>
                <Text>Transit</Text>
              </View>
              <View
                style={[
                  styles.flexRowCell,
                  styles[`flexRowCell${transitColumns}`],
                ]}
              >
                <Text>Import/destination</Text>
              </View>
            </View>
            <View style={styles.flexRow}>
              <View
                style={[
                  styles.flexRowCell,
                  styles[`flexRowCell${transitColumns}`],
                ]}
              >
                <Text>{data.exporterDetail.exporterAddress.country}</Text>
              </View>
              {data.transitCountries.slice(0, 3).map((country, index) => (
                <View
                  style={[
                    styles.flexRowCell,
                    styles[`flexRowCell${transitColumns}`],
                  ]}
                  key={`tc-${index}`}
                >
                  <Text>{country}</Text>
                </View>
              ))}
              {transitCount === 0 && (
                <View
                  style={[
                    styles.flexRowCell,
                    styles[`flexRowCell${transitColumns}`],
                  ]}
                >
                  <Text />
                </View>
              )}
              <View
                style={[
                  styles.flexRowCell,
                  styles[`flexRowCell${transitColumns}`],
                ]}
              >
                <Text>
                  {data.importerDetail.importerAddressDetails.country}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellFullWidth}>
            <Text style={styles.cellTitle}>
              12. Declaration of the person who arranges the shipment:{' '}
              <Text style={styles.standardText}>
                I certify that the above information is complete and correct to
                my best knowledge. I also certify that effective written
                contractual obligations have been entered into with the
                consignee (not required in the case of waste referred to in
                Article 3(4)):
              </Text>
            </Text>
            <NameDateSignature />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellFullWidth}>
            <Text style={styles.cellTitle}>
              13. Signature upon receipt of the waste by the consignee:
            </Text>
            <NameDateSignature />
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.cellFullWidth, { backgroundColor: '#f5f5f5' }]}>
            <Text style={styles.cellTitle}>
              {data.wasteDescription.wasteCode.type === 'NotApplicable' ? (
                <Text style={styles.warning}>
                  To be completed by the Laboratory
                </Text>
              ) : (
                <Text style={styles.warning}>
                  To be completed by the Recovery facility
                </Text>
              )}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.cellFullWidth}>
            <Text style={styles.cellTitle}>
              {data.wasteDescription.wasteCode.type === 'NotApplicable'
                ? '14. Shipment received at laboratory '
                : '14. Shipment received at recovery facility '}

              <Text style={styles.standardText}>
                Quantity received:
                {
                  <>
                    {data.wasteQuantity.type === 'ActualData' ? (
                      <>
                        <UnitDisplay
                          quantityType={
                            data.wasteQuantity.actualData.quantityType
                          }
                          type={data.wasteDescription.wasteCode.type}
                        />
                        <>: __________</>
                      </>
                    ) : (
                      <>
                        {data.wasteDescription.wasteCode.type ===
                        'NotApplicable' ? (
                          <>&nbsp;kg: __________</>
                        ) : (
                          <>&nbsp;tonnes (Mg): __________ m3: __________</>
                        )}
                      </>
                    )}
                  </>
                }
              </Text>
            </Text>
            <NameDateSignature />
          </View>
        </View>
        <View style={styles.meta}>
          <View style={styles.metaBullet}>
            <Text style={styles.metaBulletPoint}>(1)</Text>
            <Text>
              Information accompanying shipments of green listed waste and
              destined for recovery or waste destined for laboratory analysis
              pursuant to Regulation (EC) No 1013/2006. For completing this
              document, see also the corresponding specific instructions as
              contained in Annex IC of Regulation (EC) No 1013/2006 on shipments
              of waste.
            </Text>
          </View>
          <View style={styles.metaBullet}>
            <Text style={styles.metaBulletPoint}>(2)</Text>
            <Text>
              If more than 3 carriers, attach information as required in blocks
              5 (a, b, c).{' '}
            </Text>
          </View>
          <View style={styles.metaBullet}>
            <Text style={styles.metaBulletPoint}>(3)</Text>
            <Text>
              When the person who arranges the shipment is not the producer or
              collector, information about the producer or collector shall be
              provided.{' '}
            </Text>
          </View>
          <View style={styles.metaBullet}>
            <Text style={styles.metaBulletPoint}>(4)</Text>
            <Text>
              The relevant code(s) as indicated in Annex IIIA to Regulation (EC)
              No 1013/2006 are to be used, as appropriate in sequence. Certain
              Basel entries such as B1100, B3010 and B3020 are restricted to
              particular waste streams only, as indicated in Annex IIIA.{' '}
            </Text>
          </View>
          <View style={styles.metaBullet}>
            <Text style={styles.metaBulletPoint}>(5)</Text>
            <Text>
              The BEU codes listed in Annex IIIB to Regulation (EC) No 1013/2006
              are to be used.
            </Text>
          </View>
        </View>
      </Page>
      <Page style={styles.page} size="A4" wrap={true}>
        <Reference
          transactionId={data.submissionDeclaration.transactionId}
          reference={data.reference}
        />
        <View style={styles.pageHeader}>
          <Text style={styles.docTitle}>Annex VII</Text>
          <Text style={styles.docSubTitle}>
            Information Accompanying Shipments of Waste as referred to in
            Article 3 (2) and (4)
          </Text>
        </View>
        <Text style={styles.subtitle}>
          Additional information for the Annex VII
        </Text>

        <>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>5. (d) 4th carrier</Text>
              <AddressDetails
                address={data.carriers[3]?.addressDetails}
                contact={data.carriers[3]?.contactDetails}
                inlineFax={false}
              />
              <TransportMeans
                transportDetails={data.carriers[3]?.transportDetails}
              />
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}> 5. (e) 5th carrier</Text>
              <AddressDetails
                address={data.carriers[4]?.addressDetails}
                contact={data.carriers[4]?.contactDetails}
                inlineFax={false}
              />
              <TransportMeans
                transportDetails={data.carriers[4]?.transportDetails}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>
                5 cont. Means of transport details (if provided)
              </Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>5.(a) 1st carrier (2)</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>5.(b) 2nd carrier</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>5.(c) 3rd carrier</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>5.(d) 4th carrier</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>5.(e) 5th carrier</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text />
            </View>
            <View style={styles.cell}>
              <Text>
                {formatTransportType(data.carriers[0]?.transportDetails?.type)}
              </Text>
              <Text style={styles.label}>
                {data.carriers[0]?.transportDetails?.description}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                {formatTransportType(data.carriers[1]?.transportDetails?.type)}
              </Text>
              <Text style={styles.label}>
                {data.carriers[1]?.transportDetails?.description}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                {formatTransportType(data.carriers[2]?.transportDetails?.type)}
              </Text>
              <Text style={styles.label}>
                {data.carriers[2]?.transportDetails?.description}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                {formatTransportType(data.carriers[3]?.transportDetails?.type)}
              </Text>
              <Text style={styles.label}>
                {data.carriers[3]?.transportDetails?.description}
              </Text>
            </View>
            <View style={styles.cell}>
              <Text>
                {formatTransportType(data.carriers[4]?.transportDetails?.type)}
              </Text>
              <Text style={styles.label}>
                {data.carriers[4]?.transportDetails?.description}
              </Text>
            </View>
          </View>
        </>

        <>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>
                7. Second recovery site details:
              </Text>
              <SiteDetails
                data={data.recoveryFacilityDetail}
                type={
                  data.wasteDescription.wasteCode.type === 'NotApplicable'
                    ? 'Laboratory'
                    : 'RecoveryFacility'
                }
                index={1}
              />
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>
                7. Third recovery site details:
              </Text>
              <SiteDetails
                data={data.recoveryFacilityDetail}
                type={
                  data.wasteDescription.wasteCode.type === 'NotApplicable'
                    ? 'Laboratory'
                    : 'RecoveryFacility'
                }
                index={2}
              />
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>
                7. Fourth recovery site details:
              </Text>
              <SiteDetails
                data={data.recoveryFacilityDetail}
                type={
                  data.wasteDescription.wasteCode.type === 'NotApplicable'
                    ? 'Laboratory'
                    : 'RecoveryFacility'
                }
                index={3}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.cell, { flexGrow: 1, width: '33.33%' }]}>
              <Text style={styles.cellTitle}>
                7. Fifth recovery site details:
              </Text>
              <SiteDetails
                data={data.recoveryFacilityDetail}
                type={
                  data.wasteDescription.wasteCode.type === 'NotApplicable'
                    ? 'Laboratory'
                    : 'RecoveryFacility'
                }
                index={4}
              />
            </View>
            <View style={[styles.cell, { flexGrow: 2, width: '66.66%' }]}>
              <Text style={styles.cellTitle}>Interim site:</Text>
              <SiteDetails
                data={data.recoveryFacilityDetail}
                type="InterimSite"
                index={0}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cellFullWidth}>
              <Text style={styles.cellTitle}>
                10. Additional EWC waste identification codes:{' '}
                <Text style={styles.standardText}>
                  {data.wasteDescription.ewcCodes
                    .slice(3, 5)
                    .map((item: EwcCodeType, index) => (
                      <Text key={`ewcCode${item.code}`}>
                        {item.code}
                        {index + 1 !== extraEwcCodesCount ? ', ' : ''}
                      </Text>
                    ))}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>
                11. Countries/states concerned:{' '}
              </Text>
              <Text style={styles.cellTitle}>
                4th:{' '}
                <Text style={styles.standardText}>
                  {data.transitCountries.length > 3 && data.transitCountries[3]}
                </Text>
              </Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.cellTitle}>
                5th:{' '}
                <Text style={styles.standardText}>
                  {data.transitCountries.length > 4 && data.transitCountries[4]}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.cellFullWidth}>
              <Text style={styles.cellTitle}>
                15. Location the waste will leave the UK:{' '}
                <Text style={styles.standardText}>
                  {data.ukExitLocation.provided === 'Yes' &&
                    data.ukExitLocation.value}
                </Text>
              </Text>
            </View>
          </View>
        </>
      </Page>
    </>
  );
};

const CarrierDetails = ({ carriers }) => {
  return (
    <View style={styles.row}>
      <View style={styles.cell}>
        <Text style={styles.cellTitle}>
          5. (a) 1st carrier <Text style={styles.sup}>(2)</Text>
        </Text>
        <AddressDetails
          address={carriers[0]?.addressDetails}
          contact={carriers[0]?.contactDetails}
          inlineFax={false}
        />
        <TransportMeans transportDetails={carriers[0]?.transportDetails} />
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellTitle}>5. (b) 2nd carrier </Text>
        <AddressDetails
          address={carriers[1]?.addressDetails}
          contact={carriers[1]?.contactDetails}
          inlineFax={false}
        />
        <TransportMeans transportDetails={carriers[1]?.transportDetails} />
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellTitle}>5. (c) 3rd carrier </Text>
        <AddressDetails
          address={carriers[2]?.addressDetails}
          contact={carriers[2]?.contactDetails}
          inlineFax={false}
        />
        <TransportMeans transportDetails={carriers[2]?.transportDetails} />
      </View>
    </View>
  );
};

const AddressDetails = ({ address, contact, inlineFax = true }) => {
  return (
    <View>
      <Text>
        <Text style={styles.label}>Name:</Text>{' '}
        {address?.organisationName ||
          address?.name ||
          contact?.organisationName}
      </Text>
      <Text>
        <Text style={styles.label}>Address: </Text>
        {address && (
          <>
            <AddressLine addressLine={address?.addressLine1} />
            <AddressLine addressLine={address?.addressLine2} />
            <AddressLine addressLine={address?.townCity} />
            <AddressLine addressLine={address?.postcode} />
            <AddressLine addressLine={address?.address} />
            <Text>{address?.country}</Text>
          </>
        )}
      </Text>
      <Text>
        <Text style={styles.label}>Contact person:</Text> {contact?.fullName}
      </Text>
      <View style={inlineFax ? styles.inlineFax : styles.stackedFax}>
        <Text style={styles.inlineFaxCell}>
          <Text style={styles.label}>Tel:</Text> {contact?.phoneNumber}
        </Text>
        <Text style={styles.inlineFaxCell}>
          <Text style={styles.label}>Fax:</Text> {contact?.faxNumber}
        </Text>
      </View>
      <Text>
        <Text style={styles.label}>Email:</Text> {contact?.emailAddress}
      </Text>
    </View>
  );
};

const AddressLine = ({ addressLine }) => {
  return (
    <Text>
      {addressLine}
      {addressLine ? ', ' : ''}
    </Text>
  );
};

const TransportMeans = ({ transportDetails }) => {
  return (
    <View>
      <Text>
        <Text style={styles.label}>Means of transport:</Text>{' '}
        {formatTransportType(transportDetails?.type)}
      </Text>
      <Text>
        <Text style={styles.label}>Date of transport:</Text>
      </Text>
      <Text>
        <Text style={styles.label}>Signature:</Text>
      </Text>
    </View>
  );
};

const NameDateSignature = () => {
  return (
    <View style={styles.nameDateSig}>
      <Text>
        <Text style={styles.label}>Name:</Text> ________________________________
        {'   '}
        <Text style={styles.label}>Date:</Text> ______________{'   '}
        <Text style={styles.label}>Signature:</Text>{' '}
        ________________________________________{' '}
      </Text>
    </View>
  );
};

const Reference = ({ transactionId, reference }) => {
  return (
    <View style={styles.references}>
      <Text>
        Export green list waste from the UK transaction number: {transactionId}
      </Text>
      <Text>Your unique reference: {reference}</Text>
    </View>
  );
};

const UnitDisplay = ({ type, quantityType }) => {
  let unit = '';
  if (type === 'NotApplicable' && quantityType === 'Weight') {
    unit = 'kg';
  } else if (type !== 'NotApplicable' && quantityType === 'Weight') {
    unit = 'tonnes';
  } else if (type !== 'NotApplicable' && quantityType === 'Volume') {
    unit = 'm3';
  }
  return <> {unit} </>;
};

const formatTransportType = (type) => {
  if (type === 'InlandWaterways') return 'Inland waterways';
  return type;
};

const SiteDetails = ({ data, type, index, inlineFax = false }) => {
  const facilities = data.filter((f) => f.recoveryFacilityType.type === type);
  let facility;

  if (index === 0 && facilities.length > 0) {
    facility = facilities[0];
  }

  if (index === 1 && facilities.length > 1) {
    facility = facilities[1];
  }

  if (index === 2 && facilities.length > 2) {
    facility = facilities[2];
  }

  if (index === 3 && facilities.length > 3) {
    facility = facilities[3];
  }

  if (index === 4 && facilities.length > 4) {
    facility = facilities[4];
  }

  return (
    <>
      <AddressDetails
        address={facility?.addressDetails}
        contact={facility?.contactDetails}
        inlineFax={inlineFax}
      />
    </>
  );
};
