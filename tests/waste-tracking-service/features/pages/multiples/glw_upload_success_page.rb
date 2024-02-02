# frozen_string_literal: true

# Module is for glw upload success page
class GlwUploadSuccessPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  HINT_TEXT = Translations.value 'multiples.success.intro'

  def check_page_displayed
    expect(self).to have_text 'You have no errors in your 1 Annex VII record and you can submit it.'
  end

  def check_page_translation
    expect(self).to have_text HINT_TEXT
  end

  def check_csv_with_no_error_displayed
    expect(self).to have_text 'You have corrected all your errors and can submit 1 Annex VII record.'
  end

end
