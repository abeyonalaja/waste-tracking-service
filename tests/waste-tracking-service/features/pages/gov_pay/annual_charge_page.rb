# frozen_string_literal: true

# this page is for ukmw service charge annual charge page details
class AnnualChargePage < GenericPage
  include GeneralHelpers

  TITLE = Translations.ukmv_value 'charge.review.headingOne'
  CAPTION = Translations.ukmv_value 'charge.review.caption'
  PARAGRAPH_ONE = Translations.ukmv_value 'charge.review.paragraphOne'
  HEADING_TWO = Translations.ukmv_value 'charge.review.headingTwo'
  TABLE_HEADING = Translations.ukmv_value 'charge.review.tableHeading'
  CONTINUE_BUTTON = Translations.ukmv_value 'charge.review.buttonAction'
  CANCEL_BUTTON = Translations.ukmv_value 'charge.review.buttonCancel'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text PARAGRAPH_ONE.gsub('{date}', -> { date = Date.today.next_year - 1; date.strftime("%A #{date.day.ordinalize} %B %Y") }.call)
    expect(self).to have_text HEADING_TWO
    expect(self).to have_text TABLE_HEADING
    expect(self).to have_text CONTINUE_BUTTON
    expect(self).to have_text CANCEL_BUTTON
  end

end
