# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/page_helper'
# this page is for waste transit countries page
class WasteTransitCountriesPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  WASTE_TRANSIT_COUNTRIES_OF_WASTE_TITLE = Translations.value 'exportJourney.wasteTransitCountries.listTitle'
  WASTE_TRANSIT_COUNTRIES_OF_WASTE_HEADER = Translations.value 'exportJourney.wasteTransitCountries.additionalCountryLegend'
  WASTE_TRANSIT_COUNTRIES_OF_WASTE_LABEL = Translations.value 'exportJourney.wasteTransitCountries.additionalCountryHint'

  def check_page_displayed
    expect(self).to have_css 'h1', text: WASTE_TRANSIT_COUNTRIES_OF_WASTE_TITLE, exact_text: true
  end

  def waste_transit_countries_title_translation
    expect(self).to have_text WASTE_TRANSIT_COUNTRIES_OF_WASTE_HEADER
    expect(self).to have_text WASTE_TRANSIT_COUNTRIES_OF_WASTE_LABEL
  end

end
