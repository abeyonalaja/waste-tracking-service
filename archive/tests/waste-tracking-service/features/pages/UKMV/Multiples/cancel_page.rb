# frozen_string_literal: true

# this page is for ukwm cancel page details
class UkwmCancelPage < GenericPage

  TITLE = Translations.ukmv_value 'multiples.cancel.heading'
  PARAGRAPH = Translations.ukmv_value 'multiples.cancel.paragraph'
  CANCEL_BUTTON = Translations.ukmv_value 'multiples.cancel.button'
  CREATE_BUTTON = Translations.ukmv_value 'multiples.cancel.buttonSecondary'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text CANCEL_BUTTON
    expect(self).to have_text CREATE_BUTTON
  end

  def cancel_button
    click_on CANCEL_BUTTON
  end

  def create_button
    click_on CREATE_BUTTON
  end
end
