# frozen_string_literal: true

# Provides a way to happy path flow
module RecoveryFacilityController
  def self.complete
    facility_address_page = RecoveryFacilityAddressPage.new
    facility_contact_details_page = RecoveryFacilityContactDetailsPage.new
    recovery_code_page = RecoveryCodePage.new
    chosen_facilities_page = ChosenFacilitiesPage.new
    interim_address_page = InterimSiteAddressPage.new
    interim_site_contact_details_page = InterimSiteContactDetailsPage.new
    interim_site_recovery_code_page = InterimSiteRecoveryCodePage.new
    confirmation_interim_site_page = ConfirmationInterimSitePage.new

    confirmation_interim_site_page.choose_option 'Yes'
    confirmation_interim_site_page.save_and_continue

    interim_address_page.enter_name 'Interim Site Name'
    interim_address_page.enter_address 'interim address street, 6'
    interim_address_page.enter_country 'Scotland'
    interim_address_page.save_and_continue

    interim_site_contact_details_page.enter_full_name 'Jonh Thomas'
    interim_site_contact_details_page.enter_email 'mail@sample.com'
    interim_site_contact_details_page.enter_phone_number '+441234567891'
    interim_site_contact_details_page.save_and_continue

    interim_site_recovery_code_page.choose_option 'R12: Exchange of wastes for submission to any of the operations numbered R01 to R11'
    interim_site_recovery_code_page.save_and_continue

    facility_address_page.enter_name 'Facility Name'
    facility_address_page.enter_address 'Address Test 1, street'
    facility_address_page.enter_country 'Wales'
    facility_address_page.save_and_continue

    facility_contact_details_page.enter_full_name 'John Johnson'
    facility_contact_details_page.enter_email 'example@mail.com'
    facility_contact_details_page.enter_phone_number '+441234567891'
    facility_contact_details_page.save_and_continue

    recovery_code_page.select_first_option
    recovery_code_page.save_and_continue

    chosen_facilities_page.choose_option 'No'
    chosen_facilities_page.save_and_continue
  end
end
