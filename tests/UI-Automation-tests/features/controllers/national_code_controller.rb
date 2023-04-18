# frozen_string_literal: true

# Provides a way to happy path flow
module NationalCodeController
  def self.complete(national_code = 'Yes')
    add_national_code_page = NationalCodePage.new
    add_national_code_page.check_page_displayed
    add_national_code_page.choose_option national_code
    if national_code == 'Yes'
      add_national_code_page.enter_input_value 'National Code'
      TestStatus.set_test_status(:national_code_text, 'National Code')
    end
    add_national_code_page.save_and_continue
    TestStatus.set_test_status(:national_code, national_code)
    sleep 1
  end
end
