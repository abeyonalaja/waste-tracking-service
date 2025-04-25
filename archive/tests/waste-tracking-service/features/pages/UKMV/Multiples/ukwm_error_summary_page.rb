# frozen_string_literal: true

# this page is for Ukwm error summary page details
class UkwmErrorSummaryPage < GenericPage
  include GeneralHelpers
  include ErrorBox

  HEADING = Translations.ukmv_value 'multiples.errors.totalErrorsSummary.heading'
  PROMPT = Translations.ukmv_value 'multiples.errors.totalErrorsSummary.prompt'
  LINK_TEXT = Translations.ukmv_value 'multiples.errors.totalErrorsSummary.linkText'
  TITLE = Translations.ukmv_value 'multiples.errors.page.headingOne'
  HEADING2 = Translations.ukmv_value 'multiples.errors.page.headingTwo'
  PARAGRAPH = Translations.ukmv_value 'multiples.errors.page.paragraphOne'
  PARAGRAPH2 = Translations.ukmv_value 'multiples.errors.page.paragraphTwo'
  INSTRUCTION = Translations.ukmv_value 'multiples.errors.instructions.paragraphOne'
  INSTRUCTION2_ONE = Translations.ukmv_value 'multiples.errors.instructions.paragraphTwoOne'
  INSTRUCTION2_LINK = Translations.ukmv_value 'multiples.errors.instructions.linkText'
  INSTRUCTION2_TWO = Translations.ukmv_value 'multiples.errors.instructions.paragraphTwoTwo'
  UPLOAD_PARAGRAPH = Translations.ukmv_value 'multiples.errors.uploadForm.heading'

  ERROR_BY_COLUMN = Translations.ukmv_value 'multiples.errors.errorTab.byColumn'
  ERROR_BY_ROW = Translations.ukmv_value 'multiples.errors.errorTab.byRow'
  ERROR_COLUMN_TYPE = Translations.ukmv_value 'multiples.errors.errorTab.columnType'
  ERROR_ROW_TYPE = Translations.ukmv_value 'multiples.errors.errorTab.rowType'
  ERROR_AMOUNT = Translations.ukmv_value 'multiples.errors.errorTab.errorAmount'
  ERROR_TYPE = Translations.ukmv_value 'multiples.errors.errorTab.errorType'
  ACTION = Translations.ukmv_value 'multiples.errors.errorTab.action'

  ERROR_COUNT = Translations.ukmv_value 'multiples.errors.errorRow.errorCount'
  ROW_NUMBER = Translations.ukmv_value 'multiples.errors.errorRow.rowNumber'
  REASON = Translations.ukmv_value 'multiples.errors.errorRow.reason'
  DETAILS = Translations.ukmv_value 'multiples.errors.errorRow.details'
  SHOW = Translations.ukmv_value 'multiples.errors.errorRow.show'
  HIDE = Translations.ukmv_value 'multiples.errors.errorRow.hide'

  def check_page_displayed(errors_count)
    title = HEADING.gsub!('{ totalErrorCount }', errors_count.to_s)
    expect(self).to have_css 'h2', text: title, exact_text: true
  end

  def by_column_error_count
    all(:css, '#by-column >table >tbody >tr').count
  end

  def column_errors
    errors = {}
    within(:css, '#by-column >table >tbody') do
      all(:css, 'tbody.govuk-table__body > tr.govuk-table__row').each_with_index do |row, index|
        # Get the error count and type
        error_type = find("column-row-#{index}-error-type").text.strip

        # Initialize errors for this type
        errors[error_type] ||= []
        # click show link
        find("column-row-#{index}-action").click
        within "column-row-#{index}-details" do
          detail_rows = all(:css, 'tbody > tr')
          detail_rows.each_with_index do |row, ind|
            row_number = find("column-row-#{index}-details-#{ind}-row-number").text.strip
            error_reason = find("column-row-#{index}-details-#{ind}-error-reason").text.strip
            errors[error_type] << { row_number: row_number, error_reason: error_reason }
          end
        end
      end
    end
    errors
  end

  def row_errors
    errors = {}
    within(:css, '#by-row >table >tbody') do
      all(:css, 'tbody.govuk-table__body > tr.govuk-table__row').each_with_index do |row, index|
        # Get the error count and type
        # row-row-0-row-number
        error_row = find("row-row-#{index}-row-number").text.strip

        # Initialize errors for this type
        errors[error_row] ||= []
        # click show link
        find("row-row-#{index}-action").click
        within "row-row-#{index}-details" do
          detail_rows = all(:css, 'tbody > tr')
          detail_rows.each_with_index do |row, ind|
            error_reason = find("row-row-#{index}-details-#{ind}-error-details").text.strip
            errors[error_row] << { row_number: error_row, error_reason: error_reason }
          end
        end
      end
    end
    errors
  end

  # column table
  def column_name(index)
    find("column-row-#{index}-column-name").text
  end

  def column_error_type(index)
    find("column-row-#{index}-error-type").text
  end

  def column_action(index)
    find("column-row-#{index}-action").click
  end

  def column_row_details(row, data)
    find("column-row-#{row}-details-#{data}-error-reason").text
  end

  def column_row_numbers_details(row, data)
    find("column-row-#{row}-details-#{data}-row-number").text
  end

  # rows table
  def rows_row_number(index)
    find("row-row-#{index}-row-number").text
  end

  def rows_error_amount(index)
    find("row-row-#{index}-error-amount").text
  end

  def rows_action(index)
    find("row-row-#{index}-action").click
  end

  def rows_row_details(row, data)
    find("row-row-#{row}-details-#{data}-error-details").text
  end

  def check_page_translation
    find('column-row-0-action').click
    expect(self).to have_text TITLE
    expect(self).to have_text PROMPT
    expect(self).to have_text LINK_TEXT
    expect(self).to have_text HEADING2
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text PARAGRAPH2
    expect(self).to have_text INSTRUCTION
    expect(self).to have_text INSTRUCTION2_ONE
    expect(self).to have_text INSTRUCTION2_LINK
    expect(self).to have_text INSTRUCTION2_TWO
    expect(self).to have_text UPLOAD_PARAGRAPH
    expect(self).to have_text ERROR_BY_COLUMN
    expect(self).to have_text ERROR_BY_ROW
    expect(self).to have_text ERROR_COLUMN_TYPE
    expect(self).to have_text ERROR_ROW_TYPE
    expect(self).to have_text ERROR_TYPE
    expect(self).to have_text REASON
    click_on 'tab_by-row'
    expect(self).to have_text SHOW
    find('row-row-0-action').click
    expect(self).to have_text HIDE
    expect(self).to have_text ERROR_AMOUNT
    expect(self).to have_text ACTION
    expect(self).to have_text ERROR_COUNT
    expect(self).to have_text ROW_NUMBER
    expect(self).to have_text DETAILS
    click_on 'tab_by-column'
  end

end
