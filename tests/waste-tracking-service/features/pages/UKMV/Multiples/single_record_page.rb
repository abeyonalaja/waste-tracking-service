# frozen_string_literal: true

# this page is for multiple ukmw single record page details
class UkwmSingleRecordPage < GenericPage

  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Waste movement record', exact_text: true
  end

  def waste_description_label
    find('waste-description-label').text
  end

  def waste_description_value
    find('waste-description-value').text
  end

  def physical_form_label
    find('physical-form-label').text
  end

  def physical_form_value
    find('physical-form-value').text
  end

  def waste_quantity_label
    find('waste-quantity-label').text
  end

  def waste_quantity_value
    find('waste-quantity-value').text
  end

  def chemical_biological_label
    find('chemical-and-biological-components-of-waste-label').text
  end

  def chemical_biological_value
    find('chemical-and-biological-components-of-waste-value').text
  end

  def hazardous_properties_label
    find('hazardous-properties-label').text
  end

  def hazardous_properties_value
    find('hazardous-properties-value').text
  end

  def hazardous_waste_codes_label
    find('hazardous-waste-codes-label').text
  end

  def hazardous_waste_codes_value
    find('hazardous-waste-codes-value').text
  end

  def pops_label
    find('persistent-organic-pollutants-pops-label').text
  end

  def pops_value
    find('persistent-organic-pollutants-pops-value').text
  end

  def pops_details_label
    find('persistent-organic-pollutants-pops-details-label').text
  end

  def pops_details_value
    find('persistent-organic-pollutants-pops-details-value').text
  end

  def pops_concentration_label
    find('persistent-organic-pollutants-pops-concentration-value-label').text
  end

  def pops_concentration_value
    find('persistent-organic-pollutants-pops-concentration-value-value').text
  end

  def transportation_containers_label
    find('number-and-type-of-transportation-containers-label').text
  end

  def transportation_containers_value
    find('number-and-type-of-transportation-containers-value').text
  end

  def special_handling_label
    find('special-handling-requirements-details-label').text
  end

  def special_handling_value
    find('special-handling-requirements-details-value').text
  end

  def producer_org_name_label
    find('producer-organisation-name-label').text
  end

  def producer_org_name_value
    find('producer-organisation-name-value').text
  end

  def producer_address_label
    find('producer-address-label').text
  end

  def producer_address_value
    find('producer-address-value').text
  end

  def producer_contact_name_label
    find('producer-contact-name-label').text
  end

  def producer_contact_name_value
    find('producer-contact-name-value').text
  end

  def producer_contact_email_label
    find('producer-contact-email-address-label').text
  end

  def producer_contact_email_value
    find('producer-contact-email-address-value').text
  end

  def producer_contact_phone_label
    find('producer-contact-phone-number-label').text
  end

  def producer_contact_phone_value
    find('producer-contact-phone-number-value').text
  end

  def producer_sic_code_label
    find('producer-standard-industrial-classification-sic-code-label').text
  end

  def producer_sic_code_value
    find('producer-standard-industrial-classification-sic-code-value').text
  end

  def waste_collection_address_label
    find('waste-collection-address-label').text
  end

  def waste_collection_address_value
    find('waste-collection-address-value').text
  end

  def local_authority_label
    find('local-authority-label').text
  end

  def local_authority_value
    find('local-authority-value').text
  end

  def waste_source_label
    find('waste-source-label').text
  end

  def waste_source_value
    find('waste-source-value').text
  end

  def broker_registration_num_label
    find('broker-registration-number-label').text
  end

  def broker_registration_num_value
    find('broker-registration-number-value').text
  end

  def carrier_org_name_label
    find('carrier-organisation-name-label').text
  end

  def carrier_org_name_value
    find('carrier-organisation-name-value').text
  end

  def carrier_address_label
    find('carrier-address-label').text
  end

  def carrier_address_value
    find('carrier-address-value').text
  end

  def carrier_contact_name_label
    find('carrier-contact-name-label').text
  end

  def carrier_contact_name_value
    find('carrier-contact-name-value').text
  end

  def carrier_contact_email_label
    find('carrier-contact-email-address-label').text
  end

  def carrier_contact_email_value
    find('carrier-contact-email-address-value').text
  end

  def carrier_contact_phone_label
    find('carrier-contact-phone-number-label').text
  end

  def carrier_contact_phone_value
    find('carrier-contact-phone-number-value').text
  end

  def receiver_authorisation_label
    find('receiver-authorisation-type-label').text
  end

  def receiver_authorisation_value
    find('receiver-authorisation-type-value').text
  end

  def receiver_permit_number_label
    find('receiver-permit-number-or-waste-exemption-number-label').text
  end

  def receiver_permit_number_value
    find('receiver-permit-number-or-waste-exemption-number-value').text
  end

  def receiver_org_name_label
    find('receiver-organisation-name-label').text
  end

  def receiver_org_name_value
    find('receiver-organisation-name-value').text
  end

  def receiver_address_label
    find('receiver-address-label').text
  end

  def receiver_address_value
    find('receiver-address-value').text
  end

  def receiver_postcode_label
    find('receiver-postcode-label').text
  end

  def receiver_postcode_value
    find('receiver-postcode-value').text
  end

  def receiver_contact_name_label
    find('receiver-contact-name-label').text
  end

  def receiver_contact_name_value
    find('receiver-contact-name-value').text
  end

  def receiver_contact_email_label
    find('receiver-contact-email-address-label').text
  end

  def receiver_contact_email_value
    find('receiver-contact-email-address-value').text
  end

  def receiver_contact_phone_label
    find('receiver-contact-phone-number-label').text
  end

  def receiver_contact_phone_value
    find('receiver-contact-phone-number-value').text
  end
end
