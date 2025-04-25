# frozen_string_literal: true

# this page is for Exporter details page details
class EstimateSmallWeightPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.quantityValueSmall.Estimate.title'
  SUB_TEXT = Translations.value 'exportJourney.quantityValueSmall.Estimate.intro'
  WEIGHT_IN_KG = Translations.value 'exportJourney.quantityValueSmall.weightLabelEstimate'
  HELPER_TEXT = Translations.value 'exportJourney.quantityValue.inputHint'
  CAPTION = Translations.value 'exportJourney.quantity.caption'
  ESTIMATED_WARNING_TEXT = Translations.value 'exportJourney.quantity.entry.bulk.warning'
  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text WEIGHT_IN_KG
    expect(self).to have_text HELPER_TEXT
    expect(self).to have_text CAPTION
    expect(self).to have_text ESTIMATED_WARNING_TEXT
  end
end
