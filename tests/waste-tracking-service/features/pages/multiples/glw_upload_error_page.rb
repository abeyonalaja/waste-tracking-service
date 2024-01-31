# frozen_string_literal: true

# this page glw error page
class GlwUploadErrorPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  # NEED TO ADD BANNER DYNAMIC TEXT
  TITLE = Translations.value 'multiples.errorSummaryPage.heading'
  LEAD_PARAGRAPH = Translations.value 'multiples.errorSummaryPage.leadParagraph'
  ERROR_SUMMARY = Translations.value 'multiples.errorSummaryPage.errorSummary.title'
  START_PARAGRAPH = Translations.value 'multiples.errorSummaryPage.errorSummary.startParagraph'
  ROW = Translations.value 'multiples.errorSummaryPage.errorSummaryTableHeader.row'
  ERROR_AMOUNT = Translations.value 'multiples.errorSummaryPage.errorSummaryTableHeader.error'
  ACTION = Translations.value 'multiples.errorSummaryPage.errorSummaryTableHeader.action'
  END_PARAGRAPH = Translations.value 'multiples.errorSummaryPage.errorSummary.endParagraph'
  UPLOAD_TEXT = Translations.value 'multiples.errorSummaryPage.uploadForm.titleSecond'
  UPLOAD_BUTTON = Translations.value 'multiples.guidance.upload.button'
  BANNER_TITLE = Translations.value 'multiples.errorSummaryPage.important'

  # LINK PARAGRAPH
  LINK_START = Translations.value 'multiples.errorSummaryPage.linkParagraphStart'
  LINK = Translations.value 'multiples.errorSummaryPage.linkGuidanceText'
  LINK_END = Translations.value 'multiples.errorSummaryPage.linkParagraphEnd'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_errors(error_count)
    expect(self).to have_text "You need to correct #{error_count} errors before you can submit all your Annex VII records"
  end

  def csv_error_count
    all(:css, 'table > tbody >tr').count
  end

  def csv_view_error_details
    all(:css, 'tbody > tr > td:nth-child(3) > a')
  end

  def click_csv_view_error_details_link(index)
    links = all(:css, 'tbody > tr > td:nth-child(3) > a')
    if index >= 0 && index < links.length
      links[index].click
    end
  end

  def get_error_count_at_index(index)
    element = all(:css, 'tbody > tr > td:nth-child(2)')[index]
    element ? element.text : nil
  end

  def get_error_row_number_at_index(index)
    element = all(:css, 'tbody > tr > td:nth-child(1) > strong ')[index]
    element ? element.text : nil
  end

  def check_page_translation
    expect(self).to have_text TITLE
    expect(self).to have_text LEAD_PARAGRAPH
    expect(self).to have_text ERROR_SUMMARY
    expect(self).to have_text START_PARAGRAPH
    expect(self).to have_text ROW
    expect(self).to have_text ERROR_AMOUNT
    expect(self).to have_text ACTION
    expect(self).to have_text END_PARAGRAPH
    expect(self).to have_text UPLOAD_TEXT
    expect(self).to have_text UPLOAD_BUTTON
    expect(self).to have_text BANNER_TITLE
  end

end
