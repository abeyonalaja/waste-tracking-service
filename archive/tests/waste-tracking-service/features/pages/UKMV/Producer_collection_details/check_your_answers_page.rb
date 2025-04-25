# frozen_string_literal: true

# this page is for whats producer address page
class CheckYourAnswersPage < GenericPage
  include CommonComponents
  include GeneralHelpers
  include ErrorBox
  include PageHelper

  def check_page_displayed
    expect(self).to have_text 'Check your answers'
  end

  def producer_address_label
    find('producer-address-label').text
  end

  def producer_address1_value
    find('address-addressLine1-1').text
  end

  def producer_address2_value
    find('address-addressLine2-1').text
  end

  def producer_town_value
    find('address-townCity-1').text
  end

  def producer_postcode_value
    find('address-postcode-1').text
  end

  def producer_country_value
    find('address-country-1').text
  end

  def waste_collection_address_1_value
    find('address-addressLine1-2').text
  end

  def waste_collection_address2_value
    find('address-addressLine2-2').text
  end

  def waste_collection_town_value
    find('address-townCity-2').text
  end

  def waste_collection_postcode_value
    find('address-postcode-2').text
  end

  def waste_collection_country_value
    find('address-country-2').text
  end

  def org_name_label
    find('organisation-name-label').text
  end

  def org_name_value
    find('organisation-name-value').text
  end

  def contact_name_label
    find('contact-full-name-label').text
  end

  def contact_name_value
    find('contact-full-name-value').text
  end

  def email_label
    find('email-address-label').text
  end

  def email_value
    find('email-address-value').text
  end

  def phone_number_label
    find('phone-number-label').text
  end

  def phone_number_value
    find('phone-number-value').text
  end

  def fax_label
    find('fax-number-optional-label').text
  end

  def fax_value
    find('fax-number-optional-value').text
  end

  def sic_code_label
    find('producer-standard-industry-sic-code-label').text
  end

  def sic_code_value
    find('producer-standard-industry-sic-code-value').text
  end

  def waste_source_label
    find('waste-source-label').text
  end

  def waste_source_value
    find('waste-source-value').text
  end

end
