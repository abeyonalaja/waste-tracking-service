# frozen_string_literal: true

# Provides a way to happy path flow
module LaboratoryContactDetailsController
  def self.complete
    laboratory_contact_details_page = LaboratoryContactDetailsPage.new
    laboratory_contact_details_page.enter_full_name 'laboratory_contact_details'
    laboratory_contact_details_page.enter_email 'laboratory_contact_details'
    laboratory_contact_details_page.enter_phone_number 'laboratory_contact_details'
    laboratory_contact_details_page.enter_fax_number 'laboratory_contact_details'
    laboratory_contact_details_page.save_and_continue
    sleep 1
  end
end
