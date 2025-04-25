# frozen_string_literal: true

# this page is for enter producer address manual page
class EnterReceiverAddressManualPage < GenericPage
  include CommonComponents
  include PageHelper
  include ErrorBox

  TITLE = Translations.ukmv_value 'single.receiverAddress.postcode.search.heading'
  CAPTION = Translations.ukmv_value 'single.receiverAddress.caption'
  BUILDING_NAME_FIELD_ID = Translations.ukmv_value 'single.postcode.buildingName.label'
  BUILDING_NAME_HINT = Translations.ukmv_value 'single.postcode.buildingName.hint'
  ADDRESS_1_FIELD_ID = Translations.ukmv_value 'single.postcode.addressLine1.label'
  ADDRESS_1_NAME_HINT = Translations.ukmv_value 'single.postcode.addressLine1.hint'
  ADDRESS_2_FIELD_ID = Translations.ukmv_value 'single.postcode.addressLine2.label'
  ADDRESS_2_NAME_HINT = Translations.ukmv_value 'single.postcode.addressLine2.hint'
  TOWN_CITY_FIELD_ID = Translations.ukmv_value 'single.postcode.townCity.label'
  COUNTRY_FIELD_ID = Translations.ukmv_value 'single.postcode.country.label'
  POSTCODE_MANUAL_FIELD_ID = Translations.ukmv_value 'single.postcode.postcodeManual.label'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text BUILDING_NAME_FIELD_ID
    expect(self).to have_text BUILDING_NAME_HINT
    expect(self).to have_text ADDRESS_2_FIELD_ID
    expect(self).to have_text ADDRESS_2_NAME_HINT
    expect(self).to have_text TOWN_CITY_FIELD_ID
    expect(self).to have_text COUNTRY_FIELD_ID
    expect(self).to have_text POSTCODE_MANUAL_FIELD_ID
  end

  def enter_town(town)
    fill_in POSTCODE_FIELD_ID, with: town, visible: false
  end

  def enter_address(address)
    fill_in POSTCODE_FIELD_ID, with: address, visible: false
  end

  def select_first_country_option
    find(COUNTRY_BUTTON_ID, visible: false).click
  end
end
