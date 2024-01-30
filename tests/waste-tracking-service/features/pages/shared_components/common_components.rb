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

  ORG_NAME = Faker::Company.name
  NAME = Faker::Name.name
  EMAIL = Faker::Internet.email
  PHONE_NUMBER = '08123456789'
  FAX_NUMBER = '01234567890'
  INVALID_FAX = '0123456789'
  phone = '08001234567'
  COUNTRY = 'ENGLAND'
  NEW_COUNTRY = 'WALES'
  ADDRESS = '123abc, some street,town,city,United Kingdom, AB1 2CD'

  def enter_address(page)
    fill_in ADDRESS_FIELD_ID, with: ADDRESS, visible: false
    TestStatus.set_test_status("#{page}_address".to_sym, ADDRESS)
  end

  def enter_organisation_name(page)
    org_name = Faker::Company.name
    fill_in ORGANISATION_NAME_ID, with: org_name, visible: false
    TestStatus.set_test_status("#{page}_org_name".to_sym, org_name)
  end

  def enter_country(page)
    fill_in COUNTRY_FIELD_ID, with: COUNTRY, visible: false
    TestStatus.set_test_status("#{page}_country".to_sym, COUNTRY)
  end

  def update_country(page)
    fill_in COUNTRY_FIELD_ID, with: NEW_COUNTRY, visible: false
    TestStatus.set_test_status("#{page}_update__country".to_sym, NEW_COUNTRY)
  end

  def enter_name(page)
    name = Faker::Name.name
    fill_in NAME_FIELD_ID, with: name, visible: false
    TestStatus.set_test_status("#{page}_name".to_sym, name)
  end

  def enter_full_name(page)
    full_name = Faker::Name.name
    fill_in FULL_NAME_ID, with: full_name, visible: false
    TestStatus.set_test_status("#{page}_full_name".to_sym, full_name)
  end

  def enter_email(page)
    fill_in EMAIL_ID, with: EMAIL, visible: false
    TestStatus.set_test_status("#{page}_email".to_sym, EMAIL)
  end

  def enter_phone_number(page)
    fill_in PHONE_ID, with: PHONE_NUMBER, visible: false
    TestStatus.set_test_status("#{page}_phone_number".to_sym, PHONE_NUMBER)
  end

  def enter_fax_number(page)
    fill_in FAX_ID, with: FAX_NUMBER, visible: false
    TestStatus.set_test_status("#{page}_fax_number".to_sym, FAX_NUMBER)
  end

  def enter_invalid_fax_number
    fill_in FAX_ID, with: INVALID_FAX, visible: false
    TestStatus.set_test_status("#{page}_fax_number".to_sym, INVALID_FAX)
  end

  def enter_invalid_int_fax_number(int_fax)
    fill_in FAX_ID, with: int_fax, visible: false
    TestStatus.set_test_status("#{page}_fax_number".to_sym, int_fax)
  end
  def has_reference_organisation_name?(organisation_name)
    find(ORGANISATION_NAME_ID).value == organisation_name
  end

  def has_name?(name)
    find(NAME_FIELD_ID).value == name
  end

  def has_full_name?(full_name)
    find(FULL_NAME_ID).value == full_name
  end

  def has_address?(address)
    find(ADDRESS_FIELD_ID).text == address
  end

  def has_country?(country)
    find(COUNTRY_FIELD_ID).value == country
  end

  def has_email?(email)
    find(EMAIL_ID).value == email
  end

  def has_phone_number?(phone_number)
    find(PHONE_ID).value == phone_number
  end

  def has_fax?(fax)
    find(FAX_ID).value == fax
  end

  def application_ref
    find 'your-reference-0'
  end

  def export_date
    find 'date-0'
  end

  def transaction_number
    find 'transaction-id-0'
  end

  def waste_code
    find 'waste-code-0'
  end

  def transaction_id
    find 'transaction-id'
  end

  def success_title
    find('govuk-notification-banner-title')
  end

  def export_count
    all(:css, 'table > tbody >tr').count
  end


end
