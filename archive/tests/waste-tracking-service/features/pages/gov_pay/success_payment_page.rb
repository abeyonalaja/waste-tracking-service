# frozen_string_literal: true

# this page is for ukmw service charge Success Payment page details
class SuccessPaymentPage < GenericPage

  TITLE = Translations.ukmv_value 'charge.success.panel.title'
  TEXT = Translations.ukmv_value 'charge.success.panel.text'
  HEADING_ONE = Translations.ukmv_value 'charge.success.body.headingOne'
  HEADING_TWO = Translations.ukmv_value 'charge.success.body.headingTwo'
  CONTENT = Translations.ukmv_value 'charge.success.body.content'
  TABLE_ROW_ONE = Translations.ukmv_value 'charge.success.table.headingOne'
  TABLE_ROW_TWO = Translations.ukmv_value 'charge.success.table.headingTwo'
  LINK = Translations.ukmv_value 'charge.success.link'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text TEXT
    expect(self).to have_text HEADING_ONE
    expect(self).to have_text HEADING_TWO
    # []need to gsub date on this row] expect(self).to have_text CONTENT
    expect(self).to have_text TABLE_ROW_ONE
    expect(self).to have_text TABLE_ROW_TWO
    expect(self).to have_text LINK
  end

end
