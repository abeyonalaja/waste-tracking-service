# frozen_string_literal: true

# Provides a way to happy path flow
module AddReferenceNumberController
  def self.complete(option = 'Yes')
    add_reference_number_page = AddReferenceNumberPage.new
    add_reference_number_page.check_page_displayed
    add_reference_number_page.choose_option option
    if option == 'Yes'
      reference = Faker::Alphanumeric.alphanumeric(number: 6)
      add_reference_number_page.enter_reference_number reference
      TestStatus.set_test_status(:application_reference_number, reference)
    else
      TestStatus.set_test_status(:application_reference_number, 'Not Provided')
    end
    add_reference_number_page.save_and_continue
    SubmitAnExportPage.new.check_page_displayed
    @url = URI.parse(add_reference_number_page.current_url)
    Log.info("Reference: #{reference}")
    Log.info("Export id is: #{@url}")
    sleep 1
  end
end
