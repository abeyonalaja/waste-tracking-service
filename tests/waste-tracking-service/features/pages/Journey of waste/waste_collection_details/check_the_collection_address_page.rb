# frozen_string_literal: true

require_relative '../../shared_components/general_helpers'
require_relative '../../shared_components/error_box'
require_relative '../../shared_components/page_helper'
# this page is for Exporter details page details
class CheckTheCollectionAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.value 'exportJourney.wasteCollectionDetails.singleAddressTitle'
  COLLECTION_ADDRESS = Translations.value 'postcode.checkAddress.collectionAddress'
  CHANGE_LINK = Translations.value 'change'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text COLLECTION_ADDRESS
    expect(page).to have_link CHANGE_LINK
  end

  def has_address?(address)
    actual_address == address.gsub(/, /, ',')
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
