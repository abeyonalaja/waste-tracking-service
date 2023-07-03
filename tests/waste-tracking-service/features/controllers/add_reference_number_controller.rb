# frozen_string_literal: true

# Provides a way to happy path flow
module AddReferenceNumberController
  def self.complete(reference = Faker::Alphanumeric.alphanumeric(number: 6))
    add_reference_number_page = AddReferenceNumberPage.new
    add_reference_number_page.check_page_displayed
    add_reference_number_page.choose_option 'Yes'
    add_reference_number_page.enter_reference_number reference
    add_reference_number_page.save_and_continue
    TestStatus.set_test_status(:application_reference_number, reference)
    SubmitAnExportPage.new.check_page_displayed
    @url = URI.parse(add_reference_number_page.current_url)
    Log.info("Reference: #{reference}")
    Log.info("Export id is: #{@url}")
    sleep 1
  end
end
