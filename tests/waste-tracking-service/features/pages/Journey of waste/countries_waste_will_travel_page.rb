# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/page_helper'
# this page is for Exporter details page details
class CountriesWasteWillTravelPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  OTHER_COUNTRIES_OF_WASTE_TITLE = Translations.value 'exportJourney.wasteTransitCountries.title'
  OTHER_COUNTRIES_OF_WASTE_HEADER = Translations.value 'exportJourney.submitAnExport.SectionThree.countriesWasteWillTravel'
  OTHER_COUNTRIES_OF_WASTE_LABEL = Translations.value 'autocompleteHint'
  OTHER_COUNTRIES_OF_WASTE_HINT = Translations.value 'exportJourney.wasteTransitCountries.hint'

  def check_page_displayed
    expect(self).to have_css 'h1', text: OTHER_COUNTRIES_OF_WASTE_TITLE, exact_text: true
  end

  def other_countries_of_waste_translation
    expect(self).to have_text OTHER_COUNTRIES_OF_WASTE_HEADER
    expect(self).to have_text OTHER_COUNTRIES_OF_WASTE_LABEL
    expect(self).to have_text OTHER_COUNTRIES_OF_WASTE_HINT
  end

  def select_country_of_waste
    index = rand(0..250)
    country = "country__option--#{index}"
    first('country', minimum: 1).click
    first(country, minimum: 1).select_option
    country_waste_travel = find('country').value
    TestStatus.countries_waste_will_travel(country_waste_travel)
    Log.info("Country of waste is #{country_waste_travel}")
  end

  def option_checked?(selected_option)
    find(yes_or_no.fetch(selected_option), visible: false).checked?
  end

  def yes_or_no
    {
      'Yes' => 'hasTransitCountriesYes',
      'No' => 'hasTransitCountriesNo'
    }
  end
end
