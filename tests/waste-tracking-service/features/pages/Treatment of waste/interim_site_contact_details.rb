# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for interim contact page details
class InterimSiteContactDetailsPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers

  TITLE = Translations.value 'exportJourney.interimSite.contactTitle'
  FACILITY_CONTACT_NAME = Translations.value 'exportJourney.interimSite.contactPerson'
  FULL_NAME = Translations.value 'contact.nameHint'
  EMAIL = Translations.value 'contact.emailAddress'
  PHONE_NUMBER = Translations.value 'contact.phoneNumber'
  PHONE_HINT = Translations.value 'contact.numberHint'
  FAX = Translations.value 'contact.faxNumber'
  FAX_HINT = Translations.value 'contact.numberHint'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(page).to have_text TITLE
    expect(page).to have_text FACILITY_CONTACT_NAME
    expect(page).to have_text FULL_NAME
    expect(page).to have_text EMAIL
    expect(page).to have_text PHONE_NUMBER
    expect(page).to have_text PHONE_HINT
    expect(page).to have_text FAX
    expect(page).to have_text FAX_HINT
  end
end
