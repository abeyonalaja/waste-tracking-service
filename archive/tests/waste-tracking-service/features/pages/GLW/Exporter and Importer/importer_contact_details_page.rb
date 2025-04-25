# frozen_string_literal: true

# this page is for importer contact details page details
class ImporterContactDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.importerDetails.secondPageQuestion'
  ORGANISATION_CONTACT_PERSON = Translations.value 'exportJourney.importerDetails.contactPerson'
  ORGANISATION_PERSON_HINT = Translations.value 'exportJourney.importerDetails.nameHint'
  EMAIL = Translations.value 'exportJourney.importerDetails.email'
  PHONE_NUMBER = Translations.value 'exportJourney.importerDetails.phone'
  PHONE_HINT_TEXT = Translations.value 'exportJourney.importerDetails.phoneHint'
  FAX_NUMBER = Translations.value 'exportJourney.importerDetails.fax'
  FAX_HINT_TEXT = Translations.value 'exportJourney.importerDetails.faxHint'

  ORGANISATION_CONTACT_FIELD_ID = 'fullName'
  EMAIL_FILED_ID = 'email'
  PHONE_NUMBER_FIELD_ID = 'phone'
  FAX_NUMBER_FIELD_ID = 'fax'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text ORGANISATION_CONTACT_PERSON
    expect(self).to have_text EMAIL
    expect(self).to have_text PHONE_NUMBER
    expect(self).to have_text FAX_NUMBER
  end

  def enter_organisation_contact(organisation_contact)
    fill_in ORGANISATION_CONTACT_FIELD_ID, with: organisation_contact, visible: false
    TestStatus.set_test_status(:organisation_contact, organisation_contact)
  end

  def enter_email(email)
    fill_in EMAIL_FILED_ID, with: email, visible: false
    TestStatus.set_test_status(:email, email)
  end

  def enter_phone_number(phone_number)
    fill_in PHONE_NUMBER_FIELD_ID, with: phone_number, visible: false
    TestStatus.set_test_status(:phone_number, phone_number)
  end

  def enter_fax_number(fax_number)
    fill_in FAX_NUMBER_FIELD_ID, with: fax_number, visible: false
    TestStatus.set_test_status(:fax_number, fax_number)
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
