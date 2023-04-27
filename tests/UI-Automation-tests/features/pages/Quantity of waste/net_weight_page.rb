# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class NetWeightPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value ''
  SUB_TEXT = ''
  WEIGHT_IN_KG = ''
  HELPER_TEXT = ''
  WEIGHT_IN_TONNES = ''
  WEIGHT_IN_CUBIC_METERS = ''

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT, exact_text: true
    expect(self).to have_text WEIGHT_IN_KG, exact_text: true
    expect(self).to have_text HELPER_TEXT, exact_text: true
  end

  def enter_weight_in_tonnes(weight)
    fill_in WEIGHT_IN_TONNES, with: weight, visible: false
  end

  def enter_weight_in_cubic_meters(weight)
    fill_in WEIGHT_IN_CUBIC_METERS, with: weight, visible: false
  end

end
