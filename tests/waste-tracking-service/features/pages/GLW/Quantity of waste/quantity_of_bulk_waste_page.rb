# frozen_string_literal: true

# this page is for Quantity of waste page details
class QuantityOfBulkWastePage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.value 'exportJourney.quantity.title'
  HELP_TEXT = Translations.value 'exportJourney.quantity.bulk.intro'
  ACTUAL_TONNES = Translations.value 'exportJourney.quantity.bulk.actualWeight'
  ESTIMATED_TONNES = Translations.value 'exportJourney.quantity.bulk.estimateWeight'
  ESTIMATED_METRES = Translations.value 'exportJourney.quantity.bulk.estimateVolume'
  ACTUAL_METRES = Translations.value 'exportJourney.quantity.bulk.actualVolume'
  DONT_KNOW_OPTION = Translations.value 'exportJourney.quantity.dontKnow'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translated
    expect(self).to have_text HELP_TEXT
    expect(self).to have_text ACTUAL_TONNES
    expect(self).to have_text ESTIMATED_TONNES
    expect(self).to have_text ESTIMATED_METRES
    expect(self).to have_text ACTUAL_METRES
    expect(self).to have_text DONT_KNOW_OPTION
  end

  def quantity_of_weight(option)
    find(quantity_options.fetch(option), visible: all)
  end

  def has_quantity?(option, value)
    find(quantity_options.fetch(option)).value == value
  end

  def quantity_options
    {
      'Actual weight (tonnes)' => 'quantityTypeYes',
      'Estimated weight (tonnes)' => 'quantityTypeEstimate',
      'Actual volume (m³)' => 'quantityTypeVolumeYes',
      'Estimated volume (m³)' => 'quantityTypeVolumeEstimate',
      'Actual weight (kilograms)' => 'quantityTypeYes',
      'Estimated weight (kilograms)' => 'quantityTypeEstimate',
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
