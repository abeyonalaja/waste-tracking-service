# frozen_string_literal: true

# Provides a way to happy path flow
module UkmReferenceNumberController
  def self.complete
    ukwm_add_reference_page = UkwmAddReferencePage.new
    ukwm_add_reference_page.check_page_displayed
    prefix = "#{Faker::Alphanumeric.alphanumeric(number: 3).upcase}_"
    date = Faker::Date.forward(days: 3650).strftime("%d/%m/%Y")
    reference = "#{prefix} #{date}"
    ukwm_add_reference_page.enter_reference reference
    TestStatus.set_test_status(:ukm_reference_number, reference)
    ukwm_add_reference_page.save_and_continue
    UkwmTaskListPage.new.check_page_displayed
    @url = URI.parse(ukwm_add_reference_page.current_url)
    Log.info("UKM Reference: #{reference}")
    Log.info("Export url is: #{@url}")
    uuid_regex = %r{move-waste/single/([0-9a-fA-F-]{36})}
    id_value = ukwm_add_reference_page.current_url.match(uuid_regex)[1]
    TestStatus.set_test_status(:export_id, id_value)
    Log.info("UKWM Export id is #{id_value}")
    sleep 1
  end
end
