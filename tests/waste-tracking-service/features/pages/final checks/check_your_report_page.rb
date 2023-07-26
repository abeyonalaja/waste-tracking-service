# frozen_string_literal: true

require_relative '../shared_components/general_helpers'
require_relative '../shared_components/error_box'
# this page is for Exporter details page details
class CheckYourReportPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  WARNING = Translations.value 'exportJourney.checkAnswers.warning'
  TITLE = Translations.value 'exportJourney.checkAnswers.heading'
  SUBTEXT = Translations.value 'exportJourney.checkAnswers.paragraph'
  CONFIRM_ANSWERS_BUTTON = Translations.value 'exportJourney.checkAnswers.conformButton'

  EXPORT_REFERENCE = '#your-reference > span'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text SUBTEXT
    expect(self).to have_text 'Your reference'
    expect(self).to have_text 'About the waste'
    expect(self).to have_text 'Exporter and importer'
    expect(self).to have_text 'Journey of waste'
    expect(self).to have_text 'Treatment of waste'
    expect(self).to have_css 'h3', text: 'Exporter details', exact_text: true
    expect(self).to have_css 'h3', text: 'Importer details', exact_text: true
    expect(self).to have_css 'h3', text: 'Waste collection details', exact_text: true
    expect(self).to have_css 'h3', text: 'Location waste leaves the UK', exact_text: true
    expect(self).to have_css 'h3', text: 'Countries waste will travel through', exact_text: true
    expect(self).to have_css 'h3', text: 'Interim site', exact_text: true
    expect(self).to have_css 'h3', text: 'Recovery facility', exact_text: true
  end

  def confirm_answers_button
    click_button CONFIRM_ANSWERS_BUTTON
  end

  def check_warning_text
    expect(self).to have_text WARNING
  end

  def your_ref_change
    click_link 'your-reference-change'
  end

  def check_export_reference
    find(:css, EXPORT_REFERENCE).text == TestStatus.test_status(:application_reference_number)
  end

  def waste_code_header
    find('waste-code-type-header').text
  end

  def ewc_code_header
    find('ewc-codes-header').text
  end

  def national_code_header
    find('national-code-header').text
  end

  def waste_description_header
    find('waste-description-header').text
  end

  def waste_quantity_header
    find('waste-quanitity-header').text
  end

  def waste_code_type
    find('waste-code-type').text
  end

  def waste_code_description
    puts find(:xpath, '//*[@id="waste-code-type"]//parent::dd').text.sub(/.*?\n/, '')
    find(:xpath, '//*[@id="waste-code-type"]//parent::dd').text.sub(/.*?\n/, '')
  end

  def national_code
    find(:xpath, '//*[@id="national-code"]/span').text
  end

  def describe_the_waste
    find(:xpath, '//*[@id="waste-description"]/span').text
  end

  def waste_quantity
    find('waste-quanitity').text.gsub("\n", ' ')
  end

  def waste_carriers_list item
    find("carrier-#{item}")
  end

  def ewc_codes
    find(:xpath, '//*[@id="ewc-codes"]//parent::dd').text
  end

  def ewc_codes_list
    all(:xpath, '//*[@id="ewc-codes"]//ul//li')
  end

  ##exporter and importer
  def exporter_address_header
    find('exporter-address-header').text
  end

  def exporter_address
    find('exporter-address').text
  end

  def exporter_address_change
    click_link('exporter-address-change')
  end

  def exporter_country_header
    find('exporter-country-header').text
  end

  def exporter_country
    find('exporter-country').text
  end

  def exporter_organisation_name_header
    find('exporter-organisation-name-header').text
  end

  def exporter_organisation_name
    find('exporter-organisation-name').text
  end

  def exporter_organisation_name_change
    click_link('exporter-organisation-name-change')
  end

  def exporter_full_name_header
    find('exporter-full-name-header').text
  end

  def exporter_full_name
    find('exporter-full-name').text
  end

  def exporter_email_header
    find('exporter-email-header').text
  end

  def exporter_email
    find('exporter-email').text
  end

  def exporter_phone_header
    find('exporter-phone-header').text
  end

  def exporter_phone
    find('exporter-phone').text
  end

  def exporter_fax_header
    find('exporter-fax-header').text
  end

  def exporter_fax
    find('exporter-fax').text
  end

  def importer_organisation_name_header
    find('importer-organisation-name-header').text
  end

  def importer_organisation_name
    find('importer-organisation-name').text
  end

  def importer_details_change
    find('importer-details-change').text
  end

  def importer_address_header
    find('importer-address-header').text
  end

  def importer_address
    find('importer-address').text
  end

  def importer_country_header
    find('importer-country-header').text
  end

  def importer_country
    find('importer-country').text
  end

  def importer_full_name_header
    find('importer-full-name-header').text
  end

  def importer_full_name
    find('importer-full-name').text
  end

  def importer_contact_details_change
    find('importer-contact-details-change').text
  end

  def importer_email_header
    find('importer-email-header').text
  end

  def importer_email
    find('importer-email').text
  end

  def importer_phone_header
    find('importer-phone-header').text
  end

  def importer_phone
    find('importer-phone').text
  end

  def importer_fax_header
    find('importer-fax-header').text
  end

  def importer_fax
    find('importer-fax').text
  end

  def collection_date_header
    find('collection-date-header').text
  end

  def collection_date
    find('collection-date').text.gsub("\n", ' ')
  end

  def collection_date_change
    click_link('collection-date-change')
  end

  def carrier_organisation_name_header(item)
    find("carrier-organisation-name-header#{item}").text
  end

  def carrier_organisation_name(item)
    find("carrier-organisation-name#{item}").text
  end

  def carrier_change(item)
    click_link("carrier-change#{item}")
  end

  def carrier_address_header(item)
    find("carrier-address-header#{item}").text
  end

  def carrier_address(item)
    find("carrier-address#{item}").text
  end

  def carrier_country_header(item)
    find("carrier-country-header#{item}").text
  end

  def carrier_country(item)
    find("carrier-country#{item}").text
  end

  def carrier_full_name_header(item)
    find("carrier-full-name-header#{item}").text
  end

  def carrier_full_name(item)
    find("carrier-full-name#{item}").text
  end

  def carrier_contact_details_change(item)
    click_link("carrier-contact-details-change#{item}")
  end

  def carrier_email_header(item)
    find("carrier-email-header#{item}").text
  end

  def carrier_email(item)
    find("carrier-email#{item}").text
  end

  def carrier_phone_header(item)
    find("carrier-phone-header#{item}").text
  end

  def carrier_phone(item)
    find("carrier-phone#{item}").text
  end

  def carrier_fax_header(item)
    find("carrier-fax-header#{item}").text
  end

  def carrier_fax(item)
    find("carrier-fax#{item}").text
  end

  def carrier_type_header(item)
    find("carrier-type-header#{item}").text
  end

  def carrier_type(item)
    find("carrier-type#{item}").text
  end

  def carrier_type_change(item)
    click_link("carrier-type-change#{item}")
  end

  def carrier_shipping_container_number_header(item)
    find("carrier-shipping-container-number-header#{item}").text
  end

  def carrier_shipping_container_number(item)
    find("carrier-shipping-container-number#{item}").text
  end

  def carrier_details_change(item)
    click_link("carrier-details-change#{item}")
  end

  def carrier_vehicle_registration_header(item)
    find("carrier-vehicle-registration-header#{item}").text
  end

  def carrier_vehicle_registration(item)
    find("carrier-vehicle-registration#{item}").text
  end

  def waste_collection_address_header
    find('waste-collection-address-header').text
  end

  def waste_collection_address
    find('waste-collection-address').text
  end

  def waste_collection_address_change
    click_link('waste-collection-address-change')
  end

  def waste_collection_country_header
    find('waste-collection-country-header').text
  end

  def waste_collection_country
    find('waste-collection-country').text
  end

  def waste_collection_organisation_header
    find('waste-collection-full-name-header').text
  end

  def waste_collection_organisation
    find('waste-collection-full-name').text
  end

  def waste_collection_full_name_change
    click_link('waste-collection-full-name-change')
  end

  def waste_collection_full_name_header
    find('waste-collection-contact-person-header').text
  end

  def waste_collection_full_name
    find('waste-collection-contact-person').text
  end

  def waste_collection_email_header
    find('waste-collection-email-header').text
  end

  def waste_collection_email
    find('waste-collection-email').text
  end

  def waste_collection_phone_header
    find('waste-collection-phone-header').text
  end

  def waste_collection_phone
    find('waste-collection-phone').text
  end

  def exit_location_header
    find('exit-location-header').text
  end

  def exit_location
    find('exit-location').text
  end

  def exit_location_change
    click_link('exit-location-change')
  end

  def transit_countries_header
    find('transit-countries-header').text
  end

  def transit_countries
    find(:xpath, '//*[@id="transit-countries"]/ol/li').text
  end

  def transit_countries_change
    click_link('transit-countries-change')
  end

  def interimsite_org_name_title_0
    find('interimsite-org-name-title-0').text
  end

  def interimsite_org_name_0
    find('interimsite-org-name-0').text
  end

  def interimsite_address_title_0
    find('interimsite-address-title-0').text
  end

  def interimsite_address_0
    find('interimsite-address-0').text
  end

  def interimsite_country_title_0
    find('interimsite-country-title-0').text
  end

  def interimsite_country_0
    find('interimsite-country-0').text
  end

  def interimsite_contact_person_title_0
    find('interimsite-contact-person-title-0').text
  end

  def interimsite_contact_person_0
    find('interimsite-contact-person-0').text
  end

  def interimsite_email_title_0
    find('interimsite-email-title-0').text
  end

  def interimsite_email_0
    find('interimsite-email-0').text
  end

  def interimsite_phone_title_0
    find('interimsite-phone-title-0').text
  end

  def interimsite_phone_0
    find('interimsite-phone-0').text
  end

  def interimsite_fax_title_0
    find('interimsite-fax-title-0').text
  end

  def interimsite_fax_0
    find('interimsite-fax-0').text
  end

  def interimsite_code_title_0
    find('interimsite-code-title-0').text
  end

  def interimsite_code_0
    find('interimsite-code-0').text
  end

  def recoveryfacility_org_name_title(item)
    find("recoveryfacility-org-name-title-#{item}").text
  end

  def recoveryfacility_org_name(item)
    find("recoveryfacility-org-name-#{item}").text
  end

  def recoveryfacility_address_title(item)
    find("recoveryfacility-address-title-#{item}").text
  end

  def recoveryfacility_address(item)
    find("recoveryfacility-address-#{item}").text
  end

  def recoveryfacility_country_title(item)
    find("recoveryfacility-country-title-#{item}").text
  end

  def recoveryfacility_country(item)
    find("recoveryfacility-country-#{item}").text
  end

  def recoveryfacility_contact_person_title(item)
    find("recoveryfacility-contact-person-title-#{item}").text
  end

  def recoveryfacility_contact_person(item)
    find("recoveryfacility-contact-person-#{item}").text
  end

  def recoveryfacility_email_title(item)
    find("recoveryfacility-email-title-#{item}").text
  end

  def recoveryfacility_email(item)
    find("recoveryfacility-email-#{item}").text
  end

  def recoveryfacility_phone_title(item)
    find("recoveryfacility-phone-title-#{item}").text
  end

  def recoveryfacility_phone(item)
    find("recoveryfacility-phone-#{item}").text
  end

  def recoveryfacility_fax_title(item)
    find("recoveryfacility-fax-title-#{item}").text
  end

  def recoveryfacility_fax(item)
    find("recoveryfacility-fax-#{item}").text
  end

  def recoveryfacility_code_title(item)
    find("recoveryfacility-code-title-#{item}").text
  end

  def recoveryfacility_code(item)
    find("recoveryfacility-code-#{item}").text
  end

  def waste_code_type_change
    click_link 'waste-code-type-change'
  end

  def ewc_code_change
    click_link 'ewc-codes-change'
  end

  def national_code_change
    click_link 'national-code-change'
  end

  def waste_quantity_change
    click_link 'waste-quanitity-change'
  end

  def waste_description_change
    click_link 'waste-destription-change'
  end

end
