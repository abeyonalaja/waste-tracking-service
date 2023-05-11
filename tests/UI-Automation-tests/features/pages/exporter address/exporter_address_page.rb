# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class ExporterAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  POSTCODE_FIELD_ID = 'postcode'

  def check_page_displayed
    expect(self).to have_css 'h1', text: "What's the exporter's address?", exact_text: true
  end

  def enter_input_value(input_value)
    fill_in POSTCODE_FIELD_ID, with: input_value, visible: false
  end

  def has_reference?(postcode)
    find(POSTCODE_FIELD_ID).value == postcode
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
    find(:css, '#selectedAddress>option:nth-child(2)', minimum: 1).select_option
  end
end
