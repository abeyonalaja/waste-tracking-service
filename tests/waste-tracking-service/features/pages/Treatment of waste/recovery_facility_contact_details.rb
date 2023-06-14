# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for recovery facility contact page details
class RecoveryFacilityContactDetailsPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers


  TITLE = Translations.value 'exportJourney.recoveryFacilities.contactTitle'
  FACILITY_CONTACT_NAME = Translations.value 'exportJourney.recoveryFacilities.contactPerson'
  EMAIL_ADDRESS = Translations.value 'exportJourney.exporterDetails.email'
  PHONE_NUMBER = Translations.value 'exportJourney.exporterDetails.phone'
  CAPTION = Translations.value 'exportJourney.recoveryFacilities.caption'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text FACILITY_CONTACT_NAME
    expect(page).to have_text EMAIL_ADDRESS
    expect(page).to have_text PHONE_NUMBER
    expect(page).to have_text CAPTION
  end

end
