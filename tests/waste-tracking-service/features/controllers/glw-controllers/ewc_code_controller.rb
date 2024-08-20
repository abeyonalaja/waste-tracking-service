# frozen_string_literal: true

# Provides a way to happy path flow
module EwcCodeController
  def self.complete
    enter_an_ewc_code_page = EnterAnEwcCodePage.new
    ewc_code_list_page = EwcCodeListPage.new
    code = TestData.get_ewc_codes 0
    Log.info("EWC code is : #{code}")
    enter_an_ewc_code_page.enter_ewc_code TestData.get_ewc_codes 0
    TestStatus.set_test_status(:ewc_code, code)
    enter_an_ewc_code_page.save_and_continue
    ewc_code_list_page.choose_option 'No'
    ewc_code_list_page.save_and_continue
  end
end
