# frozen_string_literal: true

# Provides a way to happy path flow
module UkmProducerContactDetailsController
  def self.complete
    ukwm_producer_contact_details_page = ProducerContactDetailsPage.new
    ukwm_producer_contact_details_page.check_page_displayed

    org_name = Faker::Company.name
    contact_person = Faker::Name.name
    email = Faker::Internet.email
    phone_number = '+441234567891'

    ukwm_producer_contact_details_page.fill_organisation_name org_name
    ukwm_producer_contact_details_page.fill_organisation_contact_person contact_person
    ukwm_producer_contact_details_page.fill_email_address email
    ukwm_producer_contact_details_page.fill_phone_number phone_number

    TestStatus.set_test_status(:org_name, org_name)
    TestStatus.set_test_status(:contact_person, contact_person)
    TestStatus.set_test_status(:email, email)
    TestStatus.set_test_status(:phone_number, phone_number)
  end
end
