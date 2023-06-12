# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class ExporterAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  POSTCODE_FIELD_ID = 'postcode'
  TITLE = Translations.value 'exportJourney.exporterPostcode.title'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def enter_postcode(input_value)
    fill_in POSTCODE_FIELD_ID, with: input_value, visible: false
  end

  def has_postcode?(postocde)
    find(POSTCODE_FIELD_ID).value == postocde
  end

  def has_address?(address)
    actual_address == address.gsub(/, /, ',')
  end

  def check_page_translation
    title = Translations.value 'exportJourney.exporterPostcode.title'
    hint_text = Translations.value 'exportJourney.exporterPostcode.hint'
    postcode_text = Translations.value 'postcode.label'
    manual_entry_link = Translations.value 'postcode.manualAddressLink'
    expect(self).to have_css 'h1', text: title, exact_text: true
    expect(self).to have_text hint_text
    expect(page).to have_text postcode_text
    expect(page).to have_link manual_entry_link, match: :prefer_exact
  end

  def check_postcode_translation
    select_an_address = Translations.value 'postcode.selectLabel'
    expect(page).to have_text select_an_address
    expect(page).to have_link 'Change', match: :prefer_exact
  end

  def select_first_address
    first('selectedAddress', minimum: 1)
    find(:css, '#selectedAddress>option:nth-child(2)').select_option
    TestStatus.set_test_status(:exporter_address, find(:css, '#selectedAddress>option:nth-child(2)').text)
    Log.info("Exporter address is: #{TestStatus.test_status(:exporter_address)}")
  end

  def find_address
    click_on Translations.value 'postcode.findButton'
  end

  def enter_address_manually
    click_on Translations.value 'postcode.manualAddressLink'
  end

  def address_line_1(address__1)
    fill_in 'address', with: '', visible: false
    fill_in 'address', with: address__1, visible: false
  end

  def address_line_2(address_2)
    fill_in 'address2', with: '', visible: false
    fill_in 'address2', with: address_2, visible: false
  end

  def town_city(town)
    fill_in 'townCity', with: '', visible: false
    fill_in 'townCity', with: town, visible: false
  end

  def exporter_postcode(postcode)
    fill_in 'postcode', with: '', visible: false
    fill_in 'postcode', with: postcode, visible: false
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
