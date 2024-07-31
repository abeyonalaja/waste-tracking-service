# frozen_string_literal: true

# this page is for enter producer address manual page
class EnterProducerAddressManualPage < GenericPage

  TITLE = Translations.ukmv_value ''
  ADDRESS1_FIELD_ID = ''
  TOWN_FIELD_ID = ''
  COUNTRY_BUTTON_ID = ''


  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation

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
