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

    interim_address_page.enter_name 'interim_site_name'
    interim_address_page.enter_address 'interim_site_name'
    interim_address_page.select_interim_site_country
    interim_address_page.save_and_continue

    interim_site_contact_details_page.enter_full_name 'interim_site_contact_name'
    interim_site_contact_details_page.enter_email 'interim_site_contact_name'
    interim_site_contact_details_page.enter_phone_number 'interim_site_contact_name'
    interim_site_contact_details_page.save_and_continue

    interim_site_recovery_code_page.choose_option 'R12: Exchange of wastes for submission to any of the operations numbered R01 to R11'
    TestStatus.set_test_status(:interim_site_recovery_code, 'R12: Exchange of wastes for submission to any of the operations numbered R01 to R11')
    interim_site_recovery_code_page.save_and_continue

    facility_address_page.enter_name 'recovery_facility'
    facility_address_page.enter_address 'recovery_facility'
    facility_address_page.select_recovery_facility_country '1st_recovery_facility_country'
    facility_address_page.save_and_continue

    facility_contact_details_page.enter_full_name 'recovery_facility'
    facility_contact_details_page.enter_email 'recovery_facility'
    facility_contact_details_page.enter_phone_number 'recovery_facility'
    facility_contact_details_page.save_and_continue

    recovery_code_page.select_first_option
    recovery_code_page.save_and_continue

    chosen_facilities_page.choose_option 'No'
    chosen_facilities_page.save_and_continue
  end
end
