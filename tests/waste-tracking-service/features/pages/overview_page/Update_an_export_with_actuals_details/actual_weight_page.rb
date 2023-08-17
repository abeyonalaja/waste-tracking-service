# frozen_string_literal: true

# this page is for overview page details
class ActualWeightPage < GenericPage
  include CommonComponents

  TITLE = 'What is the actual weight of the waste?'
  SUB_TEXT = Translations.value 'exportJourney.quantityValue.intro'
  WEIGHT_IN_KG = ''
  HELPER_TEXT = Translations.value 'exportJourney.quantityValue.inputHint'
  WEIGHT_IN_TONNES = Translations.value 'exportJourney.quantityValue.weightLabel'
  WEIGHT_IN_CUBIC_METERS = Translations.value 'exportJourney.quantityValue.volumeLabel'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text WEIGHT_IN_TONNES
    expect(self).to have_text WEIGHT_IN_CUBIC_METERS
    expect(self).to have_text HELPER_TEXT
  end

end
