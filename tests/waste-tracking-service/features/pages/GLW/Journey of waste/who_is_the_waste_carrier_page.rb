# frozen_string_literal: true

# this page is for Who is the waste carrier page details
class WhoIsTheWasteCarrierPage < GenericPage
  include GeneralHelpers
  include ErrorBox
  include CommonComponents

  TITLE = Translations.value 'exportJourney.wasteCarrierDetails.firstPageQuestion'
  FIRST_TITLE = Translations.value 'exportJourney.wasteCarrierDetails.firstPageQuestion1'
  SECOND_TITLE = Translations.value 'exportJourney.wasteCarrierDetails.firstPageQuestion2'
  THIRD_TITLE = Translations.value 'exportJourney.wasteCarrierDetails.firstPageQuestion3'
  FOURTH_TITLE = Translations.value 'exportJourney.wasteCarrierDetails.firstPageQuestion4'
  FIFTH_TITLE = Translations.value 'exportJourney.wasteCarrierDetails.firstPageQuestion5'
  SUB_TEXT = Translations.value 'exportJourney.wasteCarrierDetails.title'
  ORGANISATION_NAME = Translations.value 'exportJourney.wasteCarrierDetails.organisationName'
  ADDRESS = Translations.value 'exportJourney.wasteCarrierDetails.address'
  COUNTRY = Translations.value 'exportJourney.wasteCarrierDetails.country'

  ORGANISATION_NAME_FIELD_ID = 'organisationName'
  ADDRESS_FIELD_ID = 'address'
  COUNTRY_FIELD_ID = 'country'

  def check_page_displayed
    expect(self).to have_css 'h1', text: FIRST_TITLE, exact_text: true
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

  def check_second_waste_page_displayed
    expect(self).to have_css 'h1', text: SECOND_TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text SUB_TEXT
    expect(self).to have_text ORGANISATION_NAME
    expect(self).to have_text ADDRESS
    expect(self).to have_text COUNTRY
  end

  def enter_address(address)
    fill_in ADDRESS_FIELD_ID, with: address, visible: false
    TestStatus.set_test_status(:address, address)
  end

  def enter_country(country)
    fill_in COUNTRY_FIELD_ID, with: country, visible: false
    TestStatus.set_test_status(:country, country)
  end

  def enter_organisation_name(organisation_name)
    fill_in ORGANISATION_NAME_FIELD_ID, with: organisation_name, visible: false
    TestStatus.set_test_status(:organisation_name, organisation_name)
  end

  def has_reference_organisation_name?(organisation_name)
    find(ORGANISATION_NAME_FIELD_ID).value == organisation_name
  end

  def has_reference_address?(address)
    find(ADDRESS_FIELD_ID).value == address
  end

  def has_reference_country?(country)
    find(COUNTRY_FIELD_ID).value == country
  end

end
