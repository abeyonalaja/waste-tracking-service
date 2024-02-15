# frozen_string_literal: true

# Module is for cancel glw upload page
class GlwCancelUploadPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'multiples.cancel.title'
  HINT_TEXT = Translations.value 'multiples.success.intro'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translated
    expect(self).to have_text HINT_TEXT
  end
end
