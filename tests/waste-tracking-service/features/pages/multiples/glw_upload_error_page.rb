# frozen_string_literal: true

# this page glw error page
class GlwUploadErrorPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  # TITLE = Translations.value 'multiples.guidance.bouncePage.title'

  def check_page_displayed
    expect(self).to have_text 'You need to correct 4 errors before you can submit all your Annex VII records'
  end

  def check_page_errors
    # code here
  end
end
