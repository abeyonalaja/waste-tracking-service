# frozen_string_literal: true

# Provides a way to happy path flow
module AddReferenceNumberController
  def self.complete(reference = 'TestExport')
    add_reference_number_page = AddReferenceNumberPage.new
    add_reference_number_page.check_page_displayed
    add_reference_number_page.choose_option 'Yes'
    add_reference_number_page.enter_reference_number reference
    add_reference_number_page.save_and_continue
    TestStatus.set_test_status(:application_reference_number, reference)
    sleep 1
  end
end
