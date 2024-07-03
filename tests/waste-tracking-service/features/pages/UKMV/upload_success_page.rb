# frozen_string_literal: true

# this page is for ukmw upload success page details
class UkwmUploadSuccessPage < GenericPage

  NOTIFICATION_TITLE = Translations.ukmv_value 'multiples.success.notificationTitle'
  HEADING = (Translations.ukmv_value 'multiples.success.heading').gsub!('{count, plural, =1 {record} other {records}}', 'records')
  HEADING_CORRECTION = Translations.ukmv_value 'multiples.success.headingAfterCorrection'
  PAGE_HEADING = (Translations.ukmv_value 'multiples.success.pageHeading').gsub!('{count, plural, =1 {record} other {records}}', 'records')
  WARNING = Translations.ukmv_value 'multiples.success.warning'
  BODY = Translations.ukmv_value 'multiples.success.body'
  CONTINUE_BUTTON = Translations.ukmv_value 'multiples.success.button'
  CANCEL_BUTTON = Translations.ukmv_value 'multiples.success.cancelLink'

  def check_page_displayed(count)
    expect(self).to have_css 'p', text: HEADING.gsub!('{count}', count), exact_text: true, wait: 10
  end

  def check_page_displayed_1_record
    expect(self).to have_css 'p', text: (Translations.ukmv_value 'multiples.success.heading').gsub!('{1, plural, =1 {record} other {records}}', 'record'), exact_text: true, wait: 10
  end

  def check_page_translation(count)
    expect(self).to have_text NOTIFICATION_TITLE
    expect(self).to have_text PAGE_HEADING.gsub!('{count}', count)
    expect(self).to have_text WARNING
    expect(self).to have_text BODY
    expect(self).to have_text CONTINUE_BUTTON
    expect(self).to have_text CANCEL_BUTTON
  end

  def continue_and_create
    click_on CONTINUE_BUTTON
  end

  def cancel_button
    click_on CANCEL_BUTTON
  end
end
