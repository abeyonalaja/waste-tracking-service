# frozen_string_literal: true

# this page is for contact details for collection address page details
class ContactDetailsCollectionAddressPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'exportJourney.wasteCollectionDetails.contactTitle'

  ORGANISATION_NAME_ID = 'organisationName'
  FULL_NAME_ID = 'fullName'
  EMAIL_ID = 'emailAddress'
  PHONE_ID = 'phoneNumber'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def enter_organisation_name(organisation_name)
    fill_in ORGANISATION_NAME_ID, with: organisation_name, visible: false
    TestStatus.set_test_status(:waste_contact_organisation_name, organisation_name)
  end

  def enter_full_name(full_name)
    fill_in FULL_NAME_ID, with: full_name, visible: false
    TestStatus.set_test_status(:waste_contact_full_name, full_name)
  end

  def enter_email(email)
    fill_in EMAIL_ID, with: email, visible: false
    TestStatus.set_test_status(:waste_contact_email, email)
  end

  def enter_phone_number(phone_number)
    fill_in PHONE_ID, with: phone_number, visible: false
    TestStatus.set_test_status(:waste_contact_phone_number, phone_number)
  end

  def has_reference_organisation_name?(organisation_name)
    find(ORGANISATION_NAME_ID).value == organisation_name
  end

  def has_reference_full_name?(full_name)
    find(FULL_NAME_ID).value == full_name
  end

  def has_reference_email?(email)
    find(EMAIL_ID).value == email
  end

  def has_reference_phone_number?(phone_number)
    find(PHONE_ID).value == phone_number
  end

end
