# frozen_string_literal: true

# this page is for recovery facility contact page details
class RecoveryFacilityContactDetailsPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers


  TITLE = Translations.value 'exportJourney.recoveryFacilities.contactTitle'
  FACILITY_CONTACT_NAME = Translations.value 'exportJourney.recoveryFacilities.contactPerson'
  EMAIL_ADDRESS = Translations.value 'contact.emailAddress'
  PHONE_NUMBER = Translations.value 'contact.phoneNumber'
  FAX_NUMBER = Translations.value 'contact.faxNumber'
  CAPTION = Translations.value 'exportJourney.recoveryFacilities.caption'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text FACILITY_CONTACT_NAME
    expect(page).to have_text EMAIL_ADDRESS
    expect(page).to have_text PHONE_NUMBER
    expect(page).to have_text FAX_NUMBER
    expect(page).to have_text CAPTION
  end

  def has_recovery_code?(recovery_code)
    find('recoveryCode').value == recovery_code
  end

end
