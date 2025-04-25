# frozen_string_literal: true

# this page is for sic codee page details
class SicCodePage < GenericPage
  include CommonComponents
  include PageHelper
  include ErrorBox
  include GeneralHelpers

  TITLE = Translations.ukmv_value 'single.producer.sicCodes.titleNone'
  CAPTION = Translations.ukmv_value 'single.producer.sicCodes.caption'
  DESCRIPTION = Translations.ukmv_value 'single.producer.sicCodes.description'
  LINK = Translations.ukmv_value 'single.producer.sicCodes.link'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text CAPTION
    expect(self).to have_text DESCRIPTION
    expect(self).to have_text LINK
  end

  def select_sic_code
    first('sic-code', minimum: 1).click
    first('sic-code__option--58', minimum: 1).select_option
    TestStatus.set_test_status(:sic_code_description, first('sic-code').value)
  end

  def select_no_option
    page.find(id:'selection-no').click
  end

end
