# frozen_string_literal: true

# Provides a way to happy path flow
module EwcCodeController
  def self.complete(option = 'Yes', ewc_code = '010101: wastes from mineral metalliferous excavation')
    do_you_have_ewc_code_page = DoYouHaveEwcCodePage.new
    ewc_code_list_page = EwcCodeListPage.new
    case option
    when 'Yes'
      do_you_have_ewc_code_page.choose_option option
      do_you_have_ewc_code_page.select_first_option
      ewc_code_list_page.choose_option 'No'
      ewc_code_list_page.save_and_continue
      Log.info("EWC code is : #{ewc_code}")
    when 'No'
      do_you_have_ewc_code_page.choose_option option
      ewc_code_list_page.save_and_continue
    when ' '
      do_you_have_ewc_code_page.select_first_option
      ewc_code_list_page.save_and_continue
      ewc_code_list_page.choose_option 'No'
      ewc_code_list_page.save_and_continue
      Log.info("EWC code is : #{ewc_code}")
    end
    TestStatus.set_test_status(:waste_code, ewc_code)

    do_you_have_ewc_code_page.save_and_continue
  end
end
