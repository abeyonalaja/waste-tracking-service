# frozen_string_literal: true

# common components across the submit export
module CommonComponents
  ADDRESS_FIELD_ID = 'address'
  COUNTRY_FIELD_ID = 'country'
  NAME_FIELD_ID = 'name'
  ORGANISATION_NAME_ID = 'organisationName'
  FULL_NAME_ID = 'fullName'
  EMAIL_ID = 'emailAddress'
  PHONE_ID = 'phoneNumber'
  FAX_ID = 'faxNumber'

  org_name = Faker::Company.name
  NAME = Faker::Name.name
  EMAIL = Faker::Internet.email
  PHONE_NUMBER = '08123456789'
  FAX_NUMBER = '01234567890'
  phone = '08001234567'
  COUNTRY = 'ENGLAND'
  ADDRESS = '123abc, some street,town,city,United Kingdom, AB1 2CD'

  def enter_address(page)
    fill_in ADDRESS_FIELD_ID, with: ADDRESS, visible: false
    TestStatus.set_test_status("#{page.to_sym}_address", ADDRESS)
  end

  def enter_country(page)
    fill_in COUNTRY_FIELD_ID, with: COUNTRY, visible: false
    TestStatus.set_test_status("#{page.to_sym}_country", COUNTRY)
  end

  def enter_name(page)
    fill_in NAME_FIELD_ID, with: NAME, visible: false
    TestStatus.set_test_status("#{page.to_sym}_name", NAME)
  end

  def enter_full_name(page)
    fill_in FULL_NAME_ID, with: NAME, visible: false
    TestStatus.set_test_status("#{page.to_sym}_full_name", NAME)
  end

  def enter_email(page)
    fill_in EMAIL_ID, with: EMAIL, visible: false
    TestStatus.set_test_status("#{page.to_sym}_email", EMAIL)
  end

  def enter_phone_number(page)
    fill_in PHONE_ID, with: PHONE_NUMBER, visible: false
    TestStatus.set_test_status("#{page.to_sym}_phone_number", PHONE_NUMBER)
  end

  def enter_fax_number(page)
    fill_in FAX_ID, with: FAX_NUMBER, visible: false
    TestStatus.set_test_status("#{page.to_sym}_fax_number", FAX_NUMBER)
  end
end
