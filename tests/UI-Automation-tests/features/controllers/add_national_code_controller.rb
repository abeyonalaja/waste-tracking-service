# frozen_string_literal: true

# Provides a way to happy path flow
module NationalCodeController

  def self.complete(national_code)
    add_national_code_page = NationalCodePage.new
    add_national_code_page.check_page_displayed
    add_national_code_page.choose_option 'Yes'
    add_national_code_page.enter_input_value national_code
    add_national_code_page.save_and_continue
    TestStatus.set_test_status(:national_code, national_code)
    sleep 1
  end
end
