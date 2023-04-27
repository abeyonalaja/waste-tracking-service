# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Quantity of waste page details
class QuantityOfWastePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'testing'
  ACTUAL_AMOUNT_OPTION = Translations.value ''
  ESTIMATE_AMOUNT_OPTION = Translations.value ''
  DO_NOT_THE_AMOUNT_OPTION = Translations.value ''
  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def quantity_of_weight(option)
    find(quantity_options.fetch(option), visible: all)
  end

  def quantity_options
    {
      'Yes, I know the actual amount' => '',
      'No, I will enter an estimate' => '',
      'No, I do not know the amount yet' => ''
    }
  end
end
