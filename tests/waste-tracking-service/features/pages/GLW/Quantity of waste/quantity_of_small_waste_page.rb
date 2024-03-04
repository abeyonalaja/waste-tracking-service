# frozen_string_literal: true

# this page is for Quantity of waste page details
class QuantityOfSmallWastePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.value 'exportJourney.quantity.bulk.title'
  HELP_TEXT = Translations.value 'exportJourney.quantity.bulk.intro'
  ACTUAL_WEIGHT = Translations.value 'exportJourney.quantity.small.actualWeight'
  ESTIMATED_WEIGHT = Translations.value 'exportJourney.quantity.small.estimateWeight'
  NO_WEIGHT= Translations.value 'exportJourney.quantity.dontKnow'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translated
    expect(self).to have_text HELP_TEXT
    expect(self).to have_text ACTUAL_WEIGHT
    expect(self).to have_text ESTIMATED_WEIGHT
    expect(self).to have_text NO_WEIGHT
  end

end
