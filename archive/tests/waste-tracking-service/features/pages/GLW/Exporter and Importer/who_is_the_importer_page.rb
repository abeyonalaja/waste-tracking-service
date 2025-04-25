# frozen_string_literal: true

# this page is for whi importer details page details
class WhoIsTheImporterPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  HINT_TEXT = Translations.value 'exportJourney.importerDetails.title'
  TITLE = Translations.value 'exportJourney.importerDetails.firstPageQuestion'
  ORGANISATION_NAME = Translations.value 'contact.orgName'
  ADDRESS = Translations.value 'address'
  COUNTRY = Translations.value 'address.country'

  ORGANISATION_NAME_FIELD_ID = 'organisationName'
  ADDRESS_FIELD_ID = 'address'
  COUNTRY_FIELD_ID = 'country'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_translation
    expect(self).to have_text ORGANISATION_NAME
    expect(self).to have_text ADDRESS
    expect(self).to have_text COUNTRY
    expect(self).to have_text HINT_TEXT
  end

  def enter_organisation_name(organisation_name)
    fill_in ORGANISATION_NAME_FIELD_ID, with: organisation_name, visible: false
    TestStatus.set_test_status(:organisation_name, organisation_name)
  end

  def enter_address(address)
    fill_in ADDRESS_FIELD_ID, with: address, visible: false
    TestStatus.set_test_status(:address, address)
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

  def select_importer_country
    index = rand(0..245)
    country = "country__option--#{index}"
    first('country', minimum: 1).click
    first(country, minimum: 1).select_option
    importer_country = find(COUNTRY_FIELD_ID).value
    TestStatus.set_test_status(:importer_country, importer_country)
    Log.info("Importing country is #{importer_country}")
  end

  def select_first_importer_country
    first('country', minimum: 1).click
    find('country__option--0').click
  end

end
