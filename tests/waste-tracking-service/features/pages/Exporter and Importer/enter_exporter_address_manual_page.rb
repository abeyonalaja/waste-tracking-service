# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class EnterExporterAddressManualPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  ADDRESS1 = 'address'
  TOWN = 'townCity'
  POSTCODE = 'postcode'
  COUNTRY = 'country-england'

  TITLE = Translations.value 'exportJourney.exporterPostcode.title'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def enter_address1(address1)
    fill_in ADDRESS1, with: address1, visible: false
  end

  def enter_town(town)
    fill_in TOWN, with: town, visible: false
  end

  def enter_postcode(postcode)
    fill_in POSTCODE, with: postcode, visible: false
  end

  # Always pick England
  def select_first_country_option
    find(COUNTRY, visible: false).click
  end

  def has_reference_address?(address1)
    find(ADDRESS1).value == address1
  end

  def has_reference_town?(town)
    find(TOWN).value == town
  end

  def has_reference_postcode?(postcode)
    find(POSTCODE).value == postcode
  end

  def has_reference_country?(country)
    find(COUNTRY, visible: false).value == country
  end

  def check_page_translation
    title = Translations.value 'exportJourney.exporterPostcode.title'
    address1 = Translations.value 'address.addressLine1'
    address2 = Translations.value 'address.addressLine2'
    town = Translations.value 'address.townCity'
    postcode = Translations.value 'address.postcodeOptional'
    country = Translations.value 'address.country'

    expect(self).to have_css 'h1', text: title, exact_text: true
    expect(page).to have_text address1
    expect(page).to have_text address2
    expect(page).to have_text town
    expect(page).to have_text postcode
    expect(page).to have_text country
  end

  def enter_description(description)
    fill_in DESCRIPTION, with: description, visible: false
  end

  def country_checked(country)
    country = country.downcase
    find("country-#{country}", visible: false)
  end
end
