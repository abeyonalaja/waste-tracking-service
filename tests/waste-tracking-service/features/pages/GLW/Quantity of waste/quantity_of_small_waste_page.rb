# frozen_string_literal: true

# this page is for Quantity of waste page details
class QuantityOfSmallWastePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.value 'exportJourney.quantity.small.title'
  HELP_TEXT = Translations.value 'exportJourney.quantity.intro'
  CAPTION = Translations.value 'exportJourney.quantity.caption'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translated
    expect(self).to have_text HELP_TEXT
    expect(self).to have_text CAPTION
  end

end
