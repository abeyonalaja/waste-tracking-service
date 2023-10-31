# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for interim site address details
class InterimSiteAddressPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers


  TITLE = Translations.value 'exportJourney.interimSite.addressTitle'
  ADDRESS = Translations.value 'address'
  COUNTRY = Translations.value 'address.country'
  COUNTRY_FIELD_ID = 'country'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text TITLE
    expect(page).to have_text ADDRESS
    expect(page).to have_text COUNTRY
  end

  def select_interim_site_country
    index = rand(0..6)
    country = "country__option--#{index}"
    first('country', minimum: 1).click
    first(country, minimum: 1).select_option
    interim_site_country = find('country').value
    TestStatus.set_test_status(:interim_site_country, interim_site_country)
  end
end
