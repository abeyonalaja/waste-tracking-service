# frozen_string_literal: true

# this page is for ukmw multiples interruption page details
class UkwmInterruptionPage < GenericPage

  TITLE = Translations.ukmv_value 'interruption.heading'
  PARAGRAPH = Translations.ukmv_value 'interruption.paragraphOne'
  PARAGRAPH2 = Translations.ukmv_value 'interruption.paragraphTwo'
  LINK = Translations.ukmv_value 'interruption.link'
  CONTINUE_BUTTON = Translations.ukmv_value 'interruption.button'

  def check_page_displayed
    expect(self).to have_css 'h1', text: TITLE, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text PARAGRAPH
    expect(self).to have_text PARAGRAPH2
    expect(self).to have_text LINK
    expect(self).to have_text CONTINUE_BUTTON
  end

end
