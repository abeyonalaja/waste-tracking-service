# frozen_string_literal: true
#
# this page is for guidance temp details
class MultipleGuidanceBouncePage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'multiples.guidance.bouncePage.title'
  FIRST_PARAGRAPH = Translations.value 'multiples.guidance.bouncePage.firstParagraph'
  SECOND_PARAGRAPH = Translations.value 'multiples.guidance.bouncePage.secondParagraph'
  LINK = Translations.value 'multiples.guidance.document.html.link'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text FIRST_PARAGRAPH
    expect(self).to have_text SECOND_PARAGRAPH
    expect(self).to have_text LINK
  end
end
