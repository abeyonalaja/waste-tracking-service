# frozen_string_literal: true

# Provides a way to happy path flow
module WasteCodeController
  def self.complete(waste_code = 'Basel Annex IX')
    classification_of_the_waste_page = ClassificationOfTheWastePage.new
    waste_code_page = WasteCodePage.new
    classification_of_the_waste_page.choose_option(waste_code)
    if waste_code == 'Not applicable'
      TestStatus.set_test_status(:waste_code, waste_code)
      TestStatus.set_test_status(:waste_code_description, 'N/A')
    else
      classification_of_the_waste_page.save_and_continue
      waste_code_page.check_page_displayed waste_code
      waste_code_page.select_first_option
      TestStatus.set_test_status(:waste_code, waste_code)
    end

    Log.info("waste code is: #{waste_code}")
    waste_code_page.save_and_continue
    EnterAnEwcCodePage.new.check_page_displayed
  end
end
