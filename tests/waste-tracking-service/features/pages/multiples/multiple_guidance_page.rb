# frozen_string_literal: true

# this page is for guidance pagedetails
class MultipleGuidancePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'multiples.guidance.bouncePage.title'
  FIRST_PARAGRAPH = Translations.value 'multiples.guidance.bouncePage.firstParagraph'
  SECOND_PARAGRAPH = Translations.value 'multiples.guidance.bouncePage.secondParagraph'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text FIRST_PARAGRAPH
    expect(self).to have_text SECOND_PARAGRAPH
  end

end
