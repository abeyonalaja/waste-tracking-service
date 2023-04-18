# frozen_string_literal: true

# Provides a way to happy path flow
module WasteCodeController
  def self.complete(waste_code = 'Basel Annex IX')
    whats_waste_code_page = WhatIsTheWasteCodePage.new
    whats_waste_code_page.choose_option(waste_code)
    whats_waste_code_page.select_first_option
    TestStatus.set_test_status(:waste_code, waste_code)
    Log.info("Reference: #{waste_code}")
    whats_waste_code_page.save_and_continue
  end
end
