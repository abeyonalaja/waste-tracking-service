# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class ExporterAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  def check_page_displayed
    expect(self).to have_css 'h1', text: "What's the exporter's address?", exact_text: true
  end

  def check_page_translation
    title = Translations.value 'exportJourney.exporterPostcode.title'
    hint_text = Translations.value 'exportJourney.exporterPostcode.hint'
    postcode_text = Translations.value 'exportJourney.exporterPostcode.postCodeLabel'
    manual_entry_link = Translations.value 'exportJourney.exporterPostcode.manualAddressLink'
    expect(self).to have_css 'h1', text: title, exact_text: true
    expect(self).to have_text hint_text
    expect(page).to have_text postcode_text
    expect(page).to have_link manual_entry_link, match: :prefer_exact
  end
end
