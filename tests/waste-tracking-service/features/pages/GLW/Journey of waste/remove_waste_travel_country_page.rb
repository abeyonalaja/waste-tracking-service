# frozen_string_literal: true

# this page is for waste transit countries page
class RemoveWasteTravelCountryPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  REMOVE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_TITLE = Translations.value 'exportJourney.wasteTransitCountries.confirmRemoveTitle'
  REMOVE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_CAPTION = Translations.value 'exportJourney.wasteTransitCountries.caption'

  def check_page_displayed
    country = TestStatus.countries_list.join(' ')
    title = REMOVE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_TITLE.gsub('{{country}}', country)
    expect(self).to have_css 'h1', text: title, exact_text: true
  end

  def remove_countries_of_waste_translation
    expect(self).to have_text REMOVE_WASTE_TRAVEL_COUNTRIES_OF_WASTE_CAPTION
  end
end
