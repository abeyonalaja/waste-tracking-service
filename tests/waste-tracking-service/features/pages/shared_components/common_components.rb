# frozen_string_literal: true

# common components across the submit export
module CommonComponents
  BUILDING_NAME_OR_NUMBER = 'buildingNameOrNumber'
  ADDRESS_LINE_1 = 'addressLine1'
  ADDRESS_LINE_2 = 'addressLine2'
  ADDRESS_LINE_TOWN_CITY = 'townCity'
  ADDRESS_LINE_POSTCODE = 'postcode'

  ADDRESS_FIELD_ID = 'address'
  COUNTRY_FIELD_ID = 'country'
  NAME_FIELD_ID = 'name'
  ORGANISATION_NAME_ID = 'organisationName'
  FULL_NAME_ID = 'fullName'
  EMAIL_ID = 'emailAddress'
  PHONE_ID = 'phoneNumber'
  FAX_ID = 'faxNumber'

  ORG_NAME = Faker::Company.name.gsub(/\W/, '')
  NAME = Faker::Name.name
  EMAIL = Faker::Internet.email
  PHONE_NUMBER = '+359-89 88-1(434)55 5'
  INVALID_PHONE_NUMBER = '+359-89 88-1(434)55 51'
  FAX_NUMBER = '+1-907-555-12(34) 123'
  INVALID_FAX = '+4412 345 6789(12-34)123'
  COUNTRY = 'ENGLAND'
  NEW_COUNTRY = 'WALES'
  ADDRESS = '123abc, some street,town,city,United Kingdom, AB1 2CD'
  BUILDING_NAME_NUMBER = Faker::Address.street_address
  ADDRESS_1 = Faker::Address.street_name
  ADDRESS_2 = Faker::Address.secondary_address
  TOWN_CITY = Faker::Address.city
  UK_POSTCODE = 'SW1P 4DF'

  def enter_building_name_number(page, input = BUILDING_NAME_NUMBER)
    fill_in BUILDING_NAME_OR_NUMBER, with: input, visible: false
    TestStatus.set_test_status("#{page}_building_name_number".to_sym, input)
  end

  def enter_address_1(page, input = ADDRESS_1)
    fill_in ADDRESS_LINE_1, with: input, visible: false
    TestStatus.set_test_status("#{page}_address_line_1".to_sym, input)
  end

  def enter_address_2(page, input = ADDRESS_2)
    fill_in ADDRESS_LINE_2, with: input, visible: false
    TestStatus.set_test_status("#{page}_address_line_2".to_sym, input)
  end

  def enter_town_and_city(page, input = TOWN_CITY)
    fill_in ADDRESS_LINE_TOWN_CITY, with: input, visible: false
    TestStatus.set_test_status("#{page}_town_and_city".to_sym, input)
  end

  def clear_town_and_city
    fill_in ADDRESS_LINE_TOWN_CITY, with: '', visible: false
  end

  def enter_postcode(page, input = UK_POSTCODE)
    fill_in ADDRESS_LINE_POSTCODE, with: input, visible: false
    TestStatus.set_test_status("#{page}_postcode".to_sym, input)
  end

  def enter_address(page)
    fill_in ADDRESS_FIELD_ID, with: ADDRESS, visible: false
    TestStatus.set_test_status("#{page}_address".to_sym, ADDRESS)
  end

  def enter_organisation_name(page)
    org_name = Faker::Company.name.gsub(/\W/, '')
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

  def enter_invalid_phone_number(page)
    fill_in PHONE_ID, with: INVALID_PHONE_NUMBER, visible: false
    TestStatus.set_test_status("#{page}_phone_number".to_sym, INVALID_PHONE_NUMBER)
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

  def header_columns
    all(:css, 'table > thead >tr >th')
  end

  def select_first_country
    first('country', minimum: 1).click
    find('country__option--0').click
  end

  def address_line_building_name
    find('address-buildingNameOrNumber').text
  end

  def address_line_one
    find('address-addressLine1').text
  end

  def address_line_two
    find('address-addressLine2').text
  end

  def address_line_three
    find('address-townCity').text
  end

  def address_line_four
    find('address-postcode').text
  end

  def address_line_five
    find('address-country').text
  end

  def address_line_building
    find('buildingNameOrNumber').value
  end

  def address_line_1
    find('addressLine1').value
  end

  def address_line_2
    find('addressLine2').value
  end

  def address_town_city
    find('townCity').value
  end

  def address_postcode
    find('postcode').value
  end

  def address_country
    find('country').value
  end

  def organisation_name
    find('organisation-name').value
  end

  def contact_person
    find('organisation-contact-person').value
  end

  def email_address
    find('email-address').value
  end

  def phone_number
    find('phone-number').value
  end

  def fill_organisation_name(name)
    fill_in 'organisation-name', with: name
  end

  def fill_organisation_contact_person(contact_person)
    fill_in 'organisation-contact-person', with: contact_person
  end

  def fill_email_address(email)
    fill_in 'email-address', with: email
  end

  def fill_phone_number(phone_number)
    fill_in 'phone-number', with: phone_number
  end

  def fill_fax_number(fax_number)
    fill_in 'fax-number', with: fax_number
  end

  def option_checked?(selected_country)
    find(countries.fetch(selected_country), visible: false).checked?
  end

  def select_first_address
    find('addressselection-radio-1', visible: false).click
  end

  def select_second_address(page)
    address_text = find('label[for="addressselection-radio-1"]').text
    find('addressselection-radio-2', visible: false).click
    TestStatus.set_test_status("#{page}_full_address".to_sym, address_text)
  end

  def countries
    {
      'England' => 'country-radio-1',
      'Scotland' => 'country-radio-2',
      'Wales' => 'country-radio-3',
      'Northern Ireland' => 'country-radio-4'
    }
  end

  def full_address
    address_line_1 = find('address-addressLine1', visible: false).text
    address_line_2 = find('address-addressLine2', visible: false).text
    town_city = find('address-townCity', visible: false).text
    postcode = find('address-postcode', visible: false).text
    country = find('address-country', visible: false).text

    full_address = "#{address_line_1}, #{address_line_2}, #{town_city}, #{postcode}, #{country}"
    full_address.gsub(/,\s*$/, '')
  end

end
