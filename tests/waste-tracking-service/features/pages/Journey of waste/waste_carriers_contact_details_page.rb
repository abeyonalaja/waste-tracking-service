# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for What are the waste carriers contact details page details
class WhatAreTheWasteCarriersContactDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.wasteCarrierDetails.secondPageQuestion'
  COPY_TEXT = Translations.value 'exportJourney.wasteCarrierDetails.YouCanEditMessage'
  SUB_TEXT = Translations.value 'exportJourney.wasteCarrierDetails.title'
  ORGANISATION_CONTACT = Translations.value 'exportJourney.wasteCarrierDetails.contactPerson'
  FULL_NAME = Translations.value 'exportJourney.wasteCarrierDetails.nameHint'
  EMAIL = Translations.value 'exportJourney.wasteCarrierDetails.email'
  PHONE_NUMBER = Translations.value 'exportJourney.wasteCarrierDetails.phone'
  PHONE_HINT = Translations.value 'contact.numberHint'
  FAX_NUMBER = Translations.value 'exportJourney.wasteCarrierDetails.fax'
  FAX_HINT = Translations.value 'contact.numberHint'

  ORGANISATION_CONTACT_FIELD_ID = 'fullName'
  EMAIL_FILED_ID = 'email'
  PHONE_NUMBER_FIELD_ID = 'phone'
  FAX_NUMBER_FIELD_ID = 'fax'

  def check_page_displayed
    # expect(self).to have_css 'h1', text: TITLE, exact_text: true
    expect(self).to have_css 'h1', text: "What are the waste carrier's contact details?", exact_text: true
  end

  def check_translation
    expect(self).to have_text COPY_TEXT
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text ORGANISATION_CONTACT
    expect(self).to have_text FULL_NAME
    expect(self).to have_text EMAIL
    expect(self).to have_text PHONE_NUMBER
    expect(self).to have_text PHONE_HINT
    expect(self).to have_text FAX_NUMBER
    expect(self).to have_text FAX_HINT
  end

  def enter_organisation_contact(organisation_contact)
    fill_in ORGANISATION_CONTACT_FIELD_ID, with: organisation_contact, visible: false
    TestStatus.set_test_status(:organisation_contact, organisation_contact)
  end

  def enter_email(email)
    fill_in EMAIL_FILED_ID, with: email, visible: false
    TestStatus.set_test_status(:email, email)
  end

  def enter_fax_number(fax_number)
    fill_in FAX_NUMBER_FIELD_ID, with: fax_number, visible: false
    TestStatus.set_test_status(:fax_number, fax_number)
  end

  def enter_phone_number(phone_number)
    fill_in PHONE_NUMBER_FIELD_ID, with: phone_number, visible: false
    TestStatus.set_test_status(:phone_number, phone_number)
  end

  def has_reference_organisation_contact?(organisation_contact)
    find(ORGANISATION_CONTACT_FIELD_ID).value == organisation_contact
  end

  def has_reference_email?(email)
    find(EMAIL_FILED_ID).value == email
  end

  def has_reference_phone_number?(phone_number)
    find(PHONE_NUMBER_FIELD_ID).value == phone_number
  end

  def has_reference_fax_number?(fax_number)
    find(FAX_NUMBER_FIELD_ID).value == fax_number
  end
end
