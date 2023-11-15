# frozen_string_literal: true

require_relative '../../shared_components/general_helpers'
require_relative '../../shared_components/error_box'
# this page is for What are the waste carriers contact details page details
class WasteCollectionAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  WASTE_COLLECTION_DETAILS_TITLE = Translations.value 'exportJourney.wasteCollectionDetails.postcodeTitle'
  WASTE_COLLECTION_DETAILS_INTRO = Translations.value 'exportJourney.wasteCollectionDetails.intro'
  WASTE_COLLECTION_DETAILS_POSTCODE_LABEL = Translations.value 'postcode.label'
  WASTE_COLLECTION_BUILDING_LABEL = Translations.value 'buildingNameNumber.label'
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

  def choose_first_address
    TestStatus.set_test_status(:waste_collection_address, first(:css, "[type='radio']+span", visible: false).text)
    Log.info("waste collection address is: #{TestStatus.test_status(:waste_collection_address)}")
    first(:css, "[type='radio']", visible: false).click
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

  def check_postcode_translation
    expect(page).to have_link Translations.value 'postcode.manualAddressLink'
  end
end
