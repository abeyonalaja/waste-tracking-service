# frozen_string_literal: true

# this page is for multiple ukmw guidance page details
class UkwmUserGuidancePage < GenericPage

  TITLE = Translations.ukmv_value 'multiples.guidancePage.heading'
  HINT = Translations.ukmv_value 'multiples.guidancePage.hint'
  LINK1 = Translations.ukmv_value 'multiples.guidancePage.content.linkOne'
  LINK2 = Translations.ukmv_value 'multiples.guidancePage.content.linkTwo'
  LINK3 = Translations.ukmv_value 'multiples.guidancePage.content.linkThree'
  LINK4 = Translations.ukmv_value 'multiples.guidancePage.content.linkFour'
  LINK5 = Translations.ukmv_value 'multiples.guidancePage.content.linkFive'
  LINK6 = Translations.ukmv_value 'multiples.guidancePage.content.linkSix'

  DOCUMENTS_HEADING = Translations.ukmv_value 'multiples.guidancePage.documents.heading'
  DOCUMENTS_LINK = Translations.ukmv_value 'multiples.guidancePage.documents.linkOne'

  DETAILS_HEADING = Translations.ukmv_value 'multiples.guidancePage.details.heading'
  DETAILS_CONTENT = Translations.ukmv_value 'multiples.guidancePage.details.content'
  LIST_INFO = Translations.ukmv_value 'multiples.guidancePage.details.listInfo'
  LIST_ONE = Translations.ukmv_value 'multiples.guidancePage.details.listItemOne'
  LIST_TWO = Translations.ukmv_value 'multiples.guidancePage.details.listItemTwo'
  LIST_THREE = Translations.ukmv_value 'multiples.guidancePage.details.listItemThree'
  LIST_OUTRO = Translations.ukmv_value 'multiples.guidancePage.details.outro'

  MULTIPLES_HEADING = Translations.ukmv_value 'multiples.guidancePage.details.multiple.heading'
  MULTIPLES_CONTENT1 = Translations.ukmv_value 'multiples.guidancePage.details.multiple.contentOne'
  MULTIPLES_CONTENT2 = Translations.ukmv_value 'multiples.guidancePage.details.multiple.contentTwo'

  TECH_ISSUES_HEADING = Translations.ukmv_value 'multiples.guidancePage.details.technicalIssue.heading'
  TECH_ISSUES_CONTENT1 = Translations.ukmv_value 'multiples.guidancePage.details.technicalIssue.contentOne'
  TECH_ISSUES_LIST1 = Translations.ukmv_value 'multiples.guidancePage.details.technicalIssue.listItemOne'
  TECH_ISSUES_LIST2 = Translations.ukmv_value 'multiples.guidancePage.details.technicalIssue.listItemTwo'
  TECH_ISSUES_CONTENT1 = Translations.ukmv_value 'multiples.guidancePage.details.technicalIssue.contentTwo'
  TECH_ISSUES_EMAIL = Translations.ukmv_value 'multiples.guidancePage.details.technicalIssue.email'

  REG_ISSUES_HEADING = Translations.ukmv_value 'multiples.guidancePage.details.regulatoryIssue.heading'
  REG_ISSUES_CONTENT1 = Translations.ukmv_value 'multiples.guidancePage.details.regulatoryIssue.contentOne'
  REG_ISSUES_CONTENT2 = Translations.ukmv_value 'multiples.guidancePage.details.regulatoryIssue.contentTwo'

  CSV_GUIDANCE_HEADING = Translations.ukmv_value 'multiples.guidancePageCSV.heading'
  CSV_GUIDANCE_HINT = Translations.ukmv_value 'multiples.guidancePageCSV.hint'
  CSV_GUIDANCE_CONTENT1 = Translations.ukmv_value 'multiples.guidancePageCSV.contentOne'
  CSV_GUIDANCE_CONTENT2 = Translations.ukmv_value 'multiples.guidancePageCSV.contentTwo'
  CSV_GUIDANCE_LIST1 = Translations.ukmv_value 'multiples.guidancePageCSV.listItemOne'
  CSV_GUIDANCE_LIST2 = Translations.ukmv_value 'multiples.guidancePageCSV.listItemTwo'
  CSV_GUIDANCE_LIST3 = Translations.ukmv_value 'multiples.guidancePageCSV.listItemThree'
  CSV_GUIDANCE_LIST4 = Translations.ukmv_value 'multiples.guidancePageCSV.listItemFour'
  CSV_GUIDANCE_LIST5 = Translations.ukmv_value 'multiples.guidancePageCSV.listItemFive'

  UNIQUE_REF_HEADING = Translations.ukmv_value 'multiples.guidancePageCSV.uniqueReference.heading'
  UNIQUE_REF_CONTENT1 = Translations.ukmv_value 'multiples.guidancePageCSV.uniqueReference.contentOne'
  UNIQUE_REF_CONTENT2 = Translations.ukmv_value 'multiples.guidancePageCSV.uniqueReference.contentTwo'
  UNIQUE_REF_CONTENT3 = Translations.ukmv_value 'multiples.guidancePageCSV.uniqueReference.contentThree'
  UNIQUE_REF_CONTENT4 = Translations.ukmv_value 'multiples.guidancePageCSV.uniqueReference.contentFour'

  PRODUCER_HEADING = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.heading'
  PRODUCER_HEADING2 = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.headingProducer'
  PRODUCER_CONTENT = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.contentProducer'
  PRODUCER_TABLE = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.producer'
  PRODUCER_ANSWER = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.answerFormat'
  PRODUCER_ORGNAME = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.organisationName'
  PRODUCER_ORG_DESCRIPTION = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.organisationDescription'
  PRODUCER_ADDRESS = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.address'
  PRODUCER_ADDRESS_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.addressDescription'
  PRODUCER_POSTCODE = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.postcode'
  PRODUCER_POSTCODE_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.postcodeDescription'
  PRODUCER_EMAIL = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.contactEmail'
  PRODUCER_EMAIL_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.contactEmailDescription'
  PRODUCER_EMAIL_EXAMPLE = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.contactEmailExample'
  PRODUCER_CONTACT_PHONE = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.contactPhone'
  PRODUCER_CONTACTPHONE_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.contactPhoneDescription'
  PRODUCER_SIC = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.sicCode'
  PRODUCER_SIC_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.sitCodeDescriptionOne'
  PRODUCER_SIC_LINK = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.sitCodeLink'
  PRODUCER_SIC_DESCR2 = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableProducerDetails.sitCodeDescriptionTwo'

  COLLECTION_DETAILS_HEADING = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.headingCollection'
  COLLECTION_DETAILS_COLLECTION = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.collection'
  COLLECTION_DETAILS_ANSWER = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.answerFormat'
  COLLECTION_DETAILS_PRODUCER = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.isProducerAddressSame'
  COLLECTION_DETAILS_PRODUCER_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.isProducerAddressSameDescription'
  COLLECTION_DETAILS_COLECTION_ADDRESS = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.collectionAddress'
  COLLECTION_DETAILS_COLECTION_ADDRESS_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.collectionAddressDescription'
  COLLECTION_DETAILS_POSTCODE = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.collectionPostcode'
  COLLECTION_DETAILS_POSTCODE_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.collectionPostcodeDescription'
  COLLECTION_DETAILS_WASTE_SOURCE = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.wasteSource'
  COLLECTION_DETAILS_WASTE_SOURCE_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.wasteSourceDescription'
  COLLECTION_DETAILS_BROKE_REG_NUM = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.brokerRegistrationNumber'
  COLLECTION_DETAILS_BROKE_REG_NUM_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.brokerRegistrationNumberDescription'
  COLLECTION_DETAILS_CARRIER_REG_NUM = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.carrierRegistrationNumber'
  COLLECTION_DETAILS_CARRIER_REG_NUM_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.carrierRegistrationNumberDescription'
  COLLECTION_DETAILS_TRANSPORT = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.modeOfTransport'
  COLLECTION_DETAILS_TRANSPORT_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.modeOfTransportDescription'
  ROAD = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.road'
  RAIL = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.rail'
  SEA = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.sea'
  AIR = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.air'
  INLAND_WATER = Translations.ukmv_value 'multiples.guidancePageCSV.producerAndCollectionDetails.tableCollectionDetails.inlandWaterways'

  RECEIVER_HEADING = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.heading'
  RECEIVER_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.description'
  RECEIVER_CONTENT1_HEAD = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentHeadingOne'
  RECEIVER_CONTENT1_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentDescriptionOne'
  RECEIVER_CONTENT1_LINK = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentLinkOne'
  RECEIVER_CONTENT2_HEAD = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentHeadingTwo'
  RECEIVER_CONTENT2_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentDescriptionTwo'
  RECEIVER_CONTENT2_LINK = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentLinkTwo'
  RECEIVER_CONTENT3_HEAD = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentHeadingThree'
  RECEIVER_CONTENT3_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentDescriptionThree'
  RECEIVER_CONTENT4_HEAD = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentHeadingFour'
  RECEIVER_CONTENT4_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentDescriptionFour'
  RECEIVER_CONTENT5_HEAD = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentHeadingFive'
  RECEIVER_CONTENT5_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.receiverDetails.contentDescriptionFive'

  EWC_HEADING = Translations.ukmv_value 'multiples.guidancePageCSV.ewcCodesAndDescription.heading'
  EWC_CONTENT1 = Translations.ukmv_value 'multiples.guidancePageCSV.ewcCodesAndDescription.contentOne'
  EWC_CONTENT1_LINK = Translations.ukmv_value 'multiples.guidancePageCSV.ewcCodesAndDescription.contentLink'
  EWC_CONTENT2 = Translations.ukmv_value 'multiples.guidancePageCSV.ewcCodesAndDescription.contentTwo'
  EWC_CONTENT3 = Translations.ukmv_value 'multiples.guidancePageCSV.ewcCodesAndDescription.contentThree'
  EWC_CODES_HEADING = Translations.ukmv_value 'multiples.guidancePageCSV.ewcCodesAndDescription.codes.heading'
  EWC_CODES_CONTENT = Translations.ukmv_value 'multiples.guidancePageCSV.ewcCodesAndDescription.codes.content'

  DESCR_WASTE_HEADING1 = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.headingOne'
  DESCR_WASTE_HEADING2 = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.headingTwo'
  DESCR_WASTE_CONTENT1 = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.contentOne'
  DESCR_WASTE_CONTENT2 = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.contentTwo'
  DESCR_WASTE_HEADING3 = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.headingThree'
  DESCR_WASTE_CONTENT3 = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.contentThree'
  GAS = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.gas'
  LIQUID = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.liquid'
  SOLID = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.solid'
  POWDER = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.powder'
  SLUDGE = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.sludge'
  MIXED = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.mixed'

  QUANTITY_HEADING = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.headingQuantity'
  QUANTITY_DETAILS_HEADING = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.wasteQuantityDetails.heading'
  QUANTITY_DETAILS_ANSWER = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.wasteQuantityDetails.answerFormat'
  QUANTITY = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.wasteQuantityDetails.wasteQuantity'
  QUANTITY_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.wasteQuantityDetails.wasteQuantityDescription'
  QUANTITY_UNITS = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.wasteQuantityDetails.wasteQuantityUnits'
  QUANTITY_UNITS_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.wasteQuantityDetails.wasteQuantityUnitsDescription'
  QUANTITY_EST_ACT = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.wasteQuantityDetails.estimatedOrActualQuantity'
  QUANTITY_EST_ACT_DESCR = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.wasteQuantityDetails.estimatedOrActualQuantityDescription'

  DESCR_WASTE_HEADING4 = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.headingFour'
  DESCR_WASTE_CONTENT4 = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.contentFour'
  DESCR_WASTE_CONTENT_LINK = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.contentLink'
  DESCR_WASTE_HEADING5 = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.headingFive'
  DESCR_WASTE_CONTENT5 = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.contentFive'
  DESCR_WASTE_CONTENT_LINK2 = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.contentLinkTwo'
  DESCR_WASTE_CONTENT5_FINAL = Translations.ukmv_value 'multiples.guidancePageCSV.descriptionOfTheWaste.contentFiveFinal'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text HINT
    expect(self).to have_text LINK1
    expect(self).to have_text LINK2
    expect(self).to have_text LINK3
    expect(self).to have_text LINK4
    expect(self).to have_text LINK5
    expect(self).to have_text LINK6
    expect(self).to have_text DOCUMENTS_HEADING
    expect(self).to have_text DOCUMENTS_LINK
    expect(self).to have_text DETAILS_HEADING
    expect(self).to have_text DETAILS_CONTENT
    expect(self).to have_text LIST_INFO
    expect(self).to have_text LIST_ONE
    expect(self).to have_text LIST_TWO
    expect(self).to have_text LIST_THREE
    expect(self).to have_text LIST_OUTRO
    expect(self).to have_text MULTIPLES_HEADING
    expect(self).to have_text MULTIPLES_CONTENT1
    expect(self).to have_text MULTIPLES_CONTENT2
    expect(self).to have_text TECH_ISSUES_HEADING
    expect(self).to have_text TECH_ISSUES_CONTENT1
    expect(self).to have_text TECH_ISSUES_LIST1
    expect(self).to have_text TECH_ISSUES_LIST2
    expect(self).to have_text TECH_ISSUES_CONTENT1
    expect(self).to have_text TECH_ISSUES_EMAIL
    expect(self).to have_text REG_ISSUES_HEADING
    expect(self).to have_text REG_ISSUES_CONTENT1
    expect(self).to have_text REG_ISSUES_CONTENT2
    expect(self).to have_text CSV_GUIDANCE_HEADING
    expect(self).to have_text CSV_GUIDANCE_HINT
    expect(self).to have_text CSV_GUIDANCE_CONTENT1
    expect(self).to have_text CSV_GUIDANCE_CONTENT2
    expect(self).to have_text CSV_GUIDANCE_LIST1
    expect(self).to have_text CSV_GUIDANCE_LIST2
    expect(self).to have_text CSV_GUIDANCE_LIST3
    expect(self).to have_text CSV_GUIDANCE_LIST4
    expect(self).to have_text CSV_GUIDANCE_LIST5
    expect(self).to have_text UNIQUE_REF_HEADING
    expect(self).to have_text UNIQUE_REF_CONTENT1
    expect(self).to have_text UNIQUE_REF_CONTENT2
    expect(self).to have_text UNIQUE_REF_CONTENT3
    expect(self).to have_text UNIQUE_REF_CONTENT4
    expect(self).to have_text PRODUCER_HEADING
    expect(self).to have_text PRODUCER_HEADING2
    expect(self).to have_text PRODUCER_CONTENT
    expect(self).to have_text PRODUCER_TABLE
    expect(self).to have_text PRODUCER_ANSWER
    expect(self).to have_text PRODUCER_ORGNAME
    expect(self).to have_text PRODUCER_ORG_DESCRIPTION
    expect(self).to have_text PRODUCER_ADDRESS
    expect(self).to have_text PRODUCER_ADDRESS_DESCR
    expect(self).to have_text PRODUCER_POSTCODE
    expect(self).to have_text PRODUCER_POSTCODE_DESCR
    expect(self).to have_text PRODUCER_EMAIL
    expect(self).to have_text PRODUCER_EMAIL_DESCR
    expect(self).to have_text PRODUCER_EMAIL_EXAMPLE
    expect(self).to have_text PRODUCER_CONTACT_PHONE
    expect(self).to have_text PRODUCER_CONTACTPHONE_DESCR
    expect(self).to have_text PRODUCER_SIC
    expect(self).to have_text PRODUCER_SIC_DESCR
    expect(self).to have_text PRODUCER_SIC_LINK
    expect(self).to have_text PRODUCER_SIC_DESCR2
    expect(self).to have_text COLLECTION_DETAILS_HEADING
    expect(self).to have_text COLLECTION_DETAILS_COLLECTION
    expect(self).to have_text COLLECTION_DETAILS_ANSWER
    expect(self).to have_text COLLECTION_DETAILS_PRODUCER
    expect(self).to have_text COLLECTION_DETAILS_PRODUCER_DESCR
    expect(self).to have_text COLLECTION_DETAILS_COLECTION_ADDRESS
    expect(self).to have_text COLLECTION_DETAILS_COLECTION_ADDRESS_DESCR
    expect(self).to have_text COLLECTION_DETAILS_POSTCODE
    expect(self).to have_text COLLECTION_DETAILS_POSTCODE_DESCR
    expect(self).to have_text COLLECTION_DETAILS_WASTE_SOURCE
    expect(self).to have_text COLLECTION_DETAILS_WASTE_SOURCE_DESCR
    expect(self).to have_text COLLECTION_DETAILS_BROKE_REG_NUM
    expect(self).to have_text COLLECTION_DETAILS_BROKE_REG_NUM_DESCR
    expect(self).to have_text COLLECTION_DETAILS_CARRIER_REG_NUM
    expect(self).to have_text COLLECTION_DETAILS_CARRIER_REG_NUM_DESCR
    expect(self).to have_text COLLECTION_DETAILS_TRANSPORT
    expect(self).to have_text COLLECTION_DETAILS_TRANSPORT_DESCR
    expect(self).to have_text ROAD
    expect(self).to have_text RAIL
    expect(self).to have_text SEA
    expect(self).to have_text AIR
    expect(self).to have_text INLAND_WATER
    expect(self).to have_text RECEIVER_HEADING
    expect(self).to have_text RECEIVER_DESCR
    expect(self).to have_text RECEIVER_CONTENT1_HEAD
    expect(self).to have_text RECEIVER_CONTENT1_DESCR
    expect(self).to have_text RECEIVER_CONTENT1_LINK
    expect(self).to have_text RECEIVER_CONTENT2_HEAD
    expect(self).to have_text RECEIVER_CONTENT2_DESCR
    expect(self).to have_text RECEIVER_CONTENT2_LINK
    expect(self).to have_text RECEIVER_CONTENT3_HEAD
    expect(self).to have_text RECEIVER_CONTENT3_DESCR
    expect(self).to have_text RECEIVER_CONTENT4_HEAD
    expect(self).to have_text RECEIVER_CONTENT4_DESCR
    expect(self).to have_text RECEIVER_CONTENT5_HEAD
    expect(self).to have_text RECEIVER_CONTENT5_DESCR
    expect(self).to have_text EWC_HEADING
    expect(self).to have_text EWC_CONTENT1
    expect(self).to have_text EWC_CONTENT1_LINK
    expect(self).to have_text EWC_CONTENT2
    expect(self).to have_text EWC_CONTENT3
    expect(self).to have_text EWC_CODES_HEADING
    expect(self).to have_text EWC_CODES_CONTENT
    expect(self).to have_text DESCR_WASTE_HEADING1
    expect(self).to have_text DESCR_WASTE_HEADING2
    expect(self).to have_text DESCR_WASTE_CONTENT1
    expect(self).to have_text DESCR_WASTE_CONTENT2
    expect(self).to have_text DESCR_WASTE_HEADING3
    expect(self).to have_text DESCR_WASTE_CONTENT3
    expect(self).to have_text GAS
    expect(self).to have_text LIQUID
    expect(self).to have_text POWDER
    expect(self).to have_text SLUDGE
    expect(self).to have_text MIXED
    expect(self).to have_text QUANTITY_HEADING
    expect(self).to have_text QUANTITY_DETAILS_HEADING
    expect(self).to have_text QUANTITY_DETAILS_ANSWER
    expect(self).to have_text QUANTITY
    expect(self).to have_text QUANTITY_DESCR
    expect(self).to have_text QUANTITY_UNITS
    expect(self).to have_text QUANTITY_UNITS_DESCR
    expect(self).to have_text QUANTITY_EST_ACT
    expect(self).to have_text QUANTITY_EST_ACT_DESCR
    expect(self).to have_text DESCR_WASTE_HEADING4
    expect(self).to have_text DESCR_WASTE_CONTENT4
    expect(self).to have_text DESCR_WASTE_CONTENT_LINK
    expect(self).to have_text DESCR_WASTE_HEADING5
    expect(self).to have_text DESCR_WASTE_CONTENT5
    expect(self).to have_text DESCR_WASTE_CONTENT_LINK2
    expect(self).to have_text DESCR_WASTE_CONTENT5_FINAL
  end

end
