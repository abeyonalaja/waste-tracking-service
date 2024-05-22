# frozen_string_literal: true

# this page is for ukmw bulk confirmation page details
class UkwmBulkConfirmationPage < GenericPage

  # BANNER = '{count} waste movements created'
  SUB_HEADING = Translations.ukmv_value 'multiples.confirmation.subHeading1'
  BODY_P1 = Translations.ukmv_value 'multiples.confirmation.bodyP1'
  BODY_P2 = Translations.ukmv_value 'multiples.confirmation.bodyP2'
  BULLET1 = Translations.ukmv_value 'multiples.confirmation.bullet1'
  SUB_HEADING2 = Translations.ukmv_value 'multiples.confirmation.subHeading2'
  BODY_P3 = Translations.ukmv_value 'multiples.confirmation.bodyP3'
  RETURN_BUTTON = Translations.ukmv_value 'multiples.confirmation.button'

  def check_page_displayed(count)
    title = '{count} waste movements created'.gsub('{count}', count)
    expect(self).to have_css 'h1', text: title, exact_text: true
  end

  def check_page_translation
    expect(self).to have_text SUB_HEADING
    expect(self).to have_text BODY_P1
    expect(self).to have_text BODY_P2
    expect(self).to have_text BODY_P3
    expect(self).to have_text SUB_HEADING2
    expect(self).to have_text RETURN_BUTTON
  end

  def return_button
    click_on RETURN_BUTTON
  end
end
