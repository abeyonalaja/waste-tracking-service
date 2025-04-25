# frozen_string_literal: true

# this page is for Exporter details page details
class ExporterAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  POSTCODE_FIELD_ID = 'postcode'
  BUILDING_NAME_NUMBER = 'buildingNameOrNumber'
  TITLE = Translations.value 'exportJourney.exporterPostcode.title'
  BACK = Translations.value 'back'
  HINT_TEXT = Translations.value 'exportJourney.exporterPostcode.hint'
  POSTCODE_TEXT = Translations.value 'postcode.label'
  MANUAL_ENTRY_LINK = Translations.value 'postcode.manualAddressLink'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def enter_postcode(input_value)
    fill_in POSTCODE_FIELD_ID, with: input_value, visible: false
  end

  def enter_building_name(input_value)
    fill_in BUILDING_NAME_NUMBER, with: input_value, visible: false
  end

  def has_postcode?(postcode)
    find(POSTCODE_FIELD_ID).value == postcode
  end

  def has_address?(address)
    actual_address == address.gsub(/, /, ',')
  end

  def check_page_translation
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
    expect(self).to have_text HINT_TEXT
    expect(page).to have_text POSTCODE_TEXT
    expect(page).to have_link MANUAL_ENTRY_LINK, match: :prefer_exact
  end

  def check_postcode_translation
    expect(page).to have_link Translations.value 'postcode.enterManualy'
  end

  def find_address
    click_button Translations.value 'postcode.findButton'
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

  def choose_first_address
    TestStatus.set_test_status(:exporter_address, first(:css, "[type='radio']+span", visible: false).text)
    country, address = HelperMethods.address TestStatus.test_status(:exporter_address)
    TestStatus.set_test_status(:exporter_country, country)
    Log.info("Exporter address is: #{TestStatus.test_status(:exporter_address)}")
    first(:css, "[type='radio']", visible: false).click
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
