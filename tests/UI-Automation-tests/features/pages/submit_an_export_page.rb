# frozen_string_literal: true

# this page is for submit an export page details
class SubmitAnExportPage < GenericPage
  def check_page_displayed
    expect(self).to have_css 'h1', text: 'Submit an export', exact_text: true
  end

end
