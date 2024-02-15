# frozen_string_literal: true

# this page is for manual address entry for waste collection details page details
class ManualAddressEntryWasteCollectionPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  ADDRESS1 = 'addressLine1'
  ADDRESS2 = 'addressLine2'
  TOWN = 'townCity'
  POSTCODE = 'postcode'
  COUNTRY = 'country'

  TITLE = Translations.value 'exportJourney.wasteCollectionDetails.postcodeTitle'
  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    address1 = Translations.value 'address.addressLine1'
    address2 = Translations.value 'address.addressLine2'
    town = Translations.value 'address.townCity'
    postcode = Translations.value 'postcode.label'
    country = Translations.value 'address.country'
    address_hint = Translations.value 'address.addressLine.hint'
    country_hint = Translations.value 'exportJourney.wasteCollectionDetails.countryHint'

    expect(page).to have_text address1
    expect(page).to have_text address2
    expect(page).to have_text town
    expect(page).to have_text postcode
    expect(page).to have_text country
    expect(page).to have_text address_hint
    expect(page).to have_text country_hint
  end

  def enter_address1(address1)
    fill_in ADDRESS1, with: address1, visible: false
    TestStatus.set_test_status(:address1, address1)
  end

  def enter_town(town)
    fill_in TOWN, with: town, visible: false
    TestStatus.set_test_status(:town, town)
  end

  def enter_postcode(postcode)
    fill_in POSTCODE, with: postcode, visible: false
    TestStatus.set_test_status(:postcode, postcode)
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
    find(COUNTRY).value == country
  end

  def option_checked?(selected_country)
    find(countries.fetch(selected_country), visible: false).checked?
  end

  def countries
    {
      'England' => 'country-england',
      'Scotland' => 'country-scotland',
      'Wales' => 'country-wales',
      'Northern Ireland' => 'country-northern-ireland'
    }
  end

  def enter_address2(address2)
    fill_in ADDRESS2, with: address2, visible: false
    TestStatus.set_test_status(:address2, address2)
  end

end
