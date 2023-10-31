# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for What are the waste carriers contact details page details
class WasteCollectionDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox


  WASTE_COLLECTION_DETAILS_TITLE = Translations.value 'exportJourney.wasteCollectionDetails.postcodeTitle'
  WASTE_COLLECTION_DETAILS_INTRO = Translations.value 'exportJourney.wasteCollectionDetails.intro'
  WASTE_COLLECTION_DETAILS_POSTCODE_LABEL = Translations.value 'postcode.label'
  CAPTION = Translations.value 'exportJourney.wasteCollectionDetails.caption'

  COUNTRIES_LIST = '#waste-transit-country-list > div > dt'
  POSTCODE_FIELD_ID = 'postcode'

  def check_page_displayed
    expect(self).to have_css 'h1', text: WASTE_COLLECTION_DETAILS_TITLE, exact_text: true
  end

  def enter_postcode(postcode)
    fill_in POSTCODE_FIELD_ID, with: postcode, visible: false
  end

  def check_translation
    expect(self).to have_text WASTE_COLLECTION_DETAILS_INTRO
    expect(self).to have_text WASTE_COLLECTION_DETAILS_POSTCODE_LABEL
    expect(self).to have_text CAPTION
  end

  def select_first_address
    first('selectedAddress', minimum: 1)
    find(:css, '#selectedAddress>option:nth-child(2)').select_option
    TestStatus.set_test_status(:waste_collection_address, find(:css, '#selectedAddress>option:nth-child(2)').text)
    Log.info("Waste collection address is: #{TestStatus.test_status(:waste_collection_address)}")
  end

  def has_address?(address)
    actual_address == address.gsub(/, /, ',')
  end

  def has_postcode?(postcode)
    find(POSTCODE_FIELD_ID).value == postcode
  end

  def actual_address
    address_line_1 = find('address-addressLine1').text
    address_line_2 = find('address-addressLine2').text
    town = find('address-townCity').text
    postcode = find('address-postcode').text
    country = find('address-country').text
    "#{address_line_1},#{address_line_2},#{town},#{postcode},#{country}"
  end
end
