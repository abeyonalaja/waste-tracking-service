# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class NetWeightPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  TITLE = Translations.value 'exportJourney.quantityValue.Actual.title'
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

  def enter_weight_in_tonnes(weight)
    fill_in 'valueWeight', with: weight, visible: false
  end

  def enter_weight_in_cubic_meters(weight)
    fill_in 'valueVolume', with: weight, visible: false
  end

  def enter_weight_in_kilograms(weight)
    fill_in 'valueWeight', with: weight, visible: false
  end

end
