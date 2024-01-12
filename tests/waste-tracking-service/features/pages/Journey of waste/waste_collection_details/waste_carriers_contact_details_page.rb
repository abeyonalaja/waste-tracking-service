# frozen_string_literal: true

require_relative '../../shared_components/general_helpers'
require_relative '../../shared_components/error_box'
# this page is for What are the waste carriers contact details page details
class WhatAreTheWasteCarriersContactDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.wasteCarrierDetails.secondPageQuestion'
  FIRST_TITLE = Translations.value 'exportJourney.wasteCarrierDetails.secondPageQuestion1'
  SECOND_TITLE = Translations.value 'exportJourney.wasteCarrierDetails.secondPageQuestion2'
  THIRD_TITLE = Translations.value 'exportJourney.wasteCarrierDetails.secondPageQuestion3'
  FOURTH_TITLE = Translations.value 'exportJourney.wasteCarrierDetails.secondPageQuestion4'
  FIFTH_TITLE = Translations.value 'exportJourney.wasteCarrierDetails.secondPageQuestion5'
  SUB_TEXT = Translations.value 'exportJourney.wasteCarrierDetails.title'
  ORGANISATION_CONTACT = Translations.value 'exportJourney.wasteCarrierDetails.contactPerson'
  FULL_NAME = Translations.value 'exportJourney.wasteCarrierDetails.nameHint'
  EMAIL = Translations.value 'exportJourney.wasteCarrierDetails.email'
  PHONE_NUMBER = Translations.value 'exportJourney.wasteCarrierDetails.phone'
  PHONE_HINT = Translations.value 'contact.numberHint'
  FAX_NUMBER = Translations.value 'exportJourney.wasteCarrierDetails.fax'
  FAX_HINT = Translations.value 'contact.numberHint'

  ORGANISATION_CONTACT_FIELD_ID = 'fullName'
  EMAIL_FILED_ID = 'emailAddress'
  PHONE_NUMBER_FIELD_ID = 'phoneNumber'
  FAX_NUMBER_FIELD_ID = 'faxNumber'

  def check_page_displayed
    expect(self).to have_css 'h1', text: FIRST_TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text ORGANISATION_CONTACT
    expect(self).to have_text FULL_NAME
    expect(self).to have_text EMAIL
    expect(self).to have_text PHONE_NUMBER
    expect(self).to have_text PHONE_HINT
    expect(self).to have_text FAX_NUMBER
    expect(self).to have_text FAX_HINT
  end

  def check_page_title(title)
    case title
    when 'First', '1'
      expect(self).to have_css 'h1', text: FIRST_TITLE, exact_text: true
    when 'Second', '2'
      expect(self).to have_css 'h1', text: SECOND_TITLE, exact_text: true
    when 'Third', '3'
      expect(self).to have_css 'h1', text: THIRD_TITLE, exact_text: true
    when 'Fourth', '4'
      expect(self).to have_css 'h1', text: FOURTH_TITLE, exact_text: true
    when 'Fifth', '5'
      expect(self).to have_css 'h1', text: FIFTH_TITLE, exact_text: true
    end
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
