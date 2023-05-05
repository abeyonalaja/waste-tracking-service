# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Quantity of waste page details
class QuantityOfWastePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.quantity.title'
  ACTUAL_AMOUNT_OPTION = Translations.value ''
  ESTIMATE_AMOUNT_OPTION = Translations.value ''
  DO_NOT_THE_AMOUNT_OPTION = Translations.value ''

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def quantity_of_weight(option)
    find(quantity_options.fetch(option), visible: all)
  end

  def has_quantity?(option, value)
    find(quantity_options.fetch(option)).value == value
  end

  def quantity_options
    {
      'Yes, I know the actual amount' => 'quantityTypeYes',
      'No, I will enter an estimate' => 'quantityTypeEstimate',
      'No, I do not know the amount yet' => 'quantityTypeNo'
    }
  end

  def weight_in_tonnes
    find('valueWeight').value
  end

  def weight_in_cubic_meters
    find('valueVolume').value
  end

  def weight_in_kilograms
    find('valueWeight').value
  end
end
