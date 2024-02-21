# frozen_string_literal: true
# frozen_string_literal: true

# this page glw error details page
class GlwCsvDeclarationPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  TITLE = Translations.value 'multiples.submit.heading'
  DECLARATION = Translations.value 'multiples.errorSummaryPage.submit.declaration'
  FIRST_HEADING = Translations.value 'multiples.errorSummaryPage.submit.list.itemOne'
  SECOND_HEADING = Translations.value 'multiples.errorSummaryPage.submit.list.itemTwo'
  THIRD_HEADING = Translations.value 'multiples.errorSummaryPage.submit.list.itemThree'
  FOURTH_HEADING = Translations.value 'multiples.errorSummaryPage.submit.list.itemFour'

  def check_page_displayed(rows)
    title = TITLE.gsub('{{count}}', rows.to_s)
    expect(self).to have_css 'h1', text: title, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text DECLARATION
    expect(self).to have_text FIRST_HEADING
    expect(self).to have_text SECOND_HEADING
    expect(self).to have_text THIRD_HEADING
    expect(self).to have_text FOURTH_HEADING
  end
end
