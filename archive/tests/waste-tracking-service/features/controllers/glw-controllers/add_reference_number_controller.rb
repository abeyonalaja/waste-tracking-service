# frozen_string_literal: true

# Provides a way to happy path flow
module AddReferenceNumberController
  def self.complete
    add_reference_number_page = AddReferenceNumberPage.new
    add_reference_number_page.check_page_displayed
    reference = Faker::Alphanumeric.alphanumeric(number: 6)
    add_reference_number_page.enter_reference_number reference
    TestStatus.set_test_status(:application_reference_number, reference)
    add_reference_number_page.save_and_continue
    TaskListPage.new.check_page_displayed
    @url = URI.parse(add_reference_number_page.current_url)
    Log.info("Reference: #{reference}")
    Log.info("Export url is: #{@url}")
    id_value = add_reference_number_page.current_url.match(/id=([^&]+)/)[1]
    TestStatus.set_test_status(:export_id, id_value)
    Log.info("Export id is #{id_value}")
    sleep 1
  end
end
