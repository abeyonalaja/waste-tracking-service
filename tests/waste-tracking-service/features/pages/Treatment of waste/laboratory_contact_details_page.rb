# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
require_relative '../shared_components/common_components'

# this page is for recovery facility contact page details
class LaboratoryContactDetailsPage < GenericPage
  include ErrorBox
  include CommonComponents
  include GeneralHelpers

  TITLE = Translations.value 'exportJourney.laboratorySite.contactTitle'
  SUB_TEXT = Translations.value 'exportJourney.laboratorySite.caption'
  LAB_CONTACT = Translations.value 'exportJourney.laboratorySite.contactPerson'
  EMAIL_ADDRESS = Translations.value 'contact.emailAddress'
  PHONE_NUMBER = Translations.value 'contact.phoneNumber'
  FAX_NUMBER = Translations.value 'contact.faxNumber'
  CONTACT_HINT_TEXT = Translations.value 'contact.numberHint'
  NAME_HINT_TEXT = Translations.value 'contact.nameHint'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text LAB_CONTACT
    expect(self).to have_text EMAIL_ADDRESS
    expect(self).to have_text PHONE_NUMBER
    expect(self).to have_text FAX_NUMBER
    expect(self).to have_text CONTACT_HINT_TEXT
    expect(self).to have_text NAME_HINT_TEXT
  end


end
