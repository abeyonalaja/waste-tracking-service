# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Quantity of waste page details
class QuantityOfSmallWastePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.quantity.small.title'
  HELP_TEXT = Translations.value 'exportJourney.quantity.intro'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translated
    expect(self).to have_text HELP_TEXT
  end

end
