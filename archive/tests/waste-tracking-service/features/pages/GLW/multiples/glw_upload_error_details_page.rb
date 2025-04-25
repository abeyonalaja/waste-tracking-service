# frozen_string_literal: true
# frozen_string_literal: true

# this page glw error details page
class GlwUploadErrorDetailsPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  LEAD_PARAGRAPH = Translations.value 'multiples.errorSummaryPage.errorList.rowCorrection.para'
  REVIEW_THE_GUIDANCE = Translations.value 'multiples.errorSummaryPage.errorList.heading'
  ERROR_DESCRIPTION = Translations.value 'multiples.errorSummaryPage.errorListTable.heading'

  def check_page_displayed(row, errors)
    expect(self).to have_css 'h1', text: "Correct all errors for row #{row}", exact_text: true
    expect(self).to have_css 'h2', text: "You have #{errors}", exact_text: true
  end

  def return_to_error_summary_table
    click_link Translations.value 'multiples.errorSummaryPage.errorListTable.button'
  end

  def check_page_translation
    expect(self).to have_text LEAD_PARAGRAPH
    expect(self).to have_text REVIEW_THE_GUIDANCE
    expect(self).to have_text ERROR_DESCRIPTION
  end
end
