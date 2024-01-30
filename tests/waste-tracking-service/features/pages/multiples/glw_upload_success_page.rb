# frozen_string_literal: true

# Module is for glw upload success page
class GlwUploadSuccessPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  # TITLE = Translations.value 'multiples.guidance.heading'

  def check_page_displayed
    expect(self).to have_text 'You have no errors in your 1 Annex VII record and you can submit it.'
  end

end
