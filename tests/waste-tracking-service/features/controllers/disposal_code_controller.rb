# frozen_string_literal: true

# Provides a way to happy path flow
module DisposalCodeController
  def self.complete
    disposal_code_page = DisposalCodePage.new
    disposal_code_page.select_first_option
    disposal_code_page.save_and_continue
  end
end
