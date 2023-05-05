# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class NetSmallWeightPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.quantityValueSmall.Actual.title'
  SUB_TEXT = Translations.value 'exportJourney.quantityValueSmall.intro'
  WEIGHT_IN_KG = Translations.value 'exportJourney.quantityValueSmall.weightLabel'
  HELPER_TEXT = Translations.value 'exportJourney.quantityValue.inputHint'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text WEIGHT_IN_KG
    expect(self).to have_text HELPER_TEXT
  end
end
