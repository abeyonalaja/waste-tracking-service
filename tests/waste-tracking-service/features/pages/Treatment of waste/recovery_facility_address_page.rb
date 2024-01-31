# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for recovery facility page details
class RecoveryFacilityAddressPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers

  TITLE = Translations.value 'exportJourney.recoveryFacilities.addressTitle'
  FACILITY_NAME = Translations.value 'exportJourney.recoveryFacilities.name'
  ADDRESS = Translations.value 'address'
  COUNTRY = Translations.value 'address.country'
  CAPTION = Translations.value 'exportJourney.recoveryFacilities.caption'
  HINT_TEXT = Translations.value 'exportJourney.recoveryFacilities.countryHint'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text FACILITY_NAME
    expect(page).to have_text ADDRESS
    expect(page).to have_text COUNTRY
    expect(page).to have_text CAPTION
    expect(page).to have_text HINT_TEXT
  end

  def select_recovery_facility_country(recovery_country)
    index = rand(0..25)
    find('country', visible: false).click
    HelperMethods.wait_for_a_sec
    country = "country__option--#{index}"
    first('country', minimum: 1).click
    first(country, minimum: 1).select_option
    recovery_facility_country = find('country').value
    TestStatus.set_test_status("#{recovery_country}_country".to_sym, recovery_facility_country)
    TestStatus.set_test_status(:rec_country, recovery_facility_country)
  end
end
