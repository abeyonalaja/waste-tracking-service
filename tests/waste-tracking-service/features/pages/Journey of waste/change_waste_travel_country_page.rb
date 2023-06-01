# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/page_helper'
# this page is for waste transit countries page
class ChangeWasteTravelCountryPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  CHANGE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_TITLE = Translations.value 'exportJourney.wasteTransitCountries.changeCountryTitle'
  CHANGE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_HEADER = Translations.value 'exportJourney.wasteTransitCountries.additionalCountryLabel'
  CHANGE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_LABEL = Translations.value 'exportJourney.wasteTransitCountries.additionalCountryHint'
  CHANGE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_CAPTION = Translations.value 'exportJourney.wasteTransitCountries.caption'

  def check_page_displayed
    country = TestStatus.countries_list.join(' ')
    title = CHANGE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_TITLE.gsub('{{country}}', country)
    expect(self).to have_css 'h1', text: title, exact_text: true
  end

  def change_countries_of_waste_translation
    expect(self).to have_text CHANGE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_HEADER
    expect(self).to have_text CHANGE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_LABEL
    expect(self).to have_text CHANGE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_CAPTION
  end
end
