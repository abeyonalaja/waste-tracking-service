# frozen_string_literal: true

# this page is for create multiple annex records page details
class GlwUploadPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'multiples.guidance.bouncePage.title'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

end
