# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class WasteCarrierTransportPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value ''
  SUB_TEXT = Translations.value ''
  ACTUAL_DATE = Translations.value ''
  ESTIMATE_DATE = Translations.value ''

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
  end


end
